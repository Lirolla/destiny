"""
Chatterbox TTS on Modal with GPU Support
Deploy with: modal deploy modal_chatterbox.py
"""
import modal

# Create Modal app
app = modal.App("chatterbox-tts")

# Define the image with Chatterbox TTS and dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "chatterbox-tts",
        "torch",
        "torchaudio",
        "transformers",
        "huggingface_hub",
        "peft",
    )
    .env({"HF_TOKEN": "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"})
    .run_commands(
        "python -c 'from chatterbox.tts_turbo import ChatterboxTurboTTS; ChatterboxTurboTTS.from_pretrained(device=\"cpu\")'"
    )
)

# Create volume for voice samples
voice_volume = modal.Volume.from_name("chatterbox-voices", create_if_missing=True)
VOICE_DIR = "/voices"

@app.cls(
    image=image,
    gpu="T4",  # Use NVIDIA T4 GPU
    timeout=600,  # 10 minute timeout
    volumes={VOICE_DIR: voice_volume},
)
class ChatterboxTTS:
    @modal.enter()
    def load_model(self):
        """Load model on GPU when container starts"""
        import torch
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading Chatterbox model on {device}...")
        self.model = ChatterboxTurboTTS.from_pretrained(device=device)
        self.device = device
        print("Model loaded successfully")
    
    @modal.method()
    def upload_voice(self, voice_name: str, voice_data_b64: str):
        """
        Upload a voice sample to the volume
        
        Args:
            voice_name: Name for the voice (e.g., "marco")
            voice_data_b64: Base64-encoded WAV audio
        """
        import base64
        import pathlib
        
        voice_path = pathlib.Path(VOICE_DIR) / f"{voice_name}.wav"
        voice_bytes = base64.b64decode(voice_data_b64)
        voice_path.write_bytes(voice_bytes)
        
        # Commit the volume
        voice_volume.commit()
        
        return {"voice_path": str(voice_path)}
    
    @modal.method()
    def generate(self, text: str, voice_name: str = "marco") -> dict:
        """
        Generate speech from text using voice cloning
        
        Args:
            text: Text to synthesize
            voice_name: Name of the voice sample to use
        
        Returns:
            dict with 'audio_b64' (base64-encoded WAV) and 'sample_rate'
        """
        import torchaudio
        import base64
        import io
        import pathlib
        
        # Get voice sample path
        voice_path = pathlib.Path(VOICE_DIR) / f"{voice_name}.wav"
        
        if not voice_path.exists():
            raise FileNotFoundError(f"Voice sample '{voice_name}' not found at {voice_path}")
        
        # Generate audio
        print(f"Generating audio for text: {text[:50]}...")
        wav = self.model.generate(
            text,
            audio_prompt_path=str(voice_path)
        )
        
        # Convert to WAV bytes
        audio_buffer = io.BytesIO()
        torchaudio.save(audio_buffer, wav, self.model.sr, format="wav")
        audio_bytes = audio_buffer.getvalue()
        
        # Encode to base64
        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return {
            "audio_b64": audio_b64,
            "sample_rate": self.model.sr,
            "text_length": len(text)
        }

@app.local_entrypoint()
def test():
    """Test the deployment"""
    import base64
    
    # Load voice sample
    with open("/tmp/voice_sample.wav", "rb") as f:
        voice_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    # Upload voice sample
    tts = ChatterboxTTS()
    print("Uploading voice sample...")
    result = tts.upload_voice.remote(voice_name="marco", voice_data_b64=voice_b64)
    print(f"Voice uploaded: {result}")
    
    # Test generation
    print("Generating test audio...")
    result = tts.generate.remote(
        text="This is a test of the Chatterbox text to speech system running on Modal with voice cloning.",
        voice_name="marco"
    )
    
    # Save output
    audio_bytes = base64.b64decode(result["audio_b64"])
    with open("/tmp/modal_test_output.wav", "wb") as f:
        f.write(audio_bytes)
    
    print(f"✅ Test successful! Audio saved to /tmp/modal_test_output.wav")
    print(f"   Text length: {result['text_length']}")
    print(f"   Sample rate: {result['sample_rate']}")

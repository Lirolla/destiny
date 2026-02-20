import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const resolveApiUrl = () => {
  const provider = ENV.llmProvider;

  if (provider === "openai") {
    return "https://api.openai.com/v1/chat/completions";
  }

  // TODO: Add native Anthropic API format support
  // Anthropic uses /v1/messages with anthropic-version header
  // For now, only manus and openai are fully supported
  if (provider === "anthropic") {
    return "https://api.anthropic.com/v1/messages";
  }

  // Default: OpenAI
  return "https://api.openai.com/v1/chat/completions";
};

const resolveApiKey = () => {
  const provider = ENV.llmProvider;
  if (provider === "openai") return ENV.openaiApiKey;
  if (provider === "anthropic") return ENV.anthropicApiKey;
  return ENV.openaiApiKey;
};

const resolveModel = () => {
  if (ENV.llmModel) return ENV.llmModel;
  const provider = ENV.llmProvider;
  if (provider === "openai") return "gpt-4o";
  if (provider === "anthropic") return "claude-sonnet-4-20250514";
  return "gemini-2.5-flash";
};

const assertApiKey = () => {
  const key = resolveApiKey();
  if (!key) {
    throw new Error(`API key not configured for LLM provider: ${ENV.llmProvider}`);
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

/**
 * Convert OpenAI-style messages to Anthropic /v1/messages format.
 * Anthropic separates the system prompt from the messages array.
 */
function buildAnthropicPayload(
  messages: Message[],
  model: string,
  tools?: Tool[],
  toolChoice?: ReturnType<typeof normalizeToolChoice>,
  maxTokens?: number
): { payload: Record<string, unknown>; } {
  // Extract system messages
  const systemMessages = messages.filter((m) => m.role === "system");
  const nonSystemMessages = messages.filter((m) => m.role !== "system");

  const systemText = systemMessages
    .map((m) => {
      const content = m.content;
      if (typeof content === "string") return content;
      if (Array.isArray(content)) {
        return content
          .map((p) => (typeof p === "string" ? p : "text" in p ? p.text : ""))
          .join("\n");
      }
      return "text" in content ? content.text : "";
    })
    .join("\n\n");

  // Convert messages to Anthropic format
  const anthropicMessages = nonSystemMessages.map((m) => {
    const normalized = normalizeMessage(m);
    const content = normalized.content;

    if (typeof content === "string") {
      return { role: normalized.role === "assistant" ? "assistant" : "user", content };
    }

    // Convert content array
    if (Array.isArray(content)) {
      const anthropicContent = content.map((part: Record<string, unknown>) => {
        if ((part as TextContent).type === "text") {
          return { type: "text", text: (part as TextContent).text };
        }
        if ((part as ImageContent).type === "image_url") {
          const imgPart = part as ImageContent;
          return {
            type: "image",
            source: {
              type: "url",
              url: imgPart.image_url.url,
            },
          };
        }
        return { type: "text", text: JSON.stringify(part) };
      });
      return {
        role: normalized.role === "assistant" ? "assistant" : "user",
        content: anthropicContent,
      };
    }

    return { role: normalized.role === "assistant" ? "assistant" : "user", content: String(content) };
  });

  const payload: Record<string, unknown> = {
    model,
    max_tokens: maxTokens || 4096,
    messages: anthropicMessages,
  };

  if (systemText) {
    payload.system = systemText;
  }

  // Convert tools to Anthropic format
  if (tools && tools.length > 0) {
    payload.tools = tools.map((t) => ({
      name: t.function.name,
      description: t.function.description || "",
      input_schema: t.function.parameters || { type: "object", properties: {} },
    }));
  }

  // Convert tool_choice
  if (toolChoice) {
    if (toolChoice === "auto") {
      payload.tool_choice = { type: "auto" };
    } else if (toolChoice === "none") {
      // Anthropic doesn't have "none" — omit tool_choice
    } else if (typeof toolChoice === "object" && "function" in toolChoice) {
      payload.tool_choice = { type: "tool", name: toolChoice.function.name };
    }
  }

  return { payload };
}

/**
 * Convert Anthropic response to OpenAI-compatible InvokeResult.
 */
function convertAnthropicResponse(anthropicResp: Record<string, unknown>): InvokeResult {
  const content = anthropicResp.content as Array<Record<string, unknown>> || [];

  // Extract text content
  const textParts = content
    .filter((c) => c.type === "text")
    .map((c) => c.text as string);
  const fullText = textParts.join("");

  // Extract tool use blocks
  const toolUseParts = content.filter((c) => c.type === "tool_use");
  const toolCalls: ToolCall[] = toolUseParts.map((tu) => ({
    id: tu.id as string,
    type: "function" as const,
    function: {
      name: tu.name as string,
      arguments: JSON.stringify(tu.input),
    },
  }));

  const usage = anthropicResp.usage as Record<string, number> | undefined;

  return {
    id: anthropicResp.id as string || "anthropic-" + Date.now(),
    created: Math.floor(Date.now() / 1000),
    model: anthropicResp.model as string || "claude",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: fullText,
          ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
        },
        finish_reason:
          (anthropicResp.stop_reason as string) === "end_turn"
            ? "stop"
            : (anthropicResp.stop_reason as string) === "tool_use"
              ? "tool_calls"
              : (anthropicResp.stop_reason as string) || "stop",
      },
    ],
    usage: usage
      ? {
          prompt_tokens: usage.input_tokens || 0,
          completion_tokens: usage.output_tokens || 0,
          total_tokens: (usage.input_tokens || 0) + (usage.output_tokens || 0),
        }
      : undefined,
  };
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  assertApiKey();

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    maxTokens,
    max_tokens,
  } = params;

  const isAnthropic = ENV.llmProvider === "anthropic";
  const model = resolveModel();
  const apiKey = resolveApiKey();

  const normalizedTC = normalizeToolChoice(toolChoice || tool_choice, tools);

  // ── Anthropic path ──
  if (isAnthropic) {
    const { payload } = buildAnthropicPayload(
      messages,
      model,
      tools,
      normalizedTC,
      maxTokens || max_tokens
    );

    const headers: Record<string, string> = {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    const response = await fetch(resolveApiUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Anthropic invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
      );
    }

    const anthropicResp = (await response.json()) as Record<string, unknown>;
    return convertAnthropicResponse(anthropicResp);
  }

  // ── OpenAI / Manus Forge path ──
  const payload: Record<string, unknown> = {
    model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  if (normalizedTC) {
    payload.tool_choice = normalizedTC;
  }

  payload.max_tokens = maxTokens || max_tokens || 32768;
  payload.thinking = {
    "budget_tokens": 128
  };

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

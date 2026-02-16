import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t({ en: "Back", pt: "Voltar", es: "Volver" })}
        </Link>

        <h1 className="text-2xl font-bold mb-2">
          {t({ en: "Privacy Policy", pt: "Política de Privacidade", es: "Política de Privacidad" })}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {t({ en: "Last Updated: February 2026", pt: "Última Atualização: Fevereiro 2026", es: "Última Actualización: Febrero 2026" })}
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">

          <h2>1. {t({ en: "Introduction", pt: "Introdução", es: "Introducción" })}</h2>
          <p>
            {t({
              en: 'Destiny Hacking ("the App") is a personal development and self-improvement application operated by Merx Digital Solutions Ltd, a company registered in England and Wales ("we", "us", "our", "the Company").',
              pt: 'Destiny Hacking ("o App") é um aplicativo de desenvolvimento pessoal e autoaperfeiçoamento operado pela Merx Digital Solutions Ltd, uma empresa registrada na Inglaterra e País de Gales ("nós", "nosso", "a Empresa").',
              es: 'Destiny Hacking ("la App") es una aplicación de desarrollo personal y automejora operada por Merx Digital Solutions Ltd, una empresa registrada en Inglaterra y Gales ("nosotros", "nosso", "la Compañía").'
            })}
          </p>
          <p>
            {t({
              en: "We are committed to protecting your privacy and handling your personal data transparently and securely. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the Destiny Hacking mobile application and any related services.",
              pt: "Estamos comprometidos em proteger sua privacidade e tratar seus dados pessoais de forma transparente e segura. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você usa o aplicativo móvel Destiny Hacking e quaisquer serviços relacionados.",
              es: "Estamos comprometidos a proteger su privacidad y manejar sus datos personales de manera transparente y segura. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando utiliza la aplicación móvil Destiny Hacking y cualquier servicio relacionado."
            })}
          </p>
          <p>
            <strong>{t({ en: "Data Controller:", pt: "Controlador de Dados:", es: "Controlador de Datos:" })}</strong> Merx Digital Solutions Ltd<br />
             <strong>{t({ en: "Company Number:", pt: "Número da Empresa:", es: "Número de Empresa:" })}</strong> 16920547<br />
             <strong>{t({ en: "Registered Address:", pt: "Endereço Registrado:", es: "Dirección Registrada:" })}</strong> 128 City Road, London, United Kingdom, EC1V 2NX<br />
             <strong>{t({ en: "Contact Email:", pt: "E-mail de Contato:", es: "Correo Electrónico de Contacto:" })}</strong> privacy@destinyhacking.app
          </p>

          <h2>2. {t({ en: "What Data We Collect", pt: "Quais Dados Coletamos", es: "Qué Datos Recopilamos" })}</h2>

          <h3>2.1 {t({ en: "Account Information", pt: "Informações da Conta", es: "Información de la Cuenta" })}</h3>
          <ul>
            <li>{t({ en: "Email address (used for account creation and login)", pt: "Endereço de e-mail (usado para criação de conta e login)", es: "Dirección de correo electrónico (utilizada para la creación de la cuenta y el inicio de sesión)" })}</li>
            <li>{t({ en: "Password (stored securely using industry-standard hashing; we never store plaintext passwords)", pt: "Senha (armazenada com segurança usando hash padrão da indústria; nunca armazenamos senhas em texto simples)", es: "Contraseña (almacenada de forma segura mediante hash estándar de la industria; nunca almacenamos contraseñas en texto plano)" })}</li>
            <li>{t({ en: "Display name or username (optional)", pt: "Nome de exibição ou nome de usuário (opcional)", es: "Nombre de usuario o alias (opcional)" })}</li>
            <li>{t({ en: "Language preference (English or Portuguese)", pt: "Preferência de idioma (Inglês ou Português)", es: "Preferencia de idioma (inglés o portugués)" })}</li>
          </ul>

          <h3>2.2 {t({ en: "App Usage Data", pt: "Dados de Uso do App", es: "Datos de Uso de la App" })}</h3>
          <ul>
            <li>{t({ en: "Daily Cycle completion records (morning, midday, evening calibrations)", pt: "Registros de conclusão do Ciclo Diário (calibrações matutinas, vespertinas e noturnas)", es: "Registros de finalización del Ciclo Diario (calibraciones de mañana, mediodía y noche)" })}</li>
            <li>{t({ en: "Slider/axis values you set during calibration (your 15 axis scores)", pt: "Valores de slider/eixo que você define durante a calibração (suas 15 pontuações de eixo)", es: "Valores de control deslizante/eje que establece durante la Calibración (sus 15 puntuaciones de Eje)" })}</li>
            <li>{t({ en: "Destiny Score (calculated average of your axis values)", pt: "Pontuação de Destino (média calculada dos seus valores de eixo)", es: "Puntuación de Destino (promedio calculado de los valores de sus Ejes)" })}</li>
            <li>{t({ en: "Streak data (consecutive days of practice)", pt: "Dados de sequência (dias consecutivos de prática)", es: "Datos de racha (días consecutivos de práctica)" })}</li>
            <li>{t({ en: "Module and chapter progress", pt: "Progresso de módulos e capítulos", es: "Progreso de módulos y capítulos" })}</li>
            <li>{t({ en: "Audiobook listening progress", pt: "Progresso de escuta do audiolivro", es: "Progreso de escucha del audiolibro" })}</li>
            <li>{t({ en: "Achievement and badge data", pt: "Dados de conquistas e emblemas", es: "Datos de logros e insignias" })}</li>
            <li>{t({ en: "Intended actions and observed effects (text entries you provide voluntarily)", pt: "Ações pretendidas e efeitos observados (entradas de texto que você fornece voluntariamente)", es: "Acciones previstas y efectos observados (entradas de texto que proporciona voluntariamente)" })}</li>
            <li>{t({ en: "Reflection journal entries", pt: "Entradas do diário de reflexão", es: "Entradas del diario de reflexión" })}</li>
          </ul>

          <h3>2.3 {t({ en: "Technical Data", pt: "Dados Técnicos", es: "Datos Técnicos" })}</h3>
          <ul>
            <li>{t({ en: "Device type and operating system version", pt: "Tipo de dispositivo e versão do sistema operacional", es: "Tipo de dispositivo y versión del sistema operativo" })}</li>
            <li>{t({ en: "App version", pt: "Versão do App", es: "Versión de la app" })}</li>
            <li>{t({ en: "Anonymous crash reports and error logs", pt: "Relatórios de falhas anônimos e logs de erros", es: "Informes de fallos y registros de errores anónimos" })}</li>
            <li>{t({ en: "IP address (collected automatically by our servers; not stored long-term)", pt: "Endereço IP (coletado automaticamente por nossos servidores; não armazenado a longo prazo)", es: "Dirección IP (recopilada automáticamente por nuestros servidores; no se almacena a largo plazo)" })}</li>
          </ul>

          <h3>2.4 {t({ en: "Data We Do NOT Collect", pt: "Dados que NÃO Coletamos", es: "Datos que NO Recopilamos" })}</h3>
          <ul>
            <li>{t({ en: "We do not collect precise GPS location data", pt: "Não coletamos dados precisos de localização GPS", es: "No recopilamos datos precisos de ubicación GPS" })}</li>
            <li>{t({ en: "We do not collect contacts, photos, or files from your device", pt: "Não coletamos contatos, fotos ou arquivos do seu dispositivo", es: "No recopilamos contactos, fotos o archivos de su dispositivo" })}</li>
            <li>{t({ en: "We do not collect health data from Apple HealthKit or Google Fit", pt: "Não coletamos dados de saúde do Apple HealthKit ou Google Fit", es: "No recopilamos datos de salud de Apple HealthKit o Google Fit" })}</li>
            <li>{t({ en: "We do not collect financial or payment card data", pt: "Não coletamos dados financeiros ou de cartão de pagamento", es: "No recopilamos datos financieros o de tarjetas de pago" })}</li>
            <li>{t({ en: "We do not collect biometric data", pt: "Não coletamos dados biométricos", es: "No recopilamos datos biométricos" })}</li>
          </ul>

          <h2>3. {t({ en: "How We Use Your Data", pt: "Como Usamos Seus Dados", es: "Cómo Utilizamos Sus Datos" })}</h2>

          <h3>3.1 {t({ en: "To Provide the Service (Contractual Necessity)", pt: "Para Fornecer o Serviço (Necessidade Contratual)", es: "Para Prestar el Servicio (Necesidad Contractual)" })}</h3>
          <ul>
            <li>{t({ en: "Create and manage your account", pt: "Criar e gerenciar sua conta", es: "Crear y gestionar su cuenta" })}</li>
            <li>{t({ en: "Store your calibration data, progress, and streaks", pt: "Armazenar seus dados de calibração, progresso e sequências", es: "Almacenar sus datos de Calibración, progreso y rachas" })}</li>
            <li>{t({ en: "Calculate your Destiny Score and generate personalised insights", pt: "Calcular sua Pontuação de Destino e gerar insights personalizados", es: "Calcular su Puntuación de Destino y generar información personalizada" })}</li>
            <li>{t({ en: "Deliver AI-powered coaching suggestions based on your lowest-scoring axes", pt: "Fornecer sugestões de coaching com IA baseadas nos seus eixos com menor pontuação", es: "Ofrecer sugerencias de entrenamiento impulsadas por IA basadas en sus Ejes de menor puntuación" })}</li>
            <li>{t({ en: "Sync your data across your devices", pt: "Sincronizar seus dados entre seus dispositivos", es: "Sincronizar sus datos en todos sus dispositivos" })}</li>
          </ul>

          <h3>3.2 {t({ en: "To Improve the App (Legitimate Interest)", pt: "Para Melhorar o App (Interesse Legítimo)", es: "Para Mejorar la App (Interés Legítimo)" })}</h3>
          <ul>
            <li>{t({ en: "Analyse anonymised, aggregated usage patterns to improve features", pt: "Analisar padrões de uso anonimizados e agregados para melhorar recursos", es: "Analizar patrones de uso anónimos y agregados para mejorar las funciones" })}</li>
            <li>{t({ en: "Diagnose technical issues and fix bugs", pt: "Diagnosticar problemas técnicos e corrigir bugs", es: "Diagnosticar problemas técnicos y corregir errores" })}</li>
            <li>{t({ en: "Understand which features are most used to guide development priorities", pt: "Entender quais recursos são mais usados para orientar prioridades de desenvolvimento", es: "Comprender qué funciones son las más utilizadas para guiar las prioridades de desarrollo" })}</li>
          </ul>

          <h3>3.3 {t({ en: "To Communicate With You", pt: "Para Comunicar-se Com Você", es: "Para Comunicarnos con Usted" })}</h3>
          <ul>
            <li>{t({ en: "Send you optional push notifications (morning, midday, evening reminders) — only if you opt in", pt: "Enviar notificações push opcionais (lembretes matutinos, vespertinos e noturnos) — apenas se você optar por receber", es: "Enviarle notificaciones push opcionales (recordatorios por la mañana, mediodía y noche) — solo si usted lo autoriza" })}</li>
            <li>{t({ en: "Send essential account-related emails (password reset, security alerts)", pt: "Enviar e-mails essenciais relacionados à conta (redefinição de senha, alertas de segurança)", es: "Enviar correos electrónicos esenciales relacionados con la cuenta (restablecimiento de contraseña, alertas de seguridad)" })}</li>
            <li>{t({ en: "Respond to your support requests", pt: "Responder às suas solicitações de suporte", es: "Responder a sus solicitudes de soporte" })}</li>
          </ul>

          <h2>4. {t({ en: "AI Features and Third-Party AI Services", pt: "Recursos de IA e Serviços de IA de Terceiros", es: "Funciones de IA y Servicios de IA de Terceros" })}</h2>
          <p>{t({ en: 'Destiny Hacking includes an AI coaching feature (the "Stoic Strategist") that analyses your axis scores to provide personalised guidance.', pt: 'Destiny Hacking inclui um recurso de coaching com IA (o "Estrategista Estoico") que analisa suas pontuações de eixo para fornecer orientação personalizada.', es: 'Destiny Hacking incluye una función de entrenamiento con IA (el "Estratega Estoico") que analiza sus puntuaciones de Eje para proporcionar orientación personalizada.' })}</p>
          <p><strong>{t({ en: "Important:", pt: "Importante:", es: "Importante:" })}</strong> {t({ en: "When you use the AI coaching feature, your axis scores and relevant context may be sent to a third-party AI provider (such as OpenAI or Anthropic) to generate personalised responses. No personally identifiable information such as your name or email is included in these requests — only your anonymised axis values.", pt: "Quando você usa o recurso de coaching com IA, suas pontuações de eixo e contexto relevante podem ser enviados a um provedor de IA terceiro (como OpenAI ou Anthropic) para gerar respostas personalizadas. Nenhuma informação pessoalmente identificável, como seu nome ou e-mail, é incluída nessas solicitações — apenas seus valores de eixo anonimizados.", es: "Cuando utiliza la función de entrenamiento con IA, sus puntuaciones de Eje y el contexto relevante pueden enviarse a un proveedor de IA de terceros (como OpenAI o Anthropic) para generar respuestas personalizadas. No se incluye información de identificación personal, como su nombre o correo electrónico, en estas solicitudes, solo sus valores de Eje anónimos." })}</p>

          <h2>5. {t({ en: "Lawful Basis for Processing", pt: "Base Legal para Processamento", es: "Base Legal para el Procesamiento" })}</h2>
          <p>{t({ en: "Under the UK GDPR, we rely on the following lawful bases:", pt: "Sob o GDPR do Reino Unido, nos baseamos nas seguintes bases legais:", es: "Bajo el GDPR del Reino Unido, nos basamos en las siguientes bases legales:" })}</p>
          <ul>
            <li><strong>{t({ en: "Contractual Necessity", pt: "Necessidade Contratual", es: "Necesidad Contractual" })}</strong> — {t({ en: "Processing necessary to provide the app service you signed up for.", pt: "Processamento necessário para fornecer o serviço do app para o qual você se inscreveu.", es: "Procesamiento necesario para proporcionar el servicio de la aplicación al que se suscribió." })}</li>
            <li><strong>{t({ en: "Consent", pt: "Consentimento", es: "Consentimiento" })}</strong> — {t({ en: "For optional features such as push notifications, AI coaching, and marketing communications. You can withdraw consent at any time.", pt: "Para recursos opcionais como notificações push, coaching com IA e comunicações de marketing. Você pode retirar o consentimento a qualquer momento.", es: "Para funciones opcionales como notificaciones push, entrenamiento con IA y comunicaciones de marketing. Puede retirar su consentimiento en cualquier momento." })}</li>
            <li><strong>{t({ en: "Legitimate Interest", pt: "Interesse Legítimo", es: "Interés Legítimo" })}</strong> — {t({ en: "For anonymised analytics and app improvement.", pt: "Para análises anonimizadas e melhoria do app.", es: "Para análisis anónimos y mejora de la aplicación." })}</li>
          </ul>

          <h2>6. {t({ en: "Data Sharing and Third Parties", pt: "Compartilhamento de Dados e Terceiros", es: "Intercambio de Datos y Terceros" })}</h2>
          <p><strong>{t({ en: "We do not sell, rent, or trade your personal data to any third party.", pt: "Não vendemos, alugamos ou comercializamos seus dados pessoais para terceiros.", es: "No vendemos, alquilamos ni intercambiamos sus datos personales con ningún tercero." })}</strong></p>
          <p>{t({ en: "We may share limited data with service providers bound by data processing agreements: cloud hosting provider, AI service provider (anonymised axis data only), email service provider, and error monitoring service.", pt: "Podemos compartilhar dados limitados com provedores de serviços vinculados por acordos de processamento de dados: provedor de hospedagem em nuvem, provedor de serviço de IA (apenas dados de eixo anonimizados), provedor de serviço de e-mail e serviço de monitoramento de erros.", es: "Podemos compartir datos limitados con proveedores de servicios sujetos a acuerdos de procesamiento de datos: proveedor de alojamiento en la nube, proveedor de servicios de IA (solo datos de Eje anónimos), proveedor de servicios de correo electrónico y servicio de monitoreo de errores." })}</p>

          <h2>7. {t({ en: "International Data Transfers", pt: "Transferências Internacionais de Dados", es: "Transferencias Internacionales de Datos" })}</h2>
          <p>{t({ en: "Your data may be transferred to and processed in countries outside the United Kingdom or European Economic Area. Where such transfers occur, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the UK Information Commissioner's Office.", pt: "Seus dados podem ser transferidos e processados em países fora do Reino Unido ou do Espaço Econômico Europeu. Quando tais transferências ocorrem, garantimos que salvaguardas apropriadas estejam em vigor, incluindo Cláusulas Contractuais Padrão (SCCs) aprovadas pelo Escritório do Comissário de Informação do Reino Unido.", es: "Sus datos pueden ser transferidos y procesados en países fuera del Reino Unido o del Espacio Económico Europeo. Cuando ocurren dichas transferencias, nos aseguramos de que existan las garantías adecuadas, incluidas las Cláusulas Contractuales Estándar (CCE) aprobadas por la Oficina del Comisionado de Información del Reino Unido." })}</p>

          <h2>8. {t({ en: "Data Retention", pt: "Retenção de Dados", es: "Retención de Datos" })}</h2>
          <ul>
            <li><strong>{t({ en: "Account data:", pt: "Dados da conta:", es: "Datos de la cuenta:" })}</strong> {t({ en: "Retained while your account is active. Deleted within 30 days of account deletion.", pt: "Retidos enquanto sua conta estiver ativa. Excluídos dentro de 30 dias da exclusão da conta.", es: "Se conservan mientras su cuenta está activa. Se eliminan dentro de los 30 días posteriores a la eliminación de la cuenta." })}</li>
            <li><strong>{t({ en: "Calibration and progress data:", pt: "Dados de calibração e progresso:", es: "Datos de Calibración y progreso:" })}</strong> {t({ en: "Retained while your account is active.", pt: "Retidos enquanto sua conta estiver ativa.", es: "Se conservan mientras su cuenta está activa." })}</li>
            <li><strong>{t({ en: "AI coaching conversation logs:", pt: "Logs de conversa de coaching com IA:", es: "Registros de conversaciones de entrenamiento con IA:" })}</strong> {t({ en: "Not stored. Generated in real-time and discarded after delivery.", pt: "Não armazenados. Gerados em tempo real e descartados após a entrega.", es: "No se almacenan. Se generan en tiempo real y se descartan después de la entrega." })}</li>
            <li><strong>{t({ en: "Technical logs:", pt: "Logs técnicos:", es: "Registros técnicos:" })}</strong> {t({ en: "Retained for a maximum of 90 days.", pt: "Retidos por no máximo 90 dias.", es: "Se conservan por un máximo de 90 días." })}</li>
            <li><strong>{t({ en: "Backup data:", pt: "Dados de backup:", es: "Datos de respaldo:" })}</strong> {t({ en: "Purged within 60 days of account deletion.", pt: "Eliminados dentro de 60 dias da exclusão da conta.", es: "Se eliminan dentro de los 60 días posteriores a la eliminación de la cuenta." })}</li>
          </ul>

          <h2>9. {t({ en: "Your Rights", pt: "Seus Direitos", es: "Sus Derechos" })}</h2>
          <p>{t({ en: "Under the UK GDPR, you have the following rights regarding your personal data:", pt: "Sob o GDPR do Reino Unido, você tem os seguintes direitos em relação aos seus dados pessoais:", es: "Bajo el GDPR del Reino Unido, usted tiene los siguientes derechos con respecto a sus datos personales:" })}</p>
          <ul>
            <li><strong>{t({ en: "Right of Access:", pt: "Direito de Acesso:", es: "Derecho de Acceso:" })}</strong> {t({ en: "Request a copy of all personal data we hold about you.", pt: "Solicitar uma cópia de todos os dados pessoais que mantemos sobre você.", es: "Solicitar una copia de todos los datos personales que tenemos sobre usted." })}</li>
            <li><strong>{t({ en: "Right to Rectification:", pt: "Direito de Retificação:", es: "Derecho de Rectificación:" })}</strong> {t({ en: "Request correction of inaccurate personal data.", pt: "Solicitar correção de dados pessoais imprecisos.", es: "Solicitar la corrección de datos personales inexactos." })}</li>
            <li><strong>{t({ en: 'Right to Erasure ("Right to Be Forgotten"):', pt: 'Direito ao Apagamento ("Direito de Ser Esquecido"):', es: 'Derecho de Supresión ("Derecho al Olvido"):' })}</strong> {t({ en: "Request deletion of your personal data.", pt: "Solicitar exclusão dos seus dados pessoais.", es: "Solicitar la eliminación de sus datos personales." })}</li>
            <li><strong>{t({ en: "Right to Data Portability:", pt: "Direito à Portabilidade de Dados:", es: "Derecho a la Portabilidad de Datos:" })}</strong> {t({ en: "Request your data in a structured, machine-readable format.", pt: "Solicitar seus dados em um formato estruturado e legível por máquina.", es: "Solicitar sus datos en un formato estructurado y legible por máquina." })}</li>
            <li><strong>{t({ en: "Right to Restrict Processing:", pt: "Direito de Restringir o Processamento:", es: "Derecho a Restringir el Procesamiento:" })}</strong> {t({ en: "Request that we limit how we use your data.", pt: "Solicitar que limitemos como usamos seus dados.", es: "Solicitar que limitemos cómo usamos sus datos." })}</li>
            <li><strong>{t({ en: "Right to Object:", pt: "Direito de Objeção:", es: "Derecho de Objeción:" })}</strong> {t({ en: "Object to processing based on legitimate interests.", pt: "Objetar ao processamento baseado em interesses legítimos.", es: "Oponerse al procesamiento basado en intereses legítimos." })}</li>
            <li><strong>{t({ en: "Right to Withdraw Consent:", pt: "Direito de Retirar o Consentimento:", es: "Derecho a Retirar el Consentimiento:" })}</strong> {t({ en: "Withdraw consent at any time for consent-based processing.", pt: "Retirar o consentimento a qualquer momento para processamento baseado em consentimento.", es: "Retirar el consentimiento en cualquier momento para el procesamiento basado en el consentimiento." })}</li>
            <li><strong>{t({ en: "Right to Lodge a Complaint:", pt: "Direito de Apresentar uma Reclamação:", es: "Derecho a Presentar una Queja:" })}</strong> {t({ en: "Complain to the UK Information Commissioner's Office (ICO) at ico.org.uk.", pt: "Reclamar ao Escritório do Comissário de Informação do Reino Unido (ICO) em ico.org.uk.", es: "Presentar una queja ante la Oficina del Comisionado de Información del Reino Unido (ICO) en ico.org.uk." })}</li>
          </ul>
          <p>{t({ en: "To exercise any of these rights, contact us at privacy@destinyhacking.app. We will respond within 30 days.", pt: "Para exercer qualquer um desses direitos, entre em contato conosco em privacy@destinyhacking.app. Responderemos dentro de 30 dias.", es: "Para ejercer cualquiera de estos derechos, contáctenos en privacy@destinyhacking.app. Responderemos en un plazo de 30 días." })}</p>

          <h2>10. {t({ en: "Account Deletion", pt: "Exclusão de Conta", es: "Eliminación de la Cuenta" })}</h2>
          <p>{t({ en: "You can delete your account at any time directly within the app by navigating to Settings > Delete Account. This action is permanent and will:", pt: "Você pode excluir sua conta a qualquer momento diretamente no app navegando até Configurações > Excluir Conta. Esta ação é permanente e irá:", es: "Puede eliminar su cuenta en cualquier momento directamente dentro de la aplicación navegando a Configuración > Eliminar Cuenta. Esta acción es permanente y:" })}</p>
          <ul>
            <li>{t({ en: "Delete your account credentials", pt: "Excluir suas credenciais de conta", es: "Eliminará sus credenciales de cuenta" })}</li>
            <li>{t({ en: "Delete all your calibration data, progress, streaks, and achievements", pt: "Excluir todos os seus dados de calibração, progresso, sequências e conquistas", es: "Eliminará todos sus datos de Calibración, progreso, rachas y logros" })}</li>
            <li>{t({ en: "Delete all journal entries and reflection data", pt: "Excluir todas as entradas de diário e dados de reflexão", es: "Eliminará todas las entradas del diario y los datos de reflexión" })}</li>
            <li>{t({ en: "Remove your data from our active systems within 30 days", pt: "Remover seus dados dos nossos sistemas ativos dentro de 30 dias", es: "Eliminará sus datos de nuestros sistemas activos en un plazo de 30 días" })}</li>
            <li>{t({ en: "Remove your data from backup systems within 60 days", pt: "Remover seus dados dos sistemas de backup dentro de 60 dias", es: "Eliminará sus datos de los sistemas de respaldo en un plazo de 60 días" })}</li>
          </ul>

          <h2>11. {t({ en: "Data Security", pt: "Segurança de Dados", es: "Seguridad de los Datos" })}</h2>
          <p>{t({ en: "We implement appropriate technical and organisational measures to protect your personal data, including:", pt: "Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais, incluindo:", es: "Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales, que incluyen:" })}</p>
          <ul>
            <li>{t({ en: "Encryption in transit (TLS/HTTPS for all data transmission)", pt: "Criptografia em trânsito (TLS/HTTPS para toda transmissão de dados)", es: "Cifrado en tránsito (TLS/HTTPS para toda la transmisión de datos)" })}</li>
            <li>{t({ en: "Encryption at rest for stored personal data", pt: "Criptografia em repouso para dados pessoais armazenados", es: "Cifrado en reposo para los datos personales almacenados" })}</li>
            <li>{t({ en: "Secure password hashing (bcrypt or equivalent)", pt: "Hash seguro de senhas (bcrypt ou equivalente)", es: "Hash seguro de contraseñas (bcrypt o equivalente)" })}</li>
            <li>{t({ en: "Access controls limiting data access to authorised personnel only", pt: "Controles de acesso limitando o acesso a dados apenas a pessoal autorizado", es: "Controles de acceso que limitan el acceso a los datos solo al personal autorizado" })}</li>
            <li>{t({ en: "Regular security reviews and updates", pt: "Revisões e atualizações regulares de segurança", es: "Revisiones y actualizaciones de seguridad periódicas" })}</li>
          </ul>

          <h2>12. {t({ en: "Children's Privacy", pt: "Privacidade de Crianças", es: "Privacidad de los Niños" })}</h2>
          <p>{t({ en: "Destiny Hacking is not directed at children under the age of 16. We do not knowingly collect personal data from anyone under 16 years of age. If we discover that we have inadvertently collected data from a child under 16, we will delete it promptly.", pt: "Destiny Hacking não é direcionado a crianças menores de 16 anos. Não coletamos intencionalmente dados pessoais de menores de 16 anos. Se descobrirmos que coletamos inadvertidamente dados de uma criança menor de 16 anos, os excluiremos prontamente.", es: "Destiny Hacking no está dirigido a niños menores de 16 años. No recopilamos deliberadamente datos personales de ninguna persona menor de 16 años. Si descubrimos que hemos recopilado inadvertidamente datos de un niño menor de 16 años, los eliminaremos de inmediato." })}</p>

          <h2>13. {t({ en: "Cookies and Local Storage", pt: "Cookies e Armazenamento Local", es: "Cookies y Almacenamiento Local" })}</h2>
          <p>{t({ en: "The Destiny Hacking app uses local device storage (such as localStorage and IndexedDB) to store your preferences, session tokens, and offline data. This data remains on your device and is not transmitted to third parties. We do not use tracking cookies, advertising cookies, or third-party analytics cookies within the app.", pt: "O app Destiny Hacking usa armazenamento local do dispositivo (como localStorage e IndexedDB) para armazenar suas preferências, tokens de sessão e dados offline. Estes dados permanecem no seu dispositivo e não são transmitidos a terceiros. Não usamos cookies de rastreamento, cookies de publicidade ou cookies de análise de terceiros dentro do app.", es: "La aplicación Destiny Hacking utiliza el almacenamiento local del dispositivo (como localStorage e IndexedDB) para almacenar sus preferencias, tokens de sesión y datos sin conexión. Estos datos permanecen en su dispositivo y no se transmiten a terceros. No utilizamos cookies de seguimiento, cookies de publicidad ni cookies de análisis de terceros dentro de la aplicación." })}</p>

          <h2>14. {t({ en: "Push Notifications", pt: "Notificações Push", es: "Notificaciones Push" })}</h2>
          <p>{t({ en: "The app may request permission to send push notifications for daily calibration reminders. This is entirely optional. You can enable or disable notifications at any time through your device settings or within the app.", pt: "O app pode solicitar permissão para enviar notificações push para lembretes diários de calibração. Isso é totalmente opcional. Você pode ativar ou desativar notificações a qualquer momento através das configurações do seu dispositivo ou dentro do app.", es: "La aplicación puede solicitar permiso para enviar notificaciones push para recordatorios diarios de Calibración. Esto es totalmente opcional. Puede habilitar o deshabilitar las notificaciones en cualquier momento a través de la configuración de su dispositivo o dentro de la aplicación." })}</p>

          <h2>15. {t({ en: "Changes to This Privacy Policy", pt: "Alterações nesta Política de Privacidade", es: "Cambios a esta Política de Privacidad" })}</h2>
          <p>{t({ en: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes by displaying a notice within the app and updating the \"Last Updated\" date at the top of this policy.", pt: "Podemos atualizar esta Política de Privacidade de tempos em tempos para refletir mudanças em nossas práticas, tecnologia ou requisitos legais. Notificaremos você sobre alterações materiais exibindo um aviso dentro do app e atualizando a data de \"Última Atualização\" no topo desta política.", es: "Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas, tecnología o requisitos legales. Le notificaremos los cambios materiales mostrando un aviso dentro de la aplicación y actualizando la fecha de \"Última Actualización\" en la parte superior de esta política." })}</p>

          <h2>16. {t({ en: "Contact Us", pt: "Fale Conosco", es: "Contáctenos" })}</h2>
          <p>
            {t({ en: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:", pt: "Se você tiver alguma dúvida, preocupação ou solicitação sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco:", es: "Si tiene alguna pregunta, inquietud o solicitud con respecto a esta Política de Privacidad o nuestras prácticas de datos, por favor contáctenos:" })}
          </p>
          <p>
            <strong>Merx Digital Solutions Ltd</strong><br />
             Company number: 16920547<br />
             128 City Road, London, United Kingdom, EC1V 2NX<br />
             Email: privacy@destinyhacking.app
          </p>
          <p>
            {t({ en: "You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):", pt: "Você também tem o direito de apresentar uma reclamação ao Escritório do Comissário de Informação do Reino Unido (ICO):", es: "También tiene derecho a presentar una queja ante la Oficina del Comisionado de Información del Reino Unido (ICO):" })}
          </p>
          <p>
            Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">https://ico.org.uk</a><br />
            {t({ en: "Telephone:", pt: "Telefone:", es: "Teléfono:" })} 0303 123 1113
          </p>
        </div>
      </div>
    </div>
  );
}

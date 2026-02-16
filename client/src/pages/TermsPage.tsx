import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
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
          {t({ en: "Terms & Conditions", pt: "Termos e Condições", es: "Términos y Condiciones" })}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {t({ en: "Last Updated: February 2026", pt: "Última Atualização: Fevereiro 2026", es: "Última Actualización: Febrero 2026" })}
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">

          <h2>1. {t({ en: "Agreement to Terms", pt: "Aceitação dos Termos", es: "Aceptación de los Términos" })}</h2>
          <p>
            {t({
              en: 'These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", "your") and Merx Digital Solutions Ltd, a company registered in England and Wales ("Company", "we", "us", "our"), regarding your access to and use of the Destiny Hacking mobile application ("the App") and any related services.',
              pt: 'Estes Termos e Condições ("Termos") constituem um acordo juridicamente vinculativo entre você ("Usuário", "você", "seu") e a Merx Digital Solutions Ltd, uma empresa registrada na Inglaterra e País de Gales ("Empresa", "nós", "nosso"), em relação ao seu acesso e uso do aplicativo móvel Destiny Hacking ("o App") e quaisquer serviços relacionados.',
              es: 'Estos Términos y Condiciones ("Términos") constituyen un acuerdo legalmente vinculante entre usted ("Usuario", "usted", "su") y Merx Digital Solutions Ltd, una empresa registrada en Inglaterra y Gales ("Compañía", "nosotros", "nuestro"), con respecto a su acceso y uso de la aplicación móvil Destiny Hacking ("la App") y cualquier servicio relacionado.'
            })}
          </p>
          <p>
            {t({
              en: "By creating an account, downloading, installing, or using the App, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the App.",
              pt: "Ao criar uma conta, baixar, instalar ou usar o App, você reconhece que leu, entendeu e concorda em estar vinculado a estes Termos e à nossa Política de Privacidade. Se você não concordar com estes Termos, não deve usar o App.",
              es: "Al crear una cuenta, descargar, instalar o usar la App, usted reconoce que ha leído, entendido y acepta estar sujeto a estos Términos y nuestra Política de Privacidad. Si no está de acuerdo con estos Términos, no debe usar la App."
            })}
          </p>

          <h2>2. {t({ en: "Eligibility", pt: "Elegibilidade", es: "Elegibilidad" })}</h2>
          <p>
            {t({
              en: "You must be at least 16 years of age to create an account and use the App. By using the App, you represent and warrant that you meet this age requirement. If you are under 18, you confirm that you have obtained consent from a parent or legal guardian.",
              pt: "Você deve ter pelo menos 16 anos de idade para criar uma conta e usar o App. Ao usar o App, você declara e garante que atende a este requisito de idade. Se você tiver menos de 18 anos, confirma que obteve o consentimento de um pai ou responsável legal.",
              es: "Debe tener al menos 16 años de edad para crear una cuenta y usar la App. Al usar la App, usted declara y garantiza que cumple con este requisito de edad. Si es menor de 18 años, confirma que ha obtenido el consentimiento de un padre o tutor legal."
            })}
          </p>

          <h2>3. {t({ en: "Account Registration and Security", pt: "Registro de Conta e Segurança", es: "Registro de Cuenta y Seguridad" })}</h2>
          <p>
            {t({
              en: "To access the full features of the App, you must create an account by providing a valid email address and a secure password. You are responsible for:",
              pt: "Para acessar todos os recursos do App, você deve criar uma conta fornecendo um endereço de e-mail válido e uma senha segura. Você é responsável por:",
              es: "Para acceder a todas las funciones de la App, debe crear una cuenta proporcionando una dirección de correo electrónico válida y una contraseña segura. Usted es responsable de:"
            })}
          </p>
          <ul>
            <li>{t({ en: "Maintaining the confidentiality of your login credentials", pt: "Manter a confidencialidade de suas credenciais de login", es: "Mantener la confidencialidad de sus credenciales de inicio de sesión" })}</li>
            <li>{t({ en: "All activities that occur under your account", pt: "Todas as atividades que ocorrem em sua conta", es: "Todas las actividades que ocurran en su cuenta" })}</li>
            <li>{t({ en: "Notifying us immediately of any unauthorised use of your account", pt: "Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta", es: "Notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta" })}</li>
          </ul>
          <p>
            {t({
              en: "We reserve the right to suspend or terminate accounts that we reasonably believe have been compromised or are being used in violation of these Terms.",
              pt: "Reservamo-nos o direito de suspender ou encerrar contas que acreditamos razoavelmente terem sido comprometidas ou estarem sendo usadas em violação destes Termos.",
              es: "Nos reservamos el derecho de suspender o cancelar las cuentas que creamos razonablemente que han sido comprometidas o que se están utilizando en violación de estos Términos."
            })}
          </p>

          <h2>4. {t({ en: "Description of Service", pt: "Descrição do Serviço", es: "Descripción del Servicio" })}</h2>
          <p>
            {t({
              en: "Destiny Hacking is a personal development application designed to help users develop self-awareness and exercise free will through daily calibration practices. The App provides:",
              pt: "Destiny Hacking é um aplicativo de desenvolvimento pessoal projetado para ajudar os usuários a desenvolver autoconsciência e exercer o livre arbítrio através de práticas diárias de calibração. O App oferece:",
              es: "Destiny Hacking es una aplicación de desarrollo personal diseñada para ayudar a los usuarios a desarrollar la autoconciencia y ejercer el libre albedrío a través de prácticas diarias de calibración. La App proporciona:"
            })}
          </p>
          <ul>
            <li>{t({ en: "A 15-axis self-assessment calibration system", pt: "Um sistema de calibração de autoavaliação de 15 eixos", es: "Un sistema de calibración de autoevaluación de 15 ejes" })}</li>
            <li>{t({ en: "Daily cycle practice (morning, midday, evening calibrations)", pt: "Prática de ciclo diário (calibrações matutinas, vespertinas e noturnas)", es: "Práctica de ciclo diario (calibraciones matutinas, de mediodía y vespertinas)" })}</li>
            <li>{t({ en: 'AI-powered coaching insights (the "Stoic Strategist")', pt: 'Insights de coaching com IA (o "Estrategista Estoico")', es: 'Perspectivas de coaching impulsadas por IA (el "Estratega Estoico")' })}</li>
            <li>{t({ en: "Interactive learning modules based on the Destiny Hacking book", pt: "Módulos de aprendizagem interativos baseados no livro Destiny Hacking", es: "Módulos de aprendizaje interactivos basados en el libro Destiny Hacking" })}</li>
            <li>{t({ en: "Audiobook content", pt: "Conteúdo de audiolivro", es: "Contenido de audiolibro" })}</li>
            <li>{t({ en: "Progress tracking, streaks, and achievements", pt: "Acompanhamento de progresso, sequências e conquistas", es: "Seguimiento del progreso, rachas y logros" })}</li>
            <li>{t({ en: "A philosophical framework (the Prologue/Philosophy section)", pt: "Uma estrutura filosófica (a seção Prólogo/Filosofia)", es: "Un marco filosófico (la sección Prólogo/Filosofía)" })}</li>
          </ul>
          <p>
            <strong>{t({ en: "Important Disclaimer:", pt: "Aviso Importante:", es: "Aviso Importante:" })}</strong>{" "}
            {t({
              en: "The App is a self-improvement tool and is NOT a substitute for professional medical, psychological, psychiatric, or therapeutic advice, diagnosis, or treatment. If you are experiencing mental health difficulties, please consult a qualified healthcare professional.",
              pt: "O App é uma ferramenta de autoaperfeiçoamento e NÃO substitui aconselhamento médico, psicológico, psiquiátrico ou terapêutico profissional, diagnóstico ou tratamento. Se você estiver enfrentando dificuldades de saúde mental, consulte um profissional de saúde qualificado.",
              es: "La App es una herramienta de superación personal y NO sustituye el consejo, diagnóstico o tratamiento médico, psicológico, psiquiátrico o terapéutico profesional. Si tiene dificultades de salud mental, consulte a un profesional de la salud calificado."
            })}
          </p>

          <h2>5. {t({ en: "AI Features Disclosure", pt: "Divulgação de Recursos de IA", es: "Divulgación de Funciones de IA" })}</h2>
          <p>{t({ en: "The App includes an AI coaching feature that generates personalised insights based on your axis calibration data. By using this feature:", pt: "O App inclui um recurso de coaching com IA que gera insights personalizados com base nos seus dados de calibração de eixos. Ao usar este recurso:", es: "La App incluye una función de coaching con IA que genera perspectivas personalizadas basadas en los datos de calibración de sus ejes. Al usar esta función:" })}</p>
          <ul>
            <li>{t({ en: "You understand that AI-generated content is for informational and motivational purposes only and does not constitute professional advice.", pt: "Você entende que o conteúdo gerado por IA é apenas para fins informativos e motivacionais e não constitui aconselhamento profissional.", es: "Usted comprende que el contenido generado por IA es solo para fines informativos y motivacionales y no constituye un consejo profesional." })}</li>
            <li>{t({ en: "You consent to your anonymised axis data being processed by third-party AI providers (such as OpenAI or Anthropic) solely to generate your coaching responses.", pt: "Você consente que seus dados de eixo anonimizados sejam processados por provedores de IA terceiros (como OpenAI ou Anthropic) exclusivamente para gerar suas respostas de coaching.", es: "Usted acepta que sus datos de ejes anónimos sean procesados por proveedores de IA de terceros (como OpenAI o Anthropic) únicamente para generar sus respuestas de coaching." })}</li>
            <li>{t({ en: "You acknowledge that AI responses may occasionally be inaccurate, incomplete, or inappropriate. We do not guarantee the accuracy of AI-generated content.", pt: "Você reconhece que as respostas de IA podem ocasionalmente ser imprecisas, incompletas ou inadequadas. Não garantimos a precisão do conteúdo gerado por IA.", es: "Usted reconoce que las respuestas de la IA pueden ser ocasionalmente inexactas, incompletas o inapropiadas. No garantizamos la exactitud del contenido generado por IA." })}</li>
            <li>{t({ en: "You may opt out of AI features at any time without losing access to the core App functionality.", pt: "Você pode optar por não usar os recursos de IA a qualquer momento sem perder o acesso à funcionalidade principal do App.", es: "Puede optar por no participar en las funciones de IA en cualquier momento sin perder el acceso a la funcionalidad principal de la App." })}</li>
          </ul>

          <h2>6. {t({ en: "Subscriptions and Payments", pt: "Assinaturas e Pagamentos", es: "Suscripciones y Pagos" })}</h2>
          <p>{t({ en: "The App may offer free and premium subscription tiers. If you purchase a subscription:", pt: "O App pode oferecer níveis de assinatura gratuitos e premium. Se você adquirir uma assinatura:", es: "La App puede ofrecer niveles de suscripción gratuitos y premium. Si compra una suscripción:" })}</p>
          <ul>
            <li>{t({ en: "Payments are processed exclusively through Apple's App Store or Google Play Store billing systems. We do not collect or store your payment card details.", pt: "Os pagamentos são processados exclusivamente através dos sistemas de cobrança da App Store da Apple ou Google Play Store. Não coletamos nem armazenamos os dados do seu cartão de pagamento.", es: "Los pagos se procesan exclusivamente a través de los sistemas de facturación de la App Store de Apple o Google Play Store. No recopilamos ni almacenamos los datos de su tarjeta de pago." })}</li>
            <li>{t({ en: "Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period.", pt: "As assinaturas são renovadas automaticamente, a menos que sejam canceladas pelo menos 24 horas antes do final do período de cobrança atual.", es: "Las suscripciones se renuevan automáticamente a menos que se cancelen al menos 24 horas antes del final del período de facturación actual." })}</li>
            <li>{t({ en: "You can manage and cancel your subscription through your Apple App Store or Google Play Store account settings.", pt: "Você pode gerenciar e cancelar sua assinatura através das configurações da sua conta na App Store da Apple ou Google Play Store.", es: "Puede administrar y cancelar su suscripción a través de la configuración de su cuenta de la App Store de Apple o Google Play Store." })}</li>
            <li>{t({ en: "Refunds are handled in accordance with the policies of the respective app store through which you made your purchase.", pt: "Reembolsos são tratados de acordo com as políticas da respectiva loja de aplicativos através da qual você fez sua compra.", es: "Los reembolsos se manejan de acuerdo con las políticas de la tienda de aplicaciones respectiva a través de la cual realizó su compra." })}</li>
            <li>{t({ en: "Prices may change with reasonable notice. Existing subscribers will be notified before any price increase takes effect on their next renewal.", pt: "Os preços podem mudar com aviso razoável. Os assinantes existentes serão notificados antes que qualquer aumento de preço entre em vigor na próxima renovação.", es: "Los precios pueden cambiar con un aviso razonable. Se notificará a los suscriptores existentes antes de que cualquier aumento de precio entre en vigor en su próxima renovación." })}</li>
          </ul>

          <h2>7. {t({ en: "Cancellation and Account Deletion", pt: "Cancelamento e Exclusão de Conta", es: "Cancelación y Eliminación de Cuenta" })}</h2>
          <h3>7.1 {t({ en: "Cancelling Your Subscription", pt: "Cancelando Sua Assinatura", es: "Cancelación de su Suscripción" })}</h3>
          <p>{t({ en: "You can cancel your subscription at any time through your Apple App Store or Google Play Store account settings. Cancellation will take effect at the end of your current billing period. You will retain access to premium features until that date.", pt: "Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta na App Store da Apple ou Google Play Store. O cancelamento entrará em vigor no final do seu período de cobrança atual. Você manterá o acesso aos recursos premium até essa data.", es: "Puede cancelar su suscripción en cualquier momento a través de la configuración de su cuenta de la App Store de Apple o Google Play Store. La cancelación entrará en vigor al final de su período de facturación actual. Conservará el acceso a las funciones premium hasta esa fecha." })}</p>
          <h3>7.2 {t({ en: "Deleting Your Account", pt: "Excluindo Sua Conta", es: "Eliminación de su Cuenta" })}</h3>
          <p>{t({ en: "You can permanently delete your account at any time by navigating to Settings > Delete Account within the App. Account deletion will:", pt: "Você pode excluir permanentemente sua conta a qualquer momento navegando até Configurações > Excluir Conta dentro do App. A exclusão da conta irá:", es: "Puede eliminar permanentemente su cuenta en cualquier momento navegando a Configuración > Eliminar Cuenta dentro de la App. La eliminación de la cuenta:" })}</p>
          <ul>
            <li>{t({ en: "Permanently remove all your personal data, calibration history, progress, and achievements", pt: "Remover permanentemente todos os seus dados pessoais, histórico de calibração, progresso e conquistas", es: "Eliminará permanentemente todos sus datos personales, historial de calibración, progreso y logros" })}</li>
            <li>{t({ en: "Cancel any active subscription (you may also need to cancel via your app store to stop future billing)", pt: "Cancelar qualquer assinatura ativa (você também pode precisar cancelar pela loja de aplicativos para interromper cobranças futuras)", es: "Cancelará cualquier suscripción activa (también es posible que deba cancelar a través de su tienda de aplicaciones para detener la facturación futura)" })}</li>
            <li>{t({ en: "Be completed within 30 days from active systems and 60 days from backup systems", pt: "Ser concluída dentro de 30 dias dos sistemas ativos e 60 dias dos sistemas de backup", es: "Se completará en 30 días desde los sistemas activos y 60 días desde los sistemas de respaldo" })}</li>
          </ul>
          <p>{t({ en: "Account deletion is irreversible. We strongly recommend exporting your data before deleting your account.", pt: "A exclusão da conta é irreversível. Recomendamos fortemente exportar seus dados antes de excluir sua conta.", es: "La eliminación de la cuenta es irreversible. Recomendamos encarecidamente exportar sus datos antes de eliminar su cuenta." })}</p>

          <h2>8. {t({ en: "User Conduct", pt: "Conduta do Usuário", es: "Conducta del Usuario" })}</h2>
          <p>{t({ en: "You agree not to:", pt: "Você concorda em não:", es: "Usted se compromete a no:" })}</p>
          <ul>
            <li>{t({ en: "Use the App for any illegal or unauthorised purpose", pt: "Usar o App para qualquer finalidade ilegal ou não autorizada", es: "Usar la App para ningún propósito ilegal o no autorizado" })}</li>
            <li>{t({ en: "Attempt to reverse-engineer, decompile, or disassemble the App", pt: "Tentar engenharia reversa, descompilar ou desmontar o App", es: "Intentar aplicar ingeniería inversa, descompilar o desensamblar la App" })}</li>
            <li>{t({ en: "Attempt to gain unauthorised access to our systems, servers, or other users' accounts", pt: "Tentar obter acesso não autorizado aos nossos sistemas, servidores ou contas de outros usuários", es: "Intentar obtener acceso no autorizado a nuestros sistemas, servidores o cuentas de otros usuarios" })}</li>
            <li>{t({ en: "Use automated systems (bots, scrapers) to access the App", pt: "Usar sistemas automatizados (bots, scrapers) para acessar o App", es: "Usar sistemas automatizados (bots, scrapers) para acceder a la App" })}</li>
            <li>{t({ en: "Transmit viruses, malware, or any harmful code", pt: "Transmitir vírus, malware ou qualquer código prejudicial", es: "Transmitir virus, malware o cualquier código dañino" })}</li>
            <li>{t({ en: "Interfere with or disrupt the integrity or performance of the App", pt: "Interferir ou interromper a integridade ou desempenho do App", es: "Interferir o interrumpir la integridad o el rendimiento de la App" })}</li>
            <li>{t({ en: "Impersonate any person or entity", pt: "Se passar por qualquer pessoa ou entidade", es: "Hacerse pasar por cualquier persona o entidad" })}</li>
            <li>{t({ en: "Share your account credentials with others", pt: "Compartilhar suas credenciais de conta com outros", es: "Compartir sus credenciales de cuenta con otros" })}</li>
          </ul>

          <h2>10. {t({ en: "User Content", pt: "Conteúdo do Usuário", es: "Contenido del Usuario" })}</h2>
          <p>{t({ en: "Any content you create within the App (such as journal entries, intended actions, and reflections) remains your intellectual property. However, by using the App, you grant us a limited licence to store and process this content solely for the purpose of providing the service to you.", pt: "Qualquer conteúdo que você criar dentro do App (como entradas de diário, ações pretendidas e reflexões) permanece como sua propriedade intelectual. No entanto, ao usar o App, você nos concede uma licença limitada para armazenar e processar este conteúdo exclusivamente para fins de prestação do serviço a você.", es: "Cualquier contenido que cree dentro de la App (como entradas de diario, acciones previstas y reflexiones) sigue siendo de su propiedad intelectual. Sin embargo, al usar la App, nos otorga una licencia limitada para almacenar y procesar este contenido con el único propósito de prestarle el servicio." })}</p>

          <h2>11. {t({ en: "Disclaimers", pt: "Isenções de Responsabilidade", es: "Exenciones de Responsabilidad" })}</h2>
          <p>{t({ en: 'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.', pt: 'O APP É FORNECIDO "COMO ESTÁ" E "CONFORME DISPONÍVEL" SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM PROPÓSITO ESPECÍFICO E NÃO VIOLAÇÃO.', es: 'LA APP SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, YA SEAN EXPRESAS O IMPLÍCITAS, INCLUIDAS, ENTRE OTRAS, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN.' })}</p>

          <h2>12. {t({ en: "Limitation of Liability", pt: "Limitação de Responsabilidade", es: "Limitación de Responsabilidad" })}</h2>
          <p>{t({ en: "To the maximum extent permitted by applicable law, Merx Digital Solutions Ltd and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the App.", pt: "Na máxima extensão permitida pela lei aplicável, a Merx Digital Solutions Ltd e seus diretores, funcionários e agentes não serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes de ou relacionados ao seu uso do App.", es: "En la medida máxima permitida por la ley aplicable, Merx Digital Solutions Ltd y sus directores, empleados y agentes no serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo que surja de o esté relacionado con su uso de la App." })}</p>

          <h2>13. {t({ en: "Indemnification", pt: "Indenização", es: "Indemnización" })}</h2>
          <p>{t({ en: "You agree to indemnify, defend, and hold harmless Merx Digital Solutions Ltd and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses arising from your use of the App, violation of these Terms, or infringement of any third-party rights.", pt: "Você concorda em indenizar, defender e isentar a Merx Digital Solutions Ltd e suas afiliadas, diretores, funcionários e agentes de quaisquer reivindicações, danos, perdas, responsabilidades, custos e despesas decorrentes do seu uso do App, violação destes Termos ou violação de quaisquer direitos de terceiros.", es: "Usted acepta indemnizar, defender y eximir de responsabilidad a Merx Digital Solutions Ltd y sus afiliados, funcionarios, directores, empleados y agentes de cualquier reclamo, daño, pérdida, responsabilidad, costo y gasto que surja de su uso de la App, violación de estos Términos o infracción de los derechos de terceros." })}</p>

          <h2>14. {t({ en: "Third-Party Services and Links", pt: "Serviços e Links de Terceiros", es: "Servicios y Enlaces de Terceros" })}</h2>
          <p>{t({ en: "The App may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy practices, or availability of third-party services.", pt: "O App pode conter links para sites ou serviços de terceiros que não são de nossa propriedade ou controlados por nós. Não somos responsáveis pelo conteúdo, práticas de privacidade ou disponibilidade de serviços de terceiros.", es: "La App puede contener enlaces a sitios web o servicios de terceros que no son de nuestra propiedad ni están controlados por nosotros. No somos responsables del contenido, las prácticas de privacidad o la disponibilidad de los servicios de terceros." })}</p>

          <h2>15. {t({ en: "Modifications to Terms", pt: "Modificações nos Termos", es: "Modificaciones a los Términos" })}</h2>
          <p>{t({ en: 'We reserve the right to modify these Terms at any time. We will provide notice of material changes by displaying a notice within the App and updating the "Last Updated" date at the top of these Terms. Your continued use of the App after changes are posted constitutes acceptance of the modified Terms.', pt: 'Reservamo-nos o direito de modificar estes Termos a qualquer momento. Forneceremos aviso de alterações materiais exibindo um aviso dentro do App e atualizando a data de "Última Atualização" no topo destes Termos. Seu uso continuado do App após a publicação das alterações constitui aceitação dos Termos modificados.', es: 'Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos los cambios sustanciales mostrando un aviso dentro de la App y actualizando la fecha de "Última Actualización" en la parte superior de estos Términos. Su uso continuado de la App después de que se publiquen los cambios constituye la aceptación de los Términos modificados.' })}</p>

          <h2>16. {t({ en: "Termination", pt: "Rescisão", es: "Rescisión" })}</h2>
          <p>{t({ en: "We may terminate or suspend your access to the App immediately, without prior notice, if you breach any provision of these Terms, we are required to do so by law, or we decide to discontinue the App or any part of it.", pt: "Podemos rescindir ou suspender seu acesso ao App imediatamente, sem aviso prévio, se você violar qualquer disposição destes Termos, se formos obrigados a fazê-lo por lei, ou se decidirmos descontinuar o App ou qualquer parte dele.", es: "Podemos rescindir o suspender su acceso a la App de inmediato, sin previo aviso, si incumple alguna disposición de estos Términos, si la ley nos obliga a hacerlo o si decidimos descontinuar la App o cualquier parte de ella." })}</p>

          <h2>17. {t({ en: "Governing Law and Dispute Resolution", pt: "Lei Aplicável e Resolução de Disputas", es: "Ley Aplicable y Resolución de Disputas" })}</h2>
          <p>{t({ en: "These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.", pt: "Estes Termos são regidos e interpretados de acordo com as leis da Inglaterra e País de Gales. Quaisquer disputas decorrentes de ou em conexão com estes Termos estarão sujeitas à jurisdição exclusiva dos tribunais da Inglaterra e País de Gales.", es: "Estos Términos se rigen e interpretan de acuerdo con las leyes de Inglaterra y Gales. Cualquier disputa que surja de o en conexión con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales de Inglaterra y Gales." })}</p>

          <h2>18. {t({ en: "Severability", pt: "Divisibilidade", es: "Divisibilidad" })}</h2>
          <p>{t({ en: "If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.", pt: "Se qualquer disposição destes Termos for considerada inexequível ou inválida, essa disposição será limitada ou eliminada na extensão mínima necessária, e as disposições restantes permanecerão em pleno vigor e efeito.", es: "Si alguna disposición de estos Términos se considera inaplicable o inválida, esa disposición se limitará o eliminará en la medida mínima necesaria, y las disposiciones restantes permanecerán en pleno vigor y efecto." })}</p>

          <h2>19. {t({ en: "Entire Agreement", pt: "Acordo Integral", es: "Acuerdo Completo" })}</h2>
          <p>{t({ en: "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Merx Digital Solutions Ltd regarding your use of the App and supersede any prior agreements or communications.", pt: "Estes Termos, juntamente com nossa Política de Privacidade, constituem o acordo integral entre você e a Merx Digital Solutions Ltd em relação ao seu uso do App e substituem quaisquer acordos ou comunicações anteriores.", es: "Estos Términos, junto con nuestra Política de Privacidad, constituyen el acuerdo completo entre usted y Merx Digital Solutions Ltd con respecto a su uso de la App y reemplazan cualquier acuerdo o comunicación anterior." })}</p>

          <h2>20. {t({ en: "Contact Information", pt: "Informações de Contato", es: "Información de Contacto" })}</h2>
          <p>
            {t({ en: "If you have any questions about these Terms, please contact us:", pt: "Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco:", es: "Si tiene alguna pregunta sobre estos Términos, contáctenos:" })}
          </p>
          <p>
            <strong>Merx Digital Solutions Ltd</strong><br />
             Company number: 16920547<br />
             128 City Road, London, United Kingdom, EC1V 2NX<br />
             Email: support@destinyhacking.app
          </p>
        </div>
      </div>
    </div>
  );
}

// mockAssistant.js
// Local mock assistant logic - NO external APIs (no fetch/axios/Gemini/OpenAI)
// Supports: English, Hindi, Japanese, Korean, Spanish

// ---------------------------------------------------------------------------
// HR RULES
// ---------------------------------------------------------------------------
const HR_RULES = [
  {
    keywords: [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening',
      'नमस्ते', 'नमस्कार',
      'こんにちは', 'おはよう', 'こんばんは',
      '안녕하세요', '안녕',
      'hola', 'buenos días', 'buenas tardes', 'buenas noches',
    ],
    reply: {
      English: "Hello! I'm your HR Assistant. How can I help you today?",
      Hindi: 'नमस्ते! मैं आपका एचआर सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
      Japanese: 'こんにちは！私はHRアシスタントです。本日はどのようなご用件でしょうか？',
      Korean: '안녕하세요! 저는 HR 어시스턴트입니다. 오늘 무엇을 도와드릴까요?',
      Spanish: '¡Hola! Soy tu Asistente de RR. HH. ¿En qué puedo ayudarte hoy?',
    },
  },
  {
    keywords: [
      'leave', 'vacation', 'holiday', 'time off', 'sick leave', 'pto',
      'छुट्टी', 'अवकाश',
      '休暇', '有給', '休み',
      '휴가', '연차',
      'vacaciones', 'permiso', 'licencia',
    ],
    reply: {
      English:
        "You can apply for leave through the HR portal under 'Leave Management'. Your manager will need to approve it before it's confirmed.",
      Hindi:
        "आप एचआर पोर्टल में 'लीव मैनेजमेंट' सेक्शन से छुट्टी के लिए आवेदन कर सकते हैं। पुष्टि से पहले आपके मैनेजर को इसे मंजूर करना होगा।",
      Japanese:
        'HRポータルの「休暇管理」から休暇を申請できます。確定される前に上司の承認が必要です。',
      Korean:
        "HR 포털의 '휴가 관리'에서 휴가를 신청할 수 있습니다. 확정되기 전에 관리자의 승인이 필요합니다.",
      Spanish:
        "Puedes solicitar tus vacaciones a través del portal de RR. HH. en la sección 'Gestión de Ausencias'. Tu gerente deberá aprobarla antes de que se confirme.",
    },
  },
  {
    keywords: [
      'payroll', 'salary', 'pay slip', 'payslip', 'wages', 'pay date', 'compensation',
      'वेतन', 'सैलरी', 'पेस्लिप',
      '給与', '給料', '給与明細',
      '급여', '월급', '급여명세서',
      'nómina', 'nomina', 'salario', 'sueldo', 'recibo de nómina',
    ],
    reply: {
      English:
        'Salaries are credited on the last working day of every month. You can download your payslip from the Payroll section of the HR portal.',
      Hindi:
        'वेतन हर महीने के अंतिम कार्य दिवस पर जमा किया जाता है। आप एचआर पोर्टल के पेरोल सेक्शन से अपनी पेस्लिप डाउनलोड कर सकते हैं।',
      Japanese:
        '給与は毎月の最終営業日に振り込まれます。給与明細はHRポータルの「給与」セクションからダウンロードできます。',
      Korean:
        "급여는 매월 마지막 근무일에 지급됩니다. 급여명세서는 HR 포털의 '급여' 섹션에서 다운로드할 수 있습니다.",
      Spanish:
        'Los salarios se abonan el último día hábil de cada mes. Puedes descargar tu recibo de nómina desde la sección de Nómina del portal de RR. HH.',
    },
  },
  {
    keywords: [
      'recruitment', 'hiring', 'job opening', 'vacancy', 'referral', 'interview',
      'भर्ती', 'नौकरी', 'रिक्ति',
      '採用', '求人', '面接',
      '채용', '구인', '면접',
      'contratación', 'contratacion', 'empleo', 'vacante', 'entrevista',
    ],
    reply: {
      English:
        "All open positions are listed under the 'Careers' tab. You can also refer candidates through the Employee Referral Program for a bonus.",
      Hindi:
        "सभी खुली पदों को 'करियर' टैब में सूचीबद्ध किया गया है। आप एम्प्लॉई रेफरल प्रोग्राम के माध्यम से बोनस के लिए उम्मीदवारों को रेफर भी कर सकते हैं।",
      Japanese:
        'すべての募集職種は「採用情報」タブに掲載されています。従業員紹介プログラムを通じて候補者を紹介するとボーナスが得られます。',
      Korean:
        "모든 채용 공고는 '채용' 탭에 게시되어 있습니다. 직원 추천 프로그램을 통해 후보자를 추천하면 보너스를 받을 수 있습니다.",
      Spanish:
        "Todas las vacantes disponibles están en la pestaña 'Empleo'. También puedes recomendar candidatos a través del Programa de Referidos para recibir una bonificación.",
    },
  },
  {
    keywords: [
      'benefits', 'insurance', 'health insurance', 'perks', 'medical cover', 'pf', 'provident fund',
      'लाभ', 'बीमा',
      '福利厚生', '保険', '健康保険',
      '복리후생', '보험', '건강보험',
      'beneficios', 'seguro', 'seguro médico', 'seguro medico',
    ],
    reply: {
      English:
        'Our benefits package includes health insurance, provident fund contributions, and wellness perks. Full details are available in the Benefits section of the portal.',
      Hindi:
        'हमारे लाभ पैकेज में स्वास्थ्य बीमा, भविष्य निधि योगदान और वेलनेस लाभ शामिल हैं। पूरी जानकारी पोर्टल के बेनिफिट्स सेक्शन में उपलब्ध है।',
      Japanese:
        '福利厚生には健康保険、積立基金への拠出、ウェルネス特典が含まれます。詳細はポータルの「福利厚生」セクションでご確認いただけます。',
      Korean:
        "복리후생 패키지에는 건강 보험, 퇴직연금 기여금, 웰니스 혜택이 포함됩니다. 자세한 내용은 포털의 '복리후생' 섹션에서 확인할 수 있습니다.",
      Spanish:
        'Nuestro paquete de beneficios incluye seguro médico, aportes al fondo de previsión y beneficios de bienestar. Los detalles completos están disponibles en la sección de Beneficios del portal.',
    },
  },
  {
    keywords: [
      'attendance', 'check in', 'check-in', 'check out', 'biometric', 'clock in', 'timesheet',
      'उपस्थिति', 'हाजिरी',
      '勤怠', '出勤', '出退勤',
      '출근', '근태', '출퇴근',
      'asistencia', 'registro de entrada',
    ],
    reply: {
      English:
        "You can mark your attendance using the biometric device at office entry or through the mobile app's check-in feature. Timesheets are reviewed weekly.",
      Hindi:
        'आप ऑफिस के प्रवेश द्वार पर बायोमेट्रिक डिवाइस या मोबाइल ऐप की चेक-इन सुविधा से अपनी उपस्थिति दर्ज कर सकते हैं। टाइमशीट साप्ताहिक रूप से समीक्षा की जाती है।',
      Japanese:
        'オフィス入口の生体認証端末、またはモバイルアプリのチェックイン機能で出勤を記録できます。タイムシートは毎週確認されます。',
      Korean:
        '사무실 입구의 생체 인식 장치나 모바일 앱의 체크인 기능을 사용하여 출근을 기록할 수 있습니다. 근무표는 매주 검토됩니다.',
      Spanish:
        'Puedes marcar tu asistencia con el dispositivo biométrico en la entrada de la oficina o mediante la función de registro de la app móvil. Las hojas de horas se revisan semanalmente.',
    },
  },
  {
    keywords: [
      'policy', 'policies', 'hr policy', 'code of conduct', 'rules', 'handbook',
      'नीति', 'नीतियां',
      'ポリシー', '規定', '就業規則',
      '정책', '규정',
      'política', 'politica', 'políticas', 'politicas', 'normas',
    ],
    reply: {
      English:
        "All HR policies, including the code of conduct and employee handbook, are available under 'Policies' in the HR portal.",
      Hindi:
        "आचार संहिता और कर्मचारी पुस्तिका सहित सभी एचआर नीतियां एचआर पोर्टल में 'पॉलिसीज़' के अंतर्गत उपलब्ध हैं।",
      Japanese:
        '行動規範や従業員ハンドブックを含むすべてのHRポリシーは、HRポータルの「ポリシー」からご覧いただけます。',
      Korean:
        "행동 강령 및 직원 핸드북을 포함한 모든 HR 정책은 HR 포털의 '정책' 항목에서 확인할 수 있습니다.",
      Spanish:
        "Todas las políticas de RR. HH., incluidos el código de conducta y el manual del empleado, están disponibles en la sección 'Políticas' del portal.",
    },
  },
  {
    keywords: [
      'login', 'log in', 'sign in', 'unable to login', 'cant login', "can't login", 'access account',
      'लॉगिन', 'साइन इन',
      'ログイン', 'サインイン',
      '로그인',
      'iniciar sesión', 'iniciar sesion', 'acceso',
    ],
    reply: {
      English:
        "If you're unable to log in to the HR portal, please check your username and try resetting your password. Contact IT support if the issue persists.",
      Hindi:
        'अगर आप एचआर पोर्टल में लॉगिन नहीं कर पा रहे हैं, तो कृपया अपना यूज़रनेम जांचें और पासवर्ड रीसेट करने का प्रयास करें। समस्या बनी रहने पर आईटी सपोर्ट से संपर्क करें।',
      Japanese:
        'HRポータルにログインできない場合は、ユーザー名をご確認の上、パスワードのリセットをお試しください。問題が解決しない場合はITサポートにご連絡ください。',
      Korean:
        'HR 포털에 로그인할 수 없는 경우 사용자 이름을 확인하고 비밀번호 재설정을 시도해 주세요. 문제가 지속되면 IT 지원팀에 문의하세요.',
      Spanish:
        'Si no puedes iniciar sesión en el portal de RR. HH., verifica tu nombre de usuario e intenta restablecer tu contraseña. Si el problema persiste, contacta al soporte de TI.',
    },
  },
  {
    keywords: [
      'password reset', 'reset password', 'forgot password', 'change password',
      'पासवर्ड रीसेट', 'पासवर्ड भूल गए',
      'パスワード リセット', 'パスワードを忘れた',
      '비밀번호 재설정', '비밀번호를 잊어버렸어요',
      'restablecer contraseña', 'restablecer contrasena', 'olvidé mi contraseña', 'olvide mi contrasena',
    ],
    reply: {
      English:
        "To reset your password, click 'Forgot Password' on the login page and follow the instructions sent to your registered email.",
      Hindi:
        "अपना पासवर्ड रीसेट करने के लिए, लॉगिन पेज पर 'फॉरगॉट पासवर्ड' पर क्लिक करें और अपने रजिस्टर्ड ईमेल पर भेजे गए निर्देशों का पालन करें।",
      Japanese:
        'パスワードをリセットするには、ログインページの「パスワードをお忘れですか」をクリックし、登録済みメールに送信された案内に従ってください。',
      Korean:
        "비밀번호를 재설정하려면 로그인 페이지에서 '비밀번호 찾기'를 클릭하고 등록된 이메일로 전송된 안내를 따르세요.",
      Spanish:
        "Para restablecer tu contraseña, haz clic en '¿Olvidaste tu contraseña?' en la página de inicio de sesión y sigue las instrucciones enviadas a tu correo registrado.",
    },
  },
]

// ---------------------------------------------------------------------------
// SUPPORT RULES
// ---------------------------------------------------------------------------
const SUPPORT_RULES = [
  {
    keywords: [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening',
      'नमस्ते', 'नमस्कार',
      'こんにちは', 'おはよう', 'こんばんは',
      '안녕하세요', '안녕',
      'hola', 'buenos días', 'buenas tardes', 'buenas noches',
    ],
    reply: {
      English: "Hi there! I'm your Support Assistant. How can I help you today?",
      Hindi: 'नमस्ते! मैं आपका सपोर्ट सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
      Japanese: 'こんにちは！私はサポートアシスタントです。本日はどのようなご用件でしょうか？',
      Korean: '안녕하세요! 저는 고객 지원 어시스턴트입니다. 오늘 무엇을 도와드릴까요?',
      Spanish: '¡Hola! Soy tu Asistente de Soporte. ¿En qué puedo ayudarte hoy?',
    },
  },
  {
    keywords: [
      'order', 'track', 'tracking', 'shipment', 'delivery status', 'where is my order',
      'ऑर्डर', 'ट्रैक',
      '注文', '追跡', '配送状況',
      '주문', '배송', '배송조회',
      'pedido', 'rastrear', 'seguimiento',
    ],
    reply: {
      English:
        "You can track your order in real time from the 'My Orders' section using your order ID. You'll also receive SMS/email updates at every stage.",
      Hindi:
        "आप अपने ऑर्डर आईडी का उपयोग करके 'माय ऑर्डर्स' सेक्शन से रीयल टाइम में अपने ऑर्डर को ट्रैक कर सकते हैं। हर चरण पर आपको एसएमएस/ईमेल अपडेट भी मिलेंगे।",
      Japanese:
        '「マイ注文」セクションで注文IDを使用してリアルタイムで注文状況を確認できます。各段階でSMS/メールの通知も届きます。',
      Korean:
        "'내 주문' 섹션에서 주문 번호를 사용하여 실시간으로 배송 상태를 추적할 수 있습니다. 각 단계마다 SMS/이메일 업데이트도 받게 됩니다.",
      Spanish:
        "Puedes rastrear tu pedido en tiempo real desde la sección 'Mis Pedidos' usando tu número de pedido. También recibirás actualizaciones por SMS/correo en cada etapa.",
    },
  },
  {
    keywords: [
      'refund', 'money back', 'return', 'cancel order', 'return item',
      'रिफंड', 'वापसी',
      '返金', '返品', 'キャンセル',
      '환불', '반품', '취소',
      'reembolso', 'devolución', 'devolucion', 'cancelar',
    ],
    reply: {
      English:
        "Refunds are processed within 5-7 business days after the returned item is received and verified. You can initiate a return from the 'My Orders' page.",
      Hindi:
        "रिटर्न किए गए आइटम को प्राप्त और सत्यापित करने के बाद रिफंड 5-7 कार्य दिवसों के भीतर प्रोसेस किया जाता है। आप 'माय ऑर्डर्स' पेज से रिटर्न शुरू कर सकते हैं।",
      Japanese:
        '返品商品の受領・確認後、5〜7営業日以内に返金が処理されます。「マイ注文」ページから返品を開始できます。',
      Korean:
        "반품된 상품이 수령 및 확인된 후 5~7영업일 이내에 환불이 처리됩니다. '내 주문' 페이지에서 반품을 시작할 수 있습니다.",
      Spanish:
        "Los reembolsos se procesan en 5-7 días hábiles después de recibir y verificar el artículo devuelto. Puedes iniciar una devolución desde la página 'Mis Pedidos'.",
    },
  },
  {
    keywords: [
      'complaint', 'issue', 'problem', 'not working', 'bad experience', 'damaged', 'defective',
      'शिकायत', 'समस्या',
      '苦情', '問題', '不良品',
      '불만', '문제', '불량',
      'queja', 'problema', 'defectuoso',
    ],
    reply: {
      English:
        "I'm sorry to hear that. Please share your order ID and a brief description of the issue, and our team will get back to you within 24 hours.",
      Hindi:
        'यह सुनकर खेद है। कृपया अपना ऑर्डर आईडी और समस्या का संक्षिप्त विवरण साझा करें, हमारी टीम 24 घंटों के भीतर आपसे संपर्क करेगी।',
      Japanese:
        'それは申し訳ございません。注文IDと問題の簡単な説明をお送りください。24時間以内に担当チームよりご連絡いたします。',
      Korean:
        '불편을 드려 죄송합니다. 주문 번호와 문제에 대한 간단한 설명을 알려주시면 24시간 이내에 저희 팀이 연락드리겠습니다.',
      Spanish:
        'Lamento escuchar eso. Comparte tu número de pedido y una breve descripción del problema, y nuestro equipo se pondrá en contacto contigo en un plazo de 24 horas.',
    },
  },
  {
    keywords: [
      'price', 'pricing', 'cost', 'how much', 'charges', 'fees',
      'कीमत', 'मूल्य',
      '料金', '価格', '費用',
      '가격', '요금', '비용',
      'precio', 'costo', 'tarifa',
    ],
    reply: {
      English:
        "Pricing details for all our plans and products are listed on the 'Pricing' page. Taxes and shipping charges, if applicable, are shown at checkout.",
      Hindi:
        "हमारे सभी प्लान और उत्पादों के लिए मूल्य निर्धारण विवरण 'प्राइसिंग' पेज पर सूचीबद्ध हैं। टैक्स और शिपिंग शुल्क, यदि लागू हो, चेकआउट पर दिखाए जाते हैं।",
      Japanese:
        'すべてのプランと製品の価格詳細は「料金」ページに記載されています。税金や送料が発生する場合はチェックアウト時に表示されます。',
      Korean:
        "모든 요금제와 제품의 가격 정보는 '가격' 페이지에 나와 있습니다. 세금 및 배송비는 해당되는 경우 결제 시 표시됩니다.",
      Spanish:
        "Los detalles de precios de todos nuestros planes y productos están en la página de 'Precios'. Los impuestos y gastos de envío, si corresponden, se muestran al finalizar la compra.",
    },
  },
  {
    keywords: [
      'login', 'log in', 'sign in', 'unable to login', 'cant login', "can't login", 'access account',
      'लॉगिन', 'साइन इन',
      'ログイン', 'サインイン',
      '로그인',
      'iniciar sesión', 'iniciar sesion', 'acceso',
    ],
    reply: {
      English:
        "If you're having trouble logging in, please verify your email address and password. You can also try 'Forgot Password' to reset access.",
      Hindi:
        "अगर आपको लॉगिन करने में परेशानी हो रही है, तो कृपया अपना ईमेल पता और पासवर्ड सत्यापित करें। आप एक्सेस रीसेट करने के लिए 'फॉरगॉट पासवर्ड' भी आज़मा सकते हैं।",
      Japanese:
        'ログインにお困りの場合は、メールアドレスとパスワードをご確認ください。「パスワードをお忘れですか」からアクセスをリセットすることもできます。',
      Korean:
        "로그인에 문제가 있으시면 이메일 주소와 비밀번호를 확인해 주세요. '비밀번호 찾기'를 통해 접속을 재설정할 수도 있습니다.",
      Spanish:
        "Si tienes problemas para iniciar sesión, verifica tu correo electrónico y contraseña. También puedes usar '¿Olvidaste tu contraseña?' para restablecer el acceso.",
    },
  },
  {
    keywords: [
      'password reset', 'reset password', 'forgot password', 'change password',
      'पासवर्ड रीसेट', 'पासवर्ड भूल गए',
      'パスワード リセット', 'パスワードを忘れた',
      '비밀번호 재설정', '비밀번호를 잊어버렸어요',
      'restablecer contraseña', 'restablecer contrasena', 'olvidé mi contraseña', 'olvide mi contrasena',
    ],
    reply: {
      English:
        "To reset your password, go to the login page, click 'Forgot Password', and follow the link sent to your registered email address.",
      Hindi:
        "अपना पासवर्ड रीसेट करने के लिए, लॉगिन पेज पर जाएं, 'फॉरगॉट पासवर्ड' पर क्लिक करें, और अपने रजिस्टर्ड ईमेल पते पर भेजे गए लिंक का पालन करें।",
      Japanese:
        'パスワードをリセットするには、ログインページで「パスワードをお忘れですか」をクリックし、登録済みメールアドレスに送信されたリンクに従ってください。',
      Korean:
        "비밀번호를 재설정하려면 로그인 페이지로 이동하여 '비밀번호 찾기'를 클릭하고 등록된 이메일 주소로 전송된 링크를 따라가세요.",
      Spanish:
        "Para restablecer tu contraseña, ve a la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' y sigue el enlace enviado a tu correo registrado.",
    },
  },
]

// ---------------------------------------------------------------------------
// FALLBACKS
// ---------------------------------------------------------------------------
const FALLBACKS = {
  hr: {
    English:
      "I'm not sure I understood that. You can ask me about leave, payroll, recruitment, benefits, attendance, HR policies, login, or password reset.",
    Hindi:
      'मुझे यह ठीक से समझ नहीं आया। आप मुझसे छुट्टी, पेरोल, भर्ती, लाभ, उपस्थिति, एचआर नीतियों, लॉगिन या पासवर्ड रीसेट के बारे में पूछ सकते हैं।',
    Japanese:
      '申し訳ありませんが、うまく理解できませんでした。休暇、給与、採用、福利厚生、勤怠、HRポリシー、ログイン、パスワードリセットについてお尋ねください。',
    Korean:
      '죄송하지만 잘 이해하지 못했습니다. 휴가, 급여, 채용, 복리후생, 근태, HR 정책, 로그인 또는 비밀번호 재설정에 대해 질문해 주세요.',
    Spanish:
      'No estoy segura de haber entendido eso. Puedes preguntarme sobre vacaciones, nómina, contratación, beneficios, asistencia, políticas de RR. HH., inicio de sesión o restablecimiento de contraseña.',
  },
  support: {
    English:
      "I'm not sure I understood that. You can ask me about order tracking, refunds, complaints, pricing, login, or password reset.",
    Hindi:
      'मुझे यह ठीक से समझ नहीं आया। आप मुझसे ऑर्डर ट्रैकिंग, रिफंड, शिकायत, मूल्य निर्धारण, लॉगिन या पासवर्ड रीसेट के बारे में पूछ सकते हैं।',
    Japanese:
      '申し訳ありませんが、うまく理解できませんでした。注文状況、返金、苦情、料金、ログイン、パスワードリセットについてお尋ねください。',
    Korean:
      '죄송하지만 잘 이해하지 못했습니다. 주문 조회, 환불, 불만사항, 가격, 로그인 또는 비밀번호 재설정에 대해 질문해 주세요.',
    Spanish:
      'No estoy segura de haber entendido eso. Puedes preguntarme sobre el seguimiento de pedidos, reembolsos, quejas, precios, inicio de sesión o restablecimiento de contraseña.',
  },
}

// ---------------------------------------------------------------------------
// LANGUAGE PROMPT — shown when the user's language can't be detected
// ---------------------------------------------------------------------------
export const LANGUAGE_PROMPT =
  'Which language would you like me to use? (English, Hindi, Japanese, Korean, or Spanish)'

// ---------------------------------------------------------------------------
// QUICK PROMPTS
// ---------------------------------------------------------------------------
export const QUICK_PROMPTS = {
  hr: {
    English: [
      'How do I apply for leave?',
      'When is payroll processed?',
      'Show me open job positions',
      'What benefits am I eligible for?',
      'How do I mark attendance?',
      'Where can I find HR policies?',
      "I can't log in to the HR portal",
      'How do I reset my password?',
    ],
    Hindi: [
      'मैं छुट्टी के लिए कैसे आवेदन करूं?',
      'पेरोल कब प्रोसेस होता है?',
      'मुझे खुली नौकरी की स्थिति दिखाएं',
      'मैं किन लाभों के लिए पात्र हूं?',
      'मैं उपस्थिति कैसे दर्ज करूं?',
      'मुझे एचआर नीतियां कहां मिलेंगी?',
      'मैं एचआर पोर्टल में लॉगिन नहीं कर पा रहा हूं',
      'मैं अपना पासवर्ड कैसे रीसेट करूं?',
    ],
    Japanese: [
      '休暇はどのように申請しますか？',
      '給与はいつ処理されますか？',
      '募集中の求人を見せてください',
      '私はどの福利厚生の対象ですか？',
      '勤怠はどうやって記録しますか？',
      'HRポリシーはどこで確認できますか？',
      'HRポータルにログインできません',
      'パスワードはどうやってリセットしますか？',
    ],
    Korean: [
      '휴가는 어떻게 신청하나요?',
      '급여는 언제 처리되나요?',
      '채용 중인 직무를 보여주세요',
      '제가 받을 수 있는 복리후생은 무엇인가요?',
      '출근은 어떻게 기록하나요?',
      'HR 정책은 어디서 확인할 수 있나요?',
      'HR 포털에 로그인할 수 없어요',
      '비밀번호는 어떻게 재설정하나요?',
    ],
    Spanish: [
      '¿Cómo solicito mis vacaciones?',
      '¿Cuándo se procesa la nómina?',
      'Muéstrame las vacantes disponibles',
      '¿A qué beneficios tengo derecho?',
      '¿Cómo registro mi asistencia?',
      '¿Dónde encuentro las políticas de RR. HH.?',
      'No puedo iniciar sesión en el portal de RR. HH.',
      '¿Cómo restablezco mi contraseña?',
    ],
  },
  support: {
    English: [
      'Where is my order?',
      'How do I request a refund?',
      'I have a complaint about my order',
      'What are your pricing plans?',
      "I can't log in to my account",
      'How do I reset my password?',
    ],
    Hindi: [
      'मेरा ऑर्डर कहां है?',
      'मैं रिफंड का अनुरोध कैसे करूं?',
      'मुझे अपने ऑर्डर के बारे में शिकायत है',
      'आपकी मूल्य निर्धारण योजनाएं क्या हैं?',
      'मैं अपने खाते में लॉगिन नहीं कर पा रहा हूं',
      'मैं अपना पासवर्ड कैसे रीसेट करूं?',
    ],
    Japanese: [
      '注文はどこにありますか？',
      '返金はどうやって依頼しますか？',
      '注文について苦情があります',
      '料金プランは何ですか？',
      'アカウントにログインできません',
      'パスワードはどうやってリセットしますか？',
    ],
    Korean: [
      '제 주문은 어디에 있나요?',
      '환불은 어떻게 요청하나요?',
      '주문에 대해 불만이 있어요',
      '가격 플랜은 무엇인가요?',
      '제 계정에 로그인할 수 없어요',
      '비밀번호는 어떻게 재설정하나요?',
    ],
    Spanish: [
      '¿Dónde está mi pedido?',
      '¿Cómo solicito un reembolso?',
      'Tengo una queja sobre mi pedido',
      '¿Cuáles son sus planes de precios?',
      'No puedo iniciar sesión en mi cuenta',
      '¿Cómo restablezco mi contraseña?',
    ],
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function matchRule(rules, userText) {
  if (!userText) return null
  const text = userText.toLowerCase()

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return rule
      }
    }
  }
  return null
}

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Japanese', 'Korean', 'Spanish']

function resolveLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : 'English'
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
export function getReply(roleId, userText, language = 'English') {
  const lang = resolveLanguage(language)
  const rules = roleId === 'support' ? SUPPORT_RULES : HR_RULES
  const fallbackSet = roleId === 'support' ? FALLBACKS.support : FALLBACKS.hr

  const matched = matchRule(rules, userText)

  const sampleReply = matched ? (matched.reply[lang] || matched.reply.English) : (fallbackSet[lang] || fallbackSet.English)
  const disclaimer = {
    English: 'Demo template — not connected to live company or order records. ',
    Hindi: 'डेमो उत्तर — कंपनी या ऑर्डर के लाइव रिकॉर्ड से जुड़ा नहीं है। ',
    Japanese: 'デモ回答 — 会社や注文の実データには接続されていません。 ',
    Korean: '데모 답변 — 회사 또는 주문의 실제 기록과 연결되어 있지 않습니다. ',
    Spanish: 'Respuesta de demostración — no está conectada a registros reales de la empresa ni de pedidos. ',
  }[lang]
  return `${disclaimer}${sampleReply}`
}

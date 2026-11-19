const SMALL_TALK =
  /^(hi|hello|hey|hii|namaste|こんにちは|안녕하세요|hola|good morning|good afternoon|good evening|thanks|thank you|bye|goodbye|how are you)[!.?,\s。！？]*$/i;

const TOPICS = {
  aria: [
    {
      re: /\b(leave|vacation|holiday|time off)\b|छुट्टी|अवकाश|休暇|有給|휴가|연차|permiso|vacaciones/i,
      title: "How to Apply for Leave",
      queries: {
        English: "how to apply for leave at work HR",
        Hindi: "ऑफिस में छुट्टी के लिए आवेदन कैसे करें",
        Japanese: "会社の休暇申請方法",
        Korean: "회사 휴가 신청 방법",
        Spanish: "cómo solicitar vacaciones en el trabajo",
      },
    },
    {
      re: /\b(payroll|salary|payslip|paycheck)\b|वेतन|तनख्वाह|給与|給料|급여|월급|salario|nómina/i,
      title: "Payroll and Salary Explained",
      queries: {
        English: "payroll process salary payslip explained",
        Hindi: "सैलरी और पेस्लिप की जानकारी",
        Japanese: "給与計算と給与明細の説明",
        Korean: "급여 계산과 급여 명세서 설명",
        Spanish: "proceso de nómina y recibo de sueldo explicado",
      },
    },
    {
      re: /\b(interview|resume|cv|job application)\b|साक्षात्कार|रिज़्यूमे|面接|履歴書|면접|이력서|entrevista|currículum/i,
      title: "Interview and Job Preparation",
      queries: {
        English: "job interview preparation resume tips",
        Hindi: "नौकरी इंटरव्यू की तैयारी और रिज्यूमे टिप्स",
        Japanese: "就職面接の準備と履歴書の書き方",
        Korean: "취업 면접 준비와 이력서 작성 방법",
        Spanish: "preparación para entrevistas de trabajo y currículum",
      },
    },
    {
      re: /\b(attendance|timesheet|check in|check-in)\b|उपस्थिति|हाजिरी|出勤|勤怠|출근|근태|asistencia/i,
      title: "Employee Attendance Guide",
      queries: {
        English: "employee attendance management explained",
        Hindi: "कर्मचारी उपस्थिति प्रबंधन की जानकारी",
        Japanese: "社員の勤怠管理の説明",
        Korean: "직원 출퇴근 및 근태 관리",
        Spanish: "gestión de asistencia de empleados explicada",
      },
    },
    {
      re: /\b(benefits|insurance|allowance|health plan)\b|लाभ|बीमा|福利厚生|保険|복리후생|보험|beneficios|seguro/i,
      title: "Employee Benefits Explained",
      queries: {
        English: "employee benefits and insurance explained",
        Hindi: "कर्मचारी लाभ और बीमा की जानकारी",
        Japanese: "従業員福利厚生と保険の説明",
        Korean: "직원 복리후생과 보험 설명",
        Spanish: "beneficios laborales y seguros para empleados",
      },
    },
  ],

  snow: [
    {
      re: /\b(order|delivery|shipping|tracking|package)\b|ऑर्डर|डिलीवरी|आदेश|配送|注文|배송|주문|pedido|entrega|envío/i,
      title: "Order and Delivery Help",
      queries: {
        English: "online order delivery tracking customer support",
        Hindi: "ऑनलाइन ऑर्डर और डिलीवरी ट्रैक कैसे करें",
        Japanese: "注文と配送状況の確認方法",
        Korean: "주문 및 배송 조회 방법",
        Spanish: "cómo rastrear pedidos y entregas en línea",
      },
    },
    {
      re: /\b(refund|return|exchange|money back)\b|रिफंड|वापसी|退金|返品|환불|반품|reembolso|devolución|cambio/i,
      title: "Refunds and Returns Guide",
      queries: {
        English: "customer service refund return process explained",
        Hindi: "रिफंड और सामान वापसी की प्रक्रिया",
        Japanese: "返金と返品の手続き方法",
        Korean: "환불 및 반품 절차 안내",
        Spanish: "cómo solicitar reembolsos y devoluciones",
      },
    },
    {
      re: /\b(payment|billing|invoice|charged|charge)\b|भुगतान|बिल|支払い|請求|결제|청구|pago|factura|cobro/i,
      title: "Payment and Billing Help",
      queries: {
        English: "online payment billing troubleshooting guide",
        Hindi: "ऑनलाइन भुगतान और बिलिंग की समस्या का समाधान",
        Japanese: "オンライン決済と請求のトラブル解決",
        Korean: "온라인 결제 및 청구 문제 해결",
        Spanish: "solución de problemas de pagos y facturación",
      },
    },
    {
      re: /\b(password|login|log in|sign in|account)\b|पासवर्ड|लॉगिन|アカウント|パスワード|ログイン|계정|비밀번호|로그인|contraseña|iniciar sesión|cuenta/i,
      title: "Account Login Troubleshooting",
      queries: {
        English: "account login password troubleshooting tutorial",
        Hindi: "अकाउंट लॉगिन और पासवर्ड की समस्या का समाधान",
        Japanese: "アカウントのログインとパスワードの問題解決",
        Korean: "계정 로그인 및 비밀번호 문제 해결",
        Spanish: "solución de problemas de inicio de sesión y contraseña",
      },
    },
    {
      re: /\b(error|not working|problem|issue|troubleshoot)\b|समस्या|काम नहीं|エラー|問題|動かない|오류|문제|작동하지|error|problema|no funciona/i,
      title: "Troubleshooting Guide",
      queries: {
        English: "customer support common technical troubleshooting",
        Hindi: "तकनीकी समस्याओं का समाधान",
        Japanese: "よくある技術的な問題の解決方法",
        Korean: "일반적인 기술 문제 해결 방법",
        Spanish: "solución de problemas técnicos comunes",
      },
    },
  ],
};

export function getYouTubeRecommendation({
  userMessage,
  assistantRole,
  language = "English",
}) {
  const none = { shouldRecommend: false };
  const text = (userMessage || "").trim();

  const role = ["support", "snow"].includes(
    String(assistantRole || "").toLowerCase()
  )
    ? "snow"
    : "aria";

  if (text.length < 3 || SMALL_TALK.test(text)) return none;

  const match = TOPICS[role].find((topic) => topic.re.test(text));

  if (!match) return none;

  const searchQuery =
    match.queries[language] || match.queries.English;

  return {
    shouldRecommend: true,
    title: match.title,
    searchQuery,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
  };
}
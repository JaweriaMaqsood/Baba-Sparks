// All legal text lives here. {name} and {email} are filled in automatically from brand.ts.
export type Section = { title: string; body: (string | string[])[] };
export type Doc = { title: string; updated: string; intro: string; sections: Section[] };
const UPDATED = "November 2026";

export const privacy: Doc = {
  title: "Privacy Policy", updated: UPDATED,
  intro: "{name} is an AI workspace website. This page explains what personal data we collect, why we collect it, and what choices you have.",
  sections: [
    { title: "What we collect", body: [
      "We collect only what we need to run the service:",
      [
        "Account: your name, your email address, and your password (stored in a protected, scrambled form that we cannot read).",
        "What you put in: the messages you send to AI chat, the text you enter into tools, and the results created for you. These are saved so you can see them in Chat and History.",
        "Credits and plan: your credit balance, your credit history, and your current plan.",
        "Payments: when you pay by JazzCash we collect the number you paid from, the transaction ID, the plan, and any note you write. We do not collect card details and we never see your JazzCash PIN.",
        "Support: the tickets you send us and our replies.",
        "Usage records: the time, the tool used, the AI model, the size of the request, and any error. We use these for credits, limits and fixing problems.",
        "Technical: a login session cookie, and basic logs kept by our hosting provider.",
      ],
    ] },
    { title: "Why we use it", body: [
      "We use your data to run your account, give and count your credits, check payments, answer support requests, keep the service safe and fair (for example, limits on how many requests you can send per minute), and email you about your payments, tickets and account.",
      "We do not sell your data, and we do not show advertisements.",
    ] },
    { title: "Who else handles your data", body: [
      "We use other companies to run the service. Each one has its own privacy terms.",
      [
        "Supabase: our database and login system.",
        "Groq: the AI service. The text of your chat messages and tool inputs is sent to it so it can write an answer.",
        "Brevo: sends our emails.",
        "Vercel: hosts the website.",
      ],
      "Some of these companies work outside Pakistan, so your data may be processed in other countries. Please do not enter very sensitive information (such as passwords, ID card numbers, bank details or medical records) into the chat or tools. We may also share data if the law requires it.",
    ] },
    { title: "Cookies", body: ["We use only the cookies needed to keep you logged in. We do not use advertising or tracking cookies."] },
    { title: "How long we keep data, and deleting it", body: [
      "We keep your data while your account is active. You can delete any chat conversation yourself from AI chat.",
      "To delete your account or other data (such as your History or support tickets), email {email} from the address you registered with. We will act on it within 30 days. We may need to keep some records, such as payment records, for accounting or legal reasons.",
    ] },
    { title: "Your choices", body: ["You can change your name and password in Settings. You can ask us for a copy of your data, or ask us to correct or delete it, by emailing {email}."] },
    { title: "Security", body: ["Data travels over encrypted connections. Our database is set up so that each user can read only their own chats, history and payments. No online service can promise perfect security, so please use a strong, unique password."] },
    { title: "Children", body: ["{name} is not meant for children under 13, and we do not knowingly collect data from them. If you are under 18, please use it with a parent or guardian's permission."] },
    { title: "Changes to this policy", body: ["We may update this page. The date at the top shows the latest version. If a change is important, we will tell you on the site or by email."] },
    { title: "Contact", body: ["Questions about your data: {email}."] },
  ],
};

export const terms: Doc = {
  title: "Terms of Service", updated: UPDATED,
  intro: "By creating an account or using {name}, you agree to these terms. If you do not agree, please do not use the service.",
  sections: [
    { title: "The service", body: ["{name} gives you AI tools (chat, writing, translation and more) that you use with credits. The service is run by the people behind {name} (\"we\"). It is provided as an early service and may change."] },
    { title: "Your account", body: [
      "You must give a real email address and keep your password private. You are responsible for what happens under your account. Tell us at once if you think someone else is using it.",
      "If you are under 18, please use the service only with a parent or guardian's permission.",
    ] },
    { title: "What you may not do", body: [
      "You agree not to use the service to:",
      [
        "break the law or help others break it;",
        "create or share content that exploits or harms children, or that is threatening, hateful or harassing;",
        "make malware, scams, fake reviews, spam, or content meant to deceive people about who wrote it or who you are;",
        "copy or sell other people's work you do not have the right to use;",
        "try to get around credits, limits or security, or put load on the service on purpose;",
        "collect or resell the service's output at scale, or use bots to access it.",
      ],
      "We may remove content and suspend or close accounts that break these rules.",
    ] },
    { title: "AI answers can be wrong", body: [
      "The AI writes answers by predicting text. It can make mistakes, invent facts, and miss important details. Always check anything important before you use it.",
      "The service is not a lawyer, doctor, financial advisor or teacher, and its output is not professional advice. Business, SEO and similar tools give suggestions, not verified research.",
    ] },
    { title: "Your content", body: [
      "You keep the rights you have in the text you enter and the results created for you. You are responsible for how you use the results, and for making sure your input does not break anyone else's rights.",
      "You allow us to store and process your content, and to send it to our AI provider, only so that we can run the service for you.",
    ] },
    { title: "Credits, plans and payments", body: [
      [
        "Every AI action uses credits. The cost is shown before you run it. If the AI service fails, the credits for that action are returned.",
        "Credits have no cash value and cannot be transferred to another person.",
        "Paid plans are paid by JazzCash. We check each payment by hand, so activation is not instant. Credits are added when we approve the payment.",
        "Prices are in Pakistani rupees. We may change prices for future purchases. We will not change the price of a payment you have already made.",
        "Refunds are explained in our Refund Policy.",
      ],
    ] },
    { title: "Availability", body: ["We try to keep the service running, but we cannot promise it will always be available or free of errors. It depends on other services, and some may be limited or change. We may add, change or remove features."] },
    { title: "Ending your use", body: ["You can stop using the service at any time. We may suspend or close an account that breaks these terms or puts the service or other users at risk. To close your account, email {email}."] },
    { title: "Our responsibility", body: ["The service is provided \"as is\". To the extent the law allows, we are not responsible for losses that come from using or being unable to use the service, or from relying on AI output. Where we are responsible, it is limited to the amount you paid us in the 3 months before the problem. Nothing here limits rights that the law does not allow us to limit."] },
    { title: "Changes and law", body: ["We may update these terms. The date at the top shows the latest version, and using the service after a change means you accept it. These terms are governed by the laws of Pakistan."] },
    { title: "Contact", body: ["Questions about these terms: {email}."] },
  ],
};

export const refund: Doc = {
  title: "Refund Policy", updated: UPDATED,
  intro: "This page explains when you can get your money back for a paid plan on {name}.",
  sections: [
    { title: "When we refund", body: [
      [
        "If you ask within 7 days after we approve your payment, and you have not used any of the credits from that purchase, we will refund the full amount.",
        "If you were charged twice for the same plan, or you paid but we could not activate your plan, we will refund the extra or unused payment.",
      ],
    ] },
    { title: "When we do not refund", body: [
      [
        "Credits that have already been used are not refunded.",
        "Refunds are not given because an AI answer was not what you hoped for. AI output can be imperfect, so please check results before you rely on them.",
        "Accounts closed for breaking our Terms of Service are not refunded.",
      ],
    ] },
    { title: "If the AI service fails", body: ["If an AI action fails because of a problem on our side or with the AI provider, the credits for that action are returned to your balance automatically."] },
    { title: "How to ask", body: [
      "Send a ticket from the Support page, or email {email}, from the account you paid with. Write your transaction ID and the reason.",
      "We will reply with our decision. If we approve a refund, we aim to send it back to the same JazzCash number within 7 working days. When a refund is made, the credits from that purchase are removed from your balance.",
    ] },
    { title: "Contact", body: ["Questions about refunds: {email}."] },
  ],
};

export type ChatQuestionType = "text" | "email" | "phone" | "choice";
export type ChatQuestion = { id: string; label: string; prompt: string; description: string; type: ChatQuestionType; required: boolean; choices?: readonly string[]; airtableField: string };

export const chatbotConfig = {
  brandName: "SalonVault",
  assistantName: "Sia",
  welcomeMessage: "Hey! Welcome to SalonVault - I'm Sia. I'd love to learn a little about what you're working on. How can I help today?",
  submittedMessage: "Perfect - your inquiry is recorded. Our team will contact you shortly.",
  duplicateMessage: "We already have an inquiry with this email and phone. Our team will get back to you soon.",
  postGoalMessage: "Your inquiry is already with our team. We'll be in touch soon.",
  newInquiryLockedMessage: "We can’t process another request in this chat yet. You can start a new inquiry two hours after your previous submission.",
  maxReplyWords: 100,
  recentMessagesForModel: 10,
  messagesStoredLocally: 30,
  localStorageTtlMs: 2 * 60 * 60 * 1000,
  localStorageKey: "salonvault-chat-v6",
  starterPrompts: ["I need a website", "I want more bookings", "I need custom software"],
  questions: [
    { id: "name", label: "Name", prompt: "What name should I use?", description: "The visitor's full name.", type: "text", required: true, airtableField: "Name" },
    { id: "service", label: "Service", prompt: "Which SalonVault service are you most interested in?", description: "The closest matching SalonVault service.", type: "choice", required: true, choices: ["Website Launch", "Growth System", "Salon Suite", "Other", "Not sure"], airtableField: "Service" },
    { id: "email", label: "Email", prompt: "What is the best email address for the follow-up?", description: "A valid contact email address.", type: "email", required: true, airtableField: "Email" },
    { id: "phone", label: "Phone", prompt: "What phone or WhatsApp number can we reach you on?", description: "A phone number including country code when possible.", type: "phone", required: true, airtableField: "Phone" },
  ] satisfies readonly ChatQuestion[],
  knowledge: [
    "Website Launch costs $300 as a one-time build and covers a custom responsive website, booking-focused calls to action, basic local SEO, mobile optimization, and contact forms.",
    "Growth System costs $500 as a one-time build and includes the website package plus a custom inquiry chatbot, lead capture, appointment prompts, premium conversion sections, and advanced integration support.",
    "Salon Suite is custom quoted software for booking, staff, client, inventory, dashboard, and workflow needs.",
    "SalonVault focuses on beauty businesses such as hair salons, nail studios, skincare clinics, barbershops, lash studios, spas, and related service brands.",
    "SalonVault can connect common booking tools, calendar links, contact forms, WhatsApp, and appointment flows.",
    "A free 30-minute strategy call is available after the visitor shares their requirements.",
  ],
} as const;

export type ChatQuestionId = (typeof chatbotConfig.questions)[number]["id"];
export const requiredQuestions = chatbotConfig.questions.filter((question) => question.required);

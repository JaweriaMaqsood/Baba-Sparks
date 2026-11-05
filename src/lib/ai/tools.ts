export type Field = { name: string; label: string; type: "text" | "textarea" | "select"; required?: boolean; max: number; options?: string[]; placeholder?: string };
export type Tool = {
  slug: string; name: string; category: string; description: string; cost: number; fields: Field[];
  build: (i: Record<string, string>) => string;
};
export type PublicTool = Omit<Tool, "build">;

const tones = ["Professional", "Friendly", "Persuasive", "Casual", "Formal"];
const wrap = (label: string, v: string) => `<user_input name="${label}">\n${v}\n</user_input>`;

export const tools: Tool[] = [
  {
    slug: "seo-meta-description", name: "SEO meta description", category: "SEO", cost: 1,
    description: "Three meta descriptions, each under 160 characters.",
    fields: [
      { name: "topic", label: "Page topic", type: "textarea", required: true, max: 500, placeholder: "Handmade leather wallets for travelers" },
      { name: "tone", label: "Tone", type: "select", max: 20, options: tones },
    ],
    build: (i) => `Write 3 different SEO meta descriptions, each at most 160 characters, in a ${i.tone || "Professional"} tone, as a numbered list.\n${wrap("topic", i.topic)}`,
  },
  {
    slug: "headline-generator", name: "Headline generator", category: "Writing", cost: 1,
    description: "Ten headline ideas for an article, post or page.",
    fields: [
      { name: "topic", label: "What is it about?", type: "textarea", required: true, max: 500 },
      { name: "tone", label: "Tone", type: "select", max: 20, options: tones },
    ],
    build: (i) => `Write 10 distinct headlines in a ${i.tone || "Professional"} tone, as a numbered list.\n${wrap("topic", i.topic)}`,
  },
  {
    slug: "professional-email", name: "Professional email", category: "Writing", cost: 2,
    description: "A clear email with a subject line.",
    fields: [
      { name: "purpose", label: "What should the email say?", type: "textarea", required: true, max: 1500, placeholder: "Ask my manager for Friday off to attend a family event" },
      { name: "tone", label: "Tone", type: "select", max: 20, options: tones },
    ],
    build: (i) => `Write a ${i.tone || "Professional"} email with a subject line. Keep it concise. Use placeholders like [Name] where details are missing.\n${wrap("purpose", i.purpose)}`,
  },
  {
    slug: "summarizer", name: "Text summarizer", category: "Writing", cost: 2,
    description: "Short summary with key points. Paste text, up to 8,000 characters.",
    fields: [
      { name: "text", label: "Text to summarize", type: "textarea", required: true, max: 8000 },
      { name: "length", label: "Length", type: "select", max: 20, options: ["Short", "Medium", "Detailed"] },
    ],
    build: (i) => `Summarize the text. Length: ${i.length || "Medium"}. Give a short paragraph, then bullet points for the key ideas. Do not add facts that are not in the text.\n${wrap("text", i.text)}`,
  },
  {
    slug: "grammar-corrector", name: "Grammar corrector", category: "Writing", cost: 1,
    description: "Fixes grammar, spelling and punctuation without changing the meaning.",
    fields: [{ name: "text", label: "Your text", type: "textarea", required: true, max: 5000 }],
    build: (i) => `Correct grammar, spelling and punctuation. Keep the meaning and the language of the text. Output the corrected text, then a short list of what you changed.\n${wrap("text", i.text)}`,
  },
  {
    slug: "translator", name: "Translator", category: "Translation", cost: 2,
    description: "Translate between English, Urdu, Arabic, Hindi, Punjabi, Sindhi, Spanish, French and German.",
    fields: [
      { name: "text", label: "Text", type: "textarea", required: true, max: 5000 },
      { name: "target", label: "Translate to", type: "select", required: true, max: 20, options: ["English", "Urdu", "Arabic", "Hindi", "Punjabi", "Sindhi", "Spanish", "French", "German"] },
      { name: "style", label: "Style", type: "select", max: 20, options: ["Natural", "Formal", "Casual"] },
    ],
    build: (i) => `Translate the text into ${i.target}. Style: ${i.style || "Natural"}. Keep the tone and meaning. Output only the translation.\n${wrap("text", i.text)}`,
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const publicTool = ({ build, ...rest }: Tool): PublicTool => { void build; return rest; };

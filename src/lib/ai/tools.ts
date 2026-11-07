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


// ---- compact helpers for simple tools ----
const area = (name: string, label: string, max = 1500, required = true, placeholder?: string): Field => ({ name, label, type: "textarea", required, max, placeholder });
const txt = (name: string, label: string, max = 200, required = true, placeholder?: string): Field => ({ name, label, type: "text", required, max, placeholder });
const sel = (name: string, label: string, options: string[]): Field => ({ name, label, type: "select", max: 30, options });
const T = (slug: string, name: string, category: string, cost: number, description: string, fields: Field[], instruction: string): Tool => ({
  slug, name, category, cost, description, fields,
  build: (i) => `${instruction.replace(/\{(\w+)\}/g, (_, k) => i[k] || "")}\n${fields.filter((f) => f.type !== "select").map((f) => wrap(f.name, i[f.name] || "")).join("\n")}`,
});

tools.push(
  T("blog-outline", "Blog outline", "SEO", 2, "A structured outline with headings and key points.", [area("topic", "Blog topic", 500), txt("audience", "Audience", 100, false)], "Write a blog post outline with an H1, H2 sections and 2-3 bullet points per section. Add a short list of FAQ ideas at the end."),
  T("faq-generator", "FAQ generator", "SEO", 2, "Questions and answers for a page or product.", [area("topic", "Topic or product", 800)], "Write 8 frequently asked questions with short, accurate answers. Do not invent specific facts, prices or statistics."),
  T("instagram-caption", "Instagram caption", "Social media", 1, "Five caption options with emojis.", [area("about", "What is the post about?", 500), sel("tone", "Tone", tones)], "Write 5 Instagram captions in a {tone} tone with a few fitting emojis. Number them."),
  T("hashtag-generator", "Hashtag generator", "Social media", 1, "20 relevant hashtags.", [area("about", "Post or topic", 500)], "Suggest 20 relevant hashtags, mixing broad and niche ones. Output them on one line separated by spaces."),
  T("youtube-title", "YouTube title", "Social media", 1, "Ten title ideas.", [area("about", "Video topic", 500)], "Write 10 YouTube title ideas under 70 characters each. Numbered list. No false claims."),
  T("youtube-description", "YouTube description", "Social media", 2, "Description with a hook and chapters placeholder.", [area("about", "Video summary", 1000)], "Write a YouTube description: a 2-line hook, a short summary, a placeholder chapters section, and a call to action."),
  T("linkedin-post", "LinkedIn post", "Social media", 2, "A professional post with a hook.", [area("about", "What do you want to share?", 1000), sel("tone", "Tone", tones)], "Write a LinkedIn post in a {tone} tone with a strong first line, short paragraphs, and a closing question. Do not invent achievements."),
  T("tweet-generator", "Tweet generator", "Social media", 1, "Five tweets under 280 characters.", [area("about", "Topic", 500)], "Write 5 tweets, each under 280 characters. Numbered list."),
  T("product-description", "Product description", "Business", 2, "Clear, benefit-led copy for a product page.", [txt("name", "Product name", 120), area("details", "Features and details", 1000)], "Write a product description with a headline, a short paragraph, and 4 benefit bullets. Use only the details given."),
  T("business-name", "Business name ideas", "Business", 1, "Fifteen name ideas.", [area("about", "What does the business do?", 600)], "Suggest 15 short, memorable business names with a few words on the idea behind each. Note that availability must be checked separately."),
  T("slogan-generator", "Slogan generator", "Business", 1, "Ten slogans.", [txt("brand", "Brand or product", 120), area("about", "What it offers", 500)], "Write 10 short slogans. Numbered list."),
  T("facebook-ad-copy", "Facebook ad copy", "Business", 2, "Three ad variations.", [area("about", "Product and offer", 800), area("audience", "Target audience", 300, false)], "Write 3 Facebook ad variations, each with a headline, primary text and call to action. Do not invent discounts or claims."),
  T("sales-email", "Sales email", "Business", 2, "A short outreach email.", [area("about", "What you sell and to whom", 1000)], "Write a short sales email with a subject line, a personal opening, one clear benefit, and a call to action. Use [Name] placeholders."),
  T("swot-analysis", "SWOT analysis", "Business", 2, "AI-generated SWOT. Suggestions, not verified research.", [area("about", "Business or idea", 1000)], "Write a SWOT analysis with 4 points per quadrant. State at the end that this is an AI-generated suggestion and not verified market research."),
  T("rewriter", "Rewriter", "Writing", 1, "Rewrite text in a new tone.", [area("text", "Your text", 4000), sel("tone", "Tone", tones)], "Rewrite the text in a {tone} tone. Keep the meaning and the language."),
  T("paraphraser", "Paraphraser", "Writing", 1, "Say the same thing in different words.", [area("text", "Your text", 4000)], "Paraphrase the text with different wording and structure. Keep the meaning and the language."),
  T("story-writer", "Story writer", "Writing", 3, "A short story from your idea.", [area("idea", "Story idea", 800), sel("length", "Length", ["Short (about 250 words)", "Medium (about 500 words)"])], "Write a story. Length: {length}. Give it a title, a clear beginning, middle and end."),
  T("study-notes", "Study notes", "Productivity", 2, "Clear notes from your text.", [area("text", "Text or topic", 6000)], "Turn the material into organized study notes with headings, key terms and a short recap. Only use what is given."),
  T("quiz-generator", "Quiz generator", "Productivity", 2, "Multiple-choice questions with answers.", [area("text", "Text or topic", 6000), sel("count", "Questions", ["5", "10"])], "Write {count} multiple-choice questions, each with 4 options, then an answer key with one-line explanations."),
  T("flashcards", "Flashcard generator", "Productivity", 2, "Question and answer cards.", [area("text", "Text or topic", 6000)], "Create 10 flashcards in the format Q: ... / A: ... Use only the material given."),
  T("todo-list", "To-do list", "Productivity", 1, "A prioritized checklist.", [area("text", "What do you need to get done?", 2000)], "Turn this into a prioritized to-do list with short action items."),
  T("meeting-notes", "Meeting notes", "Productivity", 2, "Summary, decisions and action items.", [area("text", "Paste meeting notes or transcript", 8000)], "Write meeting notes with: Summary, Decisions, Action items (with owner if stated). Do not invent names or dates."),
);

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const publicTool = ({ build, ...rest }: Tool): PublicTool => { void build; return rest; };

import { LegalDoc } from "@/components/layout/LegalDoc";
import { privacy } from "@/config/legal";

export const metadata = { title: "Privacy Policy" };
export default function Page() { return <LegalDoc doc={privacy} />; }

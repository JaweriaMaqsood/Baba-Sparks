import { LegalDoc } from "@/components/layout/LegalDoc";
import { terms } from "@/config/legal";

export const metadata = { title: "Terms of Service" };
export default function Page() { return <LegalDoc doc={terms} />; }

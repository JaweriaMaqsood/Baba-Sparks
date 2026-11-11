import { LegalDoc } from "@/components/layout/LegalDoc";
import { refund } from "@/config/legal";

export const metadata = { title: "Refund Policy" };
export default function Page() { return <LegalDoc doc={refund} />; }

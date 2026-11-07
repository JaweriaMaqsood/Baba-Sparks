import { ChatShell } from "@/components/chat/ChatShell";
export const metadata = { title: "AI chat" };
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <ChatShell id={(await params).id} />; }

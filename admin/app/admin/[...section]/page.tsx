import type { Metadata } from "next";
import { DataWorkspace } from "@/components/data-workspace";
import { RecordDetail } from "@/components/record-detail";
import { RecordEditor } from "@/components/record-editor";
import { resourceMeta } from "@/lib/navigation";
import { ChatInbox } from "@/components/chat-inbox";

export async function generateMetadata({ params }: { params: Promise<{ section: string[] }> }): Promise<Metadata> { const [resource] = (await params).section; return { title: resourceMeta[resource]?.title ?? resource }; }
export default async function AdminSectionPage({ params, searchParams }: { params: Promise<{ section: string[] }>; searchParams: Promise<{ edit?: string }> }) { const [resource, id] = (await params).section; const edit = (await searchParams).edit === "1"; if (resource === "chat") return <ChatInbox />; if (!id) return <DataWorkspace resource={resource} />; if (id === "new" || edit) return <RecordEditor resource={resource} id={id === "new" ? undefined : id} />; return <RecordDetail resource={resource} id={id} />; }

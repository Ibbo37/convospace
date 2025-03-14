import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
const MESSAGES_BATCH = 10;
export async function GET(req) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");
        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });
        if (!channelId)
            return new NextResponse("Missing channelId", { status: 400 });
        let messages = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[messages.length - 1].id;
        }
        return NextResponse.json({
            items: messages,
            nextCursor,
        });
    }
    catch (error) {
        console.log("[MESSAGES_GET_ERROR]", error);
        return new NextResponse("Internam Error", { status: 500 });
    }
}

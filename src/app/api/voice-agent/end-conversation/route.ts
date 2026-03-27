import { NextResponse } from "next/server";
import { updateVoiceConversation } from "@/lib/db";

// Called by ElevenLabs when conversation ends (post-call webhook)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      summary,
      transcript,
      duration_seconds,
      status,
    } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }

    const conversation = await updateVoiceConversation(conversation_id, {
      summary,
      transcript,
      duration_seconds,
      status: status || "completed",
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    console.log(`Voice conversation ${conversation_id} ended. Duration: ${duration_seconds}s`);

    return NextResponse.json({
      success: true,
      message: "Conversation ended and recorded",
      conversation_id: conversation.id,
    });
  } catch (error) {
    console.error("Error ending voice conversation:", error);
    return NextResponse.json(
      { error: "Failed to end conversation" },
      { status: 500 }
    );
  }
}

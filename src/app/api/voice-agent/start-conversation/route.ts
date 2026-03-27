import { NextResponse } from "next/server";
import { createVoiceConversation } from "@/lib/db";

// Called by ElevenLabs when a conversation starts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversation_id, caller_type } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }

    const conversation = await createVoiceConversation(
      conversation_id,
      caller_type || "new_client"
    );

    return NextResponse.json({
      success: true,
      conversation_db_id: conversation.id,
      message: "Conversation started successfully",
    });
  } catch (error) {
    console.error("Error starting voice conversation:", error);
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}

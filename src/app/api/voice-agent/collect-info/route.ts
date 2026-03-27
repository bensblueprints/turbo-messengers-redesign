import { NextResponse } from "next/server";
import {
  updateVoiceConversation,
  getVoiceConversationByElevenLabsId,
  createVoiceConversation,
} from "@/lib/db";

// Called by ElevenLabs to collect caller information during conversation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      caller_name,
      caller_email,
      caller_phone,
      caller_company,
      intent,
    } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }

    // Get or create the conversation in our database
    let conversation = await getVoiceConversationByElevenLabsId(conversation_id);

    if (!conversation) {
      // Create conversation if it doesn't exist
      conversation = await createVoiceConversation(conversation_id, "new_client");
    }

    const updateData: Record<string, string | undefined> = {};

    if (caller_name) updateData.caller_name = caller_name;
    if (caller_email) updateData.caller_email = caller_email;
    if (caller_phone) updateData.caller_phone = caller_phone;
    if (caller_company) updateData.caller_company = caller_company;
    if (intent) updateData.intent = intent;

    const updatedConversation = await updateVoiceConversation(conversation_id, updateData);

    if (!updatedConversation) {
      return NextResponse.json(
        { error: "Failed to update conversation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Information collected successfully",
      collected: updateData,
    });
  } catch (error) {
    console.error("Error collecting caller info:", error);
    return NextResponse.json(
      { error: "Failed to collect information" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  getVoiceConversationByElevenLabsId,
  createVoiceConversation,
  createVoiceServiceRequest,
  updateVoiceConversation,
} from "@/lib/db";

// Called by ElevenLabs to create a new service request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      service_type,
      defendant_name,
      defendant_address,
      defendant_city,
      defendant_state,
      defendant_zip,
      case_number,
      court_name,
      county,
      rush_service,
      special_instructions,
      callback_requested,
      callback_number,
      // Also accept caller info in case it wasn't collected yet
      caller_name,
      caller_email,
      caller_phone,
      caller_company,
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

    // Update conversation with any caller info provided
    if (caller_name || caller_email || caller_phone || caller_company) {
      await updateVoiceConversation(conversation_id, {
        caller_name,
        caller_email,
        caller_phone,
        caller_company,
      });
    }

    // Validate service type
    const validServiceTypes = [
      "process_service",
      "court_filing",
      "small_claims",
      "document_retrieval",
      "status_inquiry",
      "general_inquiry",
    ];

    const normalizedServiceType = service_type
      ? service_type.toLowerCase().replace(/\s+/g, "_")
      : "general_inquiry";

    const finalServiceType = validServiceTypes.includes(normalizedServiceType)
      ? normalizedServiceType
      : "general_inquiry";

    // Create the service request
    const serviceRequest = await createVoiceServiceRequest(conversation.id, {
      client_id: conversation.existing_client_id || undefined,
      service_type: finalServiceType as "process_service" | "court_filing" | "small_claims" | "document_retrieval" | "status_inquiry" | "general_inquiry",
      defendant_name,
      defendant_address,
      defendant_city,
      defendant_state,
      defendant_zip,
      case_number,
      court_name,
      county,
      rush_service: rush_service === true || rush_service === "true" || rush_service === "yes",
      special_instructions,
      callback_requested: callback_requested === true || callback_requested === "true" || callback_requested === "yes",
      callback_number,
    });

    // Generate confirmation message
    let confirmationMessage = `I've created a ${finalServiceType.replace(/_/g, " ")} request`;

    if (defendant_name) {
      confirmationMessage += ` for ${defendant_name}`;
    }

    if (rush_service) {
      confirmationMessage += " with rush service";
    }

    confirmationMessage += ". Our team will review this and follow up with you shortly.";

    if (callback_requested && callback_number) {
      confirmationMessage += ` We'll call you back at ${callback_number}.`;
    }

    return NextResponse.json({
      success: true,
      request_id: serviceRequest.id,
      service_type: finalServiceType,
      message: confirmationMessage,
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 }
    );
  }
}

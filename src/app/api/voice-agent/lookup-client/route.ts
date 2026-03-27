import { NextResponse } from "next/server";
import {
  lookupClientByPhone,
  lookupClientByEmail,
  getClientJobHistory,
  updateVoiceConversation,
  getVoiceConversationByElevenLabsId,
  createVoiceConversation,
} from "@/lib/db";

// Called by ElevenLabs to look up existing client by phone or email
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversation_id, phone, email } = body;

    // Get or create the conversation in our database
    if (conversation_id) {
      let conversation = await getVoiceConversationByElevenLabsId(conversation_id);
      if (!conversation) {
        await createVoiceConversation(conversation_id, "existing_client");
      }
    }

    let client = null;

    // Try to find client by phone first, then email
    if (phone) {
      client = await lookupClientByPhone(phone);
    }

    if (!client && email) {
      client = await lookupClientByEmail(email);
    }

    if (client) {
      // Get recent job history
      const recentJobs = await getClientJobHistory(client.id);

      // Update conversation with existing client info
      if (conversation_id) {
        await updateVoiceConversation(conversation_id, {
          existing_client_id: client.id,
          caller_name: client.full_name,
          caller_email: client.email,
          caller_phone: client.phone || undefined,
          caller_company: client.company_name || undefined,
        });
      }

      // Format job history for the agent
      const jobSummary = recentJobs.map((job) => ({
        id: job.id,
        type: job.job_type.replace(/_/g, " "),
        status: job.status,
        defendant: job.defendant_name,
        case_number: job.case_number,
        created: new Date(job.created_at).toLocaleDateString(),
      }));

      return NextResponse.json({
        found: true,
        client: {
          id: client.id,
          name: client.full_name,
          company: client.company_name,
          email: client.email,
          phone: client.phone,
        },
        recent_jobs: jobSummary,
        message: `Found existing client: ${client.full_name}${client.company_name ? ` from ${client.company_name}` : ""}. They have ${recentJobs.length} recent orders.`,
      });
    }

    return NextResponse.json({
      found: false,
      message: "No existing client found with that information. This appears to be a new client.",
    });
  } catch (error) {
    console.error("Error looking up client:", error);
    return NextResponse.json(
      { error: "Failed to lookup client", found: false },
      { status: 500 }
    );
  }
}

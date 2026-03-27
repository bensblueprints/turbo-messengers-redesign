import { NextResponse } from "next/server";
import {
  getJobById,
  getJobsByClientId,
  getVoiceConversationByElevenLabsId,
  createVoiceConversation,
} from "@/lib/db";

// Called by ElevenLabs to check job status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversation_id, job_id, case_number, defendant_name } = body;

    // Ensure conversation exists in database
    if (conversation_id) {
      const existingConversation = await getVoiceConversationByElevenLabsId(conversation_id);
      if (!existingConversation) {
        await createVoiceConversation(conversation_id, "existing_client");
      }
    }

    // If we have a specific job ID, look it up directly
    if (job_id) {
      const job = await getJobById(parseInt(job_id));

      if (job) {
        return NextResponse.json({
          found: true,
          job: {
            id: job.id,
            type: job.job_type.replace(/_/g, " "),
            status: job.status,
            defendant: job.defendant_name,
            case_number: job.case_number,
            court: job.court_name,
            rush: job.rush_service,
            created: new Date(job.created_at).toLocaleDateString(),
            updated: new Date(job.updated_at).toLocaleDateString(),
          },
          message: formatJobStatusMessage(job),
        });
      }

      return NextResponse.json({
        found: false,
        message: `I couldn't find a job with ID ${job_id}. Could you please verify the job number?`,
      });
    }

    // If we have conversation context, try to find jobs for that client
    if (conversation_id) {
      const conversation = await getVoiceConversationByElevenLabsId(conversation_id);

      if (conversation?.existing_client_id) {
        const jobs = await getJobsByClientId(conversation.existing_client_id);

        // Filter by case number or defendant name if provided
        let filteredJobs = jobs;

        if (case_number) {
          filteredJobs = jobs.filter(
            (j) => j.case_number?.toLowerCase().includes(case_number.toLowerCase())
          );
        }

        if (defendant_name && filteredJobs.length === 0) {
          filteredJobs = jobs.filter(
            (j) => j.defendant_name?.toLowerCase().includes(defendant_name.toLowerCase())
          );
        }

        if (filteredJobs.length > 0) {
          const job = filteredJobs[0];
          return NextResponse.json({
            found: true,
            job: {
              id: job.id,
              type: job.job_type.replace(/_/g, " "),
              status: job.status,
              defendant: job.defendant_name,
              case_number: job.case_number,
              court: job.court_name,
              rush: job.rush_service,
              created: new Date(job.created_at).toLocaleDateString(),
              updated: new Date(job.updated_at).toLocaleDateString(),
            },
            total_matches: filteredJobs.length,
            message: formatJobStatusMessage(job),
          });
        }

        // Return most recent jobs if no specific match
        if (jobs.length > 0) {
          const recentJobs = jobs.slice(0, 3).map((j) => ({
            id: j.id,
            type: j.job_type.replace(/_/g, " "),
            status: j.status,
            defendant: j.defendant_name,
            case_number: j.case_number,
          }));

          return NextResponse.json({
            found: true,
            recent_jobs: recentJobs,
            message: `I found ${jobs.length} job${jobs.length > 1 ? "s" : ""} on your account. Your most recent one is a ${jobs[0].job_type.replace(/_/g, " ")} for ${jobs[0].defendant_name || "an unnamed party"}, which is currently ${jobs[0].status.replace(/_/g, " ")}.`,
          });
        }
      }
    }

    return NextResponse.json({
      found: false,
      message: "I couldn't find any matching jobs. Could you provide more details like the case number, defendant name, or your account information?",
    });
  } catch (error) {
    console.error("Error checking job status:", error);
    return NextResponse.json(
      { error: "Failed to check job status", found: false },
      { status: 500 }
    );
  }
}

function formatJobStatusMessage(job: {
  job_type: string;
  status: string;
  defendant_name?: string;
  case_number?: string;
  updated_at: string;
}): string {
  const statusMessages: Record<string, string> = {
    pending: "is pending and will be processed soon",
    in_progress: "is currently in progress. Our process server is working on it",
    completed: "has been completed successfully",
    on_hold: "is currently on hold. Please contact our office for more details",
  };

  const statusMsg = statusMessages[job.status] || `has a status of ${job.status}`;
  const jobType = job.job_type.replace(/_/g, " ");

  let message = `Your ${jobType}`;

  if (job.defendant_name) {
    message += ` for ${job.defendant_name}`;
  }

  if (job.case_number) {
    message += ` (case ${job.case_number})`;
  }

  message += ` ${statusMsg}.`;

  if (job.status === "completed") {
    message += " The proof of service has been filed.";
  }

  return message;
}

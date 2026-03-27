import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAllJobs, updateJobStatus, createJob, getUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobs = await getAllJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { jobId, status } = await request.json();

    if (!jobId || !status) {
      return NextResponse.json({ error: "Missing jobId or status" }, { status: 400 });
    }

    await updateJobStatus(jobId, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      client_id,
      job_type,
      defendant_name,
      defendant_address,
      case_number,
      court_name,
      notes,
      rush_service,
    } = await request.json();

    if (!client_id || !job_type) {
      return NextResponse.json(
        { error: "Client ID and job type are required" },
        { status: 400 }
      );
    }

    // Verify the client exists
    const client = await getUserById(client_id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Create the job on behalf of the client
    const job = await createJob({
      client_id,
      job_type,
      defendant_name,
      defendant_address,
      case_number,
      court_name,
      notes,
      rush_service: rush_service || false,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

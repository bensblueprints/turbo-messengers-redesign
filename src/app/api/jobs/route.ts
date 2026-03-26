import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getJobsByClientId, createJob } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const jobs = await getJobsByClientId(parseInt(userId));
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const body = await request.json();
    const {
      job_type,
      defendant_name,
      defendant_address,
      case_number,
      court_name,
      notes,
      rush_service,
    } = body;

    const job = await createJob({
      client_id: parseInt(userId),
      job_type,
      defendant_name,
      defendant_address,
      case_number,
      court_name,
      notes,
      rush_service,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

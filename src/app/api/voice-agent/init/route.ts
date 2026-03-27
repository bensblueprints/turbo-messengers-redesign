import { NextResponse } from "next/server";
import { initVoiceAgentTables } from "@/lib/db";

export async function GET() {
  try {
    await initVoiceAgentTables();
    return NextResponse.json({
      success: true,
      message: "Voice agent tables initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing voice agent tables:", error);
    return NextResponse.json(
      { error: "Failed to initialize voice agent tables" },
      { status: 500 }
    );
  }
}

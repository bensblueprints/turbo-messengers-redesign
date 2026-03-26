import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDatabase, getUserByEmail } from "@/lib/db";

export async function GET() {
  try {
    // Initialize database tables
    await initDatabase();

    // Check if admin exists
    const adminExists = await getUserByEmail("admin@turbomessengers.com");

    if (!adminExists) {
      // Create admin user
      const passwordHash = await bcrypt.hash("turbomessengers2026", 10);
      await sql`
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ('admin@turbomessengers.com', ${passwordHash}, 'Admin', 'admin')
      `;
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminExists: !!adminExists
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

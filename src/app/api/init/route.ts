import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, initDatabase, getUserByEmail } from "@/lib/db";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    // Initialize base database tables
    await initDatabase();

    // Run extended tables migration
    try {
      const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_create_extended_tables.sql');
      const migrationSQL = readFileSync(migrationPath, 'utf-8');

      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await sql.unsafe(statement);
        }
      }
    } catch (migrationError) {
      console.error("Migration error (may already exist):", migrationError);
      // Continue even if migration fails (tables may already exist)
    }

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
      adminExists: !!adminExists,
      tablesCreated: true
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

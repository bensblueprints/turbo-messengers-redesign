import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAllSettings, getSettingByKey, updateSetting, createSetting, SiteSetting } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const setting = await getSettingByKey(key);
      if (!setting) {
        return NextResponse.json({ error: "Setting not found" }, { status: 404 });
      }
      return NextResponse.json({ setting });
    }

    const settings = await getAllSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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

    const { setting_key, setting_value, setting_type, description } = await request.json();

    if (!setting_key || !setting_value) {
      return NextResponse.json(
        { error: "Setting key and value are required" },
        { status: 400 }
      );
    }

    const setting = await createSetting(setting_key, setting_value, setting_type || 'text', description);

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json({ error: "Failed to create setting" }, { status: 500 });
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

    const { setting_key, setting_value } = await request.json();

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json({ error: "Setting key and value are required" }, { status: 400 });
    }

    const setting = await updateSetting(setting_key, setting_value);

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

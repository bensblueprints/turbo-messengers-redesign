import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAllCounties, getCountyById, createCounty, updateCounty, deleteCounty, County } from "@/lib/db";

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
    const countyId = searchParams.get('id');

    if (countyId) {
      const county = await getCountyById(parseInt(countyId));
      if (!county) {
        return NextResponse.json({ error: "County not found" }, { status: 404 });
      }
      return NextResponse.json({ county });
    }

    const counties = await getAllCounties();
    return NextResponse.json({ counties });
  } catch (error) {
    console.error("Error fetching counties:", error);
    return NextResponse.json({ error: "Failed to fetch counties" }, { status: 500 });
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

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: "County name is required" },
        { status: 400 }
      );
    }

    const county = await createCounty(data as Partial<County>);

    return NextResponse.json({ success: true, county });
  } catch (error) {
    console.error("Error creating county:", error);
    return NextResponse.json({ error: "Failed to create county" }, { status: 500 });
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

    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "County ID is required" }, { status: 400 });
    }

    const county = await updateCounty(id, data as Partial<County>);

    if (!county) {
      return NextResponse.json({ error: "County not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, county });
  } catch (error) {
    console.error("Error updating county:", error);
    return NextResponse.json({ error: "Failed to update county" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "County ID is required" }, { status: 400 });
    }

    await deleteCounty(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting county:", error);
    return NextResponse.json({ error: "Failed to delete county" }, { status: 500 });
  }
}

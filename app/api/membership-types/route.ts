import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const membershipTypes = await prisma.membershipType.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    return NextResponse.json(membershipTypes);
  } catch (error) {
    console.error("Error fetching membership types:", error);
    return NextResponse.json(
      { error: "Failed to fetch membership types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, duration } = body;

    const membershipType = await prisma.membershipType.create({
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration)
      }
    });

    return NextResponse.json(membershipType);
  } catch (error) {
    console.error("Error creating membership type:", error);
    return NextResponse.json(
      { error: "Failed to create membership type" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, duration } = body;

    const membershipType = await prisma.membershipType.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration)
      }
    });

    return NextResponse.json(membershipType);
  } catch (error) {
    console.error("Error updating membership type:", error);
    return NextResponse.json(
      { error: "Failed to update membership type" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Membership type ID is required" },
        { status: 400 }
      );
    }

    await prisma.membershipType.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting membership type:", error);
    return NextResponse.json(
      { error: "Failed to delete membership type" },
      { status: 500 }
    );
  }
} 
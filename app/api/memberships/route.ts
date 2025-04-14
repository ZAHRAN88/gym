import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const memberships = await prisma.member.findMany({
      include: {
        membershipType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: "Failed to fetch memberships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, membershipTypeId, startDate, endDate } = body;

    const membership = await prisma.member.create({
      data: {
        name,
        email,
        membershipTypeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        qrCode: Math.random().toString(36).substring(2, 15), // Generate a random QR code
        status: "ACTIVE"
      },
      include: {
        membershipType: true
      }
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("Error creating membership:", error);
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, membershipTypeId, startDate, endDate, status } = body;

    const membership = await prisma.member.update({
      where: { id },
      data: {
        name,
        email,
        membershipTypeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status
      },
      include: {
        membershipType: true
      }
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json(
      { error: "Failed to update membership" },
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
        { error: "Membership ID is required" },
        { status: 400 }
      );
    }

    await prisma.member.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
} 
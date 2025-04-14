import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { memberId } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // Check if member exists and get their status
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        status: true,
        endDate: true,
        name: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Check if membership is active
    const currentDate = new Date();
    const membershipExpired = currentDate > new Date(member.endDate);
    
    if (member.status !== "ACTIVE" || membershipExpired) {
      return NextResponse.json(
        { 
          error: membershipExpired 
            ? `Membership expired on ${new Date(member.endDate).toLocaleDateString()}` 
            : "Membership is not active"
        },
        { status: 403 }
      );
    }

    // Create check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        memberId: memberId,
        timeIn: new Date(),
        timeOut: null,
      },
    });

    return NextResponse.json({
      message: `Check-in successful for ${member.name}`,
      checkIn,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
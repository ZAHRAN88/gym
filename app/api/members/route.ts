import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { addMonths } from "date-fns";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const members = await prisma.member.findMany({
      include: {
        membershipType: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("[MEMBERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, membershipTypeId, startDate, endDate } = body;

    // Get the membership type to calculate daily revenue
    const membershipType = await prisma.membershipType.findUnique({
      where: { id: membershipTypeId },
    });

    if (!membershipType) {
      return NextResponse.json(
        { error: "Membership type not found" },
        { status: 404 }
      );
    }

    // Calculate daily revenue (price divided by duration in days)
    const durationInDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const dailyRevenue = membershipType.price / durationInDays;

    // Create member and daily revenue in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const member = await tx.member.create({
        data: {
          name,
          email,
          membershipTypeId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          qrCode: Math.random().toString(36).substring(2, 15),
          status: "ACTIVE",
        },
        include: {
          membershipType: true,
        },
      });

      // Create daily revenue record
      await tx.dailyRevenue.create({
        data: {
          amount: dailyRevenue,
          memberId: member.id,
        },
      });

      return member;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
} 
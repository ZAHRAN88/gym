import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface MemberWithType {
  membershipType: {
    price: number;
    duration: number;
  };
}

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalMembers,
      activeMembers,
      checkInsToday,
      activeMembersWithTypes,
      todaysNewMembers,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({
        where: { status: "ACTIVE" },
      }),
      prisma.checkIn.count({
        where: {
          timeIn: {
            gte: today,
          },
        },
      }),
      prisma.member.findMany({
        where: { status: "ACTIVE" },
        include: {
          membershipType: true,
        },
      }),
      // Get members who registered today
      prisma.member.findMany({
        where: {
          createdAt: {
            gte: today,
          },
        },
        include: {
          membershipType: true,
        },
      }),
    ]);

    // Calculate total monthly revenue from active members' membership fees
    const monthlyRevenue = activeMembersWithTypes.reduce((total: number, member: MemberWithType) => {
      // For annual memberships, divide by 12 to get monthly fee
      const monthlyFee = member.membershipType.duration === 12 
        ? member.membershipType.price / 12 
        : member.membershipType.price;
      return total + monthlyFee;
    }, 0);

    // Calculate total revenue received today from new registrations
    const todayRevenue = todaysNewMembers.reduce((total: number, member: MemberWithType) => {
      // Add the full membership price (not monthly)
      return total + member.membershipType.price;
    }, 0);

    return NextResponse.json({
      totalMembers,
      activeMembers,
      checkInsToday,
      revenue: Math.round(monthlyRevenue * 100) / 100, // Round to 2 decimal places
      todayRevenue: Math.round(todayRevenue * 100) / 100, // Total money received today
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
} 
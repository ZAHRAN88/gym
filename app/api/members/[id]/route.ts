import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const member = await prisma.member.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    await prisma.member.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE_MEMBER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, email, status, membershipTypeId, endDate } = body;

    const member = await prisma.member.findUnique({
      where: { id: params.id },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const updatedMember = await prisma.member.update({
      where: { id: params.id },
      data: {
        name,
        email,
        status,
        membershipTypeId,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        membershipType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("[UPDATE_MEMBER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
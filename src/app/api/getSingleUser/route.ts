import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";

export const POST = async (req: Request) => {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 500 }
    );
  }

  try {
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (user) {
      const sectorId = user.sectorId;
      const sector = await prisma.sector.findUnique({
        where: {
          id: sectorId,
        },
      });
      return NextResponse.json({
        user,
        sector,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to receive data from the database", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

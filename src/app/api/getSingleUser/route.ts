import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";

export const POST = async (req: Request) => {
  const { name, sectorId } = await req.json();

  if (!name || !sectorId) {
    return NextResponse.json(
      { message: "name, sectorId is required" },
      { status: 500 }
    );
  }

  try {
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: {
        name: name.toString(),
        sectorId: sectorId.toString(),
      },
    });

    if (!user)
      return NextResponse.json(
        { message: "couldn't find user" },
        { status: 404 }
      );

    const sector = await prisma.sector.findUnique({
      where: {
        id: user.sectorId,
      },
    });

    if (!sector)
      return NextResponse.json(
        { message: "couldn't find sector" },
        { status: 404 }
      );

    return NextResponse.json({
      user,
      sector,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to receive data from the database", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

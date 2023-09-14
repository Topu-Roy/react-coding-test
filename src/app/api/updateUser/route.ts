import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";

export const PATCH = async (req: Request) => {
  const { userId, newName, newSectorId } = await req.json();

  if (!userId || !newName || !newSectorId)
    return NextResponse.json(
      { message: "All files are required" },
      { status: 500 }
    );

  try {
    await prisma.$connect();
    const targetedSector = await prisma.sector.findUnique({
      where: {
        id: newSectorId,
      },
    });

    if (!targetedSector) {
      return NextResponse.json(
        { message: "Invalid sector id" },
        { status: 404 }
      );
    }

    try {
      const { id, label } = targetedSector;
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: newName,
          sectorID: {
            connect: {
              id: id,
            },
          },
          sectorName: label,
        },
      });

      // * Returning the updated user
      return NextResponse.json({ updatedUser }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

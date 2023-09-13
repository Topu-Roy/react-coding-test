import { prisma } from "../../../../prisma/prismaClient";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, sectorId, acceptedTerms } = await req.json();

  if (!name || !sectorId || !acceptedTerms) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 500 }
    );
  }

  try {
    prisma.$connect();

    // * Verify the sector from the database
    const sectorFromDB = await prisma.sector.findUnique({
      where: {
        id: sectorId,
      },
    });

    //* Proceed if the fetch request was successful
    if (sectorFromDB) {
      await prisma.user.create({
        data: {
          name,
          acceptedTerms,
          sectorName: sectorFromDB.label,
          sectorID: {
            connect: {
              id: sectorId,
            },
          },
        },
      });

      return NextResponse.json(
        { message: "Successfully created user." },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Response is not ok" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Fetch to Database Failed" });
  } finally {
    prisma.$disconnect();
  }
};

import { prisma } from "../../../../prisma/prismaClient";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, sectorId, sector, acceptedTerms } = await req.json();

  if (!name || !sectorId || !acceptedTerms || !sector) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 500 }
    );
  }

  // return NextResponse.json({ name, sectorId, acceptedTerms });

  console.log(name, sectorId, acceptedTerms);

  try {
    await prisma.$connect();

    const selectedSector = await prisma.sector.findUnique({
      where: {
        id: sectorId,
      },
    });

    if (selectedSector) {
      await prisma.user.create({
        data: {
          name,
          acceptedTerms,
          sectorName: selectedSector?.label,
          sectorID: {
            connect: {
              id: sectorId,
            },
          },
        },
      });
    }

    console.log(name, sectorId, acceptedTerms);

    console.log("added successfully");
    return NextResponse.json({ message: "Added To Database" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Error adding to database" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

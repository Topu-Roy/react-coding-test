import { prisma } from "../../../../prisma/prismaClient";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { name, sectorId, acceptedTerms } = await req.json();

  if (!name || !sectorId || !acceptedTerms)
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 500 }
    );

  try {
    await prisma.$connect();
    await prisma.user.create({
      data: {
        name,
        acceptedTerms,
        sector: {
          connect: {
            id: sectorId,
          },
        },
      },
    });

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

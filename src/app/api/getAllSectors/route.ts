import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prismaClient";

export async function GET() {
  try {
    await prisma.$connect();

    // * Fetches fields that are specified
    const allSectors = await prisma.allSector.findMany({
      select: {
        label: true,
        value: true,
      },
    });
    console.log(allSectors);
    return NextResponse.json(allSectors, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    prisma.$disconnect();
  }
}

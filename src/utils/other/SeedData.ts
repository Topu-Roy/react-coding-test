// import { options } from "@/constants";
// import { prisma } from "../../prisma/prismaClient";
// import { NextResponse } from "next/server";

// export const POST = async (req: Request) => {
//     async function seedData() {
//       for (const { value, label } of options) {
//         await prisma.allSector.create({
//           data: {
//             value,
//             label,
//           },
//         });
//       }
//     }
//     try {
//       await prisma.$connect();
//       seedData();
//       return NextResponse.json(
//         { successMessage: "The data was sent successfully" },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         { successMessage: "Server error" },
//         { status: 500 }
//       );
//     } finally {
//       prisma.$disconnect();
//     }
//   };

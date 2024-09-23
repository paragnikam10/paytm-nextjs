import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(req: NextRequest) {
  const senderId = req.headers.get("x-user-id");
  const receiverId = req.nextUrl.searchParams.get("userId");

  if (!senderId || !receiverId) {
    return NextResponse.json(
      {
        error: "Invalid request parameters",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const transactions = await client.transaction.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(senderId),
            receiverId: parseInt(receiverId),
          },
          {
            senderId: parseInt(receiverId),
            receiverId: parseInt(senderId),
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        senderId: transaction.senderId,
        receiverId: transaction.receiverId,
        createdAt: transaction.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json(
      {
        error: " Error fetching transactions",
      },
      {
        status: 500,
      }
    );
  }
}

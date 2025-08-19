import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // get userId from middleware
    const userId = req.headers.get("x-user-id");
    console.log("userId from headers:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const account = await client.account.findFirst({
      where: {
        userId: parseInt(userId, 10),
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          message: "Account not found",
        },
        {
          status: 404,
        }
      );
    }
    console.log("balance", account.balance);
    return NextResponse.json({
      balance: account.balance,
      username: account.user.firstname,
      message: "Balance retrived successfully",
    });
  } catch (error) {
    console.error("Error fetching balance", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

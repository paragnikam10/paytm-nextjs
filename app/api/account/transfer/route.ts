import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log("transfer route");
  try {
    const senderId = req.headers.get("x-user-id");
    console.log("sender id", senderId);
    if (!senderId) {
      return NextResponse.json(
        {
          message: "User not authenticated",
        },
        {
          status: 401,
        }
      );
    }
    const { amount, to: receiverId } = await req.json();
    console.log("amount", amount);
    console.log("to", receiverId);
    if (!amount || !receiverId) {
      return NextResponse.json(
        {
          message: "Invalid request parameters",
        },
        { status: 400 }
      );
    }

    await client.$transaction(async (client) => {
      const account = await client.account.findFirst({
        where: { userId: parseInt(senderId) },
      });
      console.log("account", account);
      if (!account || account.balance < amount) {
        console.error("Insufficient balance");
        return NextResponse.json(
          {
            error: " Insufficien balance",
          },
          { status: 400 }
        );
      }

      const toAccount = await client.account.findFirst({
        where: { userId: parseInt(receiverId) },
      });
      console.log("to account", toAccount);
      if (!toAccount) {
        console.error("Invalid account");
        return NextResponse.json(
          {
            error: "Invalid account",
          },
          { status: 400 }
        );
      }

      await client.account.update({
        where: { id: account.id },
        data: { balance: { decrement: parseFloat(amount) } },
      });

      await client.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: parseFloat(amount) } },
      });

      await client.transaction.create({
        data: {
          amount: parseFloat(amount),
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
        },
      });
    });
    return NextResponse.json({
      message: "Transaction successful",
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json({ message: "Transaction error" }, { status: 400 });
  }
}

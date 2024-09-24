import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const client = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await client.user.create({
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        password: hashedPassword,
      },
    });
    await client.account.create({
      data: {
        userId: newUser.id,
        balance: 1 * Math.random() * 10000,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Data added to database");
    return NextResponse.json({
      message: "You are Signed Up successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error adding data to database", error);
    return Response.json(
      { message: "Error adding data to database" },
      { status: 500 }
    );
  }
}

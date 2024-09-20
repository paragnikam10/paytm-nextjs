import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    console.log("Received sign-in request:", body);

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await client.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    return NextResponse.json({
      message: "Signed in successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error signing in:", error);
    return NextResponse.json({ message: "Error signing in" }, { status: 500 });
  }
}

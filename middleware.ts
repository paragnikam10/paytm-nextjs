import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  console.log("Middleware executed");
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        message: "Invalid header",
      },
      {
        status: 403,
      }
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userId = payload.id as string;
    console.log("Decoded UserId:", userId);

    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    return response;
  } catch (error) {
    console.log("Token verification error", error);
    return NextResponse.json(
      {
        message: "Wrong token",
      },
      {
        status: 403,
      }
    );
  }
}

export const config = {
  matcher: [
    "/api/account/balance",
    "/api/user/users",
    "/api/account/transfer",
    "/api/account/transaction-history",
  ],
};

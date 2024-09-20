import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "";

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      {
        error: "userID is invalid",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: filter, mode: "insensitive" } },
          { lastname: { contains: filter, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      {
        error: "failed to fetch users",
      },
      { status: 500 }
    );
  }
}

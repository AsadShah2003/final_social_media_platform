import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {

    const { username, password } = await req.json();

    let hashedPassword: string = await bcrypt.hash(password, 10)

    const createUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword
      },
    });

    if (createUser) {
      return NextResponse.json({
        message: "User created!",
      });
    }
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({
    message: "Something went wrong!",
  });
}

import { connectToDB } from "@/app/lib/db";
import { generateUsername } from "@/app/lib/generateUsername";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await generateUsername("deep@xyz");
  console.log(res);
  try {
    await connectToDB();
    return NextResponse.json({ message: "✅ Database connected successfully" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "❌ Database connection failed" }, { status: 500 });
  }
}

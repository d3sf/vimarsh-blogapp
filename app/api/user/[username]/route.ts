import { connectToDB } from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { NextResponse } from "next/server";

// Since this is a dynamic route ([username]), we need to ensure params is properly handled
export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> } // Update the type definition
) {
  try {
    await connectToDB();
    const { username } = await context.params; // Await the params Promise
    // @ts-expect-error
    const user = await User.findOne({ username }).select("-password"); // Exclude password

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

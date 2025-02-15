import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/app/lib/db";
import User from "@/app/lib/models/user";


//updates user profile Image 

export async function PUT(req: NextRequest) {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    try {
        const { image } = await req.json();
        //@ts-expect-error
        await User.findOneAndUpdate({ email: session.user.email }, { image });

        return NextResponse.json({ message: "Profile Image updated successfully" });
    } catch (error) {
        console.error("Profile Image update failed:", error);
        return NextResponse.json({ error: "Profile  Image update failed" }, { status: 500 });
    }
}

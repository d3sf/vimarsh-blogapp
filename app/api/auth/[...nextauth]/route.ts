import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDB } from "@/app/lib/db";
import User from "@/app/lib/models/user";
import bcrypt from "bcryptjs";
import { generateUsername } from "@/app/lib/generateUsername";


export const authOptions: NextAuthOptions = {
  providers: [

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        //@ts-expect-error

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) {
          throw new Error("User not found !");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
        // or user.password = undefined;
        // return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as "jwt",
  },
  pages: {
    signIn: "/signin", // custom signin page
  },
  callbacks: {
    async signIn({ user, account }: { user: any, account: any }) {
      {
        if (account?.provider == "google") {
          await connectToDB();


          //check if the user exists
          //@ts-expect-error
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // create and save user


            const cloudinaryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploadimage`, {
              method: "POST",
              body: JSON.stringify({
                image: user.image, // Google profile image URL
                folder: "blogs/profile_pictures",
              }),
              headers: { "Content-Type": "application/json" },
            });
            
            // console.log("Cloudinary Response Status:", cloudinaryResponse.status);
            // console.log("Cloudinary Response Headers:", cloudinaryResponse.headers);
            const { url: cloudinaryUrl } = await cloudinaryResponse.json();
            // console.log("Cloudinary Response Data:", cloudinaryUrl);
            // console.log("Full Cloudinary Response:", cloudinaryUrl?.fullResponse);

            const username = await generateUsername(user.email);
            existingUser = new User({
              name: user.name,
              email: user.email,
              image: cloudinaryUrl,
              password: "",//no password for google users
              username: username,
            })
            
            await existingUser.save();
          }
          
          user.id = existingUser.id; // Ensure NextAuth session gets user ID
          user.image = existingUser.image; // Set correct image URL for session
        }
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // ✅ Ensure username is set
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;

      return session;
    },

    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   if(url === baseUrl || url.startsWith("/api/auth")) {
    //     return baseUrl;
    //   }
    //   return "/blogs";
    // },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`; // Convert relative to absolute URL
      if (url === baseUrl || url.startsWith("/api/auth")) return baseUrl; // Handle auth routes properly
      return `${baseUrl}/`; // Ensure correct redirection
    }

  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

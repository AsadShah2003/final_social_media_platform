import { prisma } from "@/prisma/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

const handler = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {

        const findAcc = await prisma.users.findFirst({
          where: {
            username: credentials?.username,
          },
        });
        const checkPassword = await bcrypt.compare(credentials?.password!, findAcc?.password!)

        if (findAcc && checkPassword) {
          return {
            id: findAcc.id,
            username: findAcc.username,
            profileImage: findAcc.profileImage
          } as any;
        }
        return null;
      },
    }),
  ],
  // CALLBACKS
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      session.user = {
        username: token.username as string,
        id: token.id as number,
        profileImage: token.profileImage as string
        // Include token if needed for further authorization checks
        // token: token.token,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      id?: number;
      token?: string;
      profileImage?: string | null;
    };
  }
}

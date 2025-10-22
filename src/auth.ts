import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getUserById } from "../data/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  // there is time for logout automatic
  session: { strategy: "jwt", maxAge: 60 * 5 },
  ...authConfig,
  callbacks: {
    async signIn({ user }) {
      // Allow all users to sign in
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.name && session.user) {
        (session.user as any).name = token.name;
      }
      if (token.username && session.user) {
        (session.user as any).username = token.username;
      }
      if (token.email && session.user) {
        session.user.email = token.email;
      }
      if (token.role && session.user) {
        (session.user as any).role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      token.id = existingUser.id;
      token.email = existingUser.email; // Add email to the token
      token.name = existingUser.name; // Add name to the token
      token.role = existingUser.role;

      return token;
    },
  },
});

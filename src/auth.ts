import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "../data/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 5 },
  ...authConfig,
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.name && session.user) (session.user as any).name = token.name;
      if (token.email && session.user) session.user.email = token.email;
      if (token.role && session.user) (session.user as any).role = token.role;

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.id = existingUser.id;
      token.email = existingUser.email;
      token.name = existingUser.name;
      token.role = existingUser.role;

      return token;
    },
  },
});

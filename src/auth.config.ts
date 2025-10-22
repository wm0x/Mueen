import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "../data/user";
import bcrypt from "bcryptjs";
import { LoginUser } from "../schema/Authentication";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginUser.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);

        if (!user || !user.password_hash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (passwordMatch) {
          return {
            id: user.id,
            name: user.name ?? "",
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

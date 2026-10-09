import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Mock Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "demo" && credentials?.password === "demo") {
          return { id: "1", name: "Demo User", email: "demo@example.com" };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "super-secret-123",
};

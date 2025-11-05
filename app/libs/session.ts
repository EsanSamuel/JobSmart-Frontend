import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./axios";
import axios from "axios";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("No credentials found");
          return null;
        }

        try {
          const response = await api.post("/api/v1/users/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data.data;

          return {
            id: data.id.toString(),
            name: data.username,
            email: data.email,
            image: data.profileImage,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Login failed:",
              error.response?.data?.message || error.message
            );
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        console.error("No email found");
        return false;
      }

      if (account?.provider === "google") {
        try {
          await api.post("/api/v1/users/google-oauth", {
            username: user.name,
            email: user.email,
            image: user.image,
            role: "USER",
          });
          console.log("Google OAuth successful");
          return true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              "Google OAuth failed:",
              error.response?.data?.message || error.message
            );
          } else {
            console.error("Google OAuth error:", error);
          }
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      if (account?.provider === "google" && profile) {
        try {
          const response = await api.post("/api/v1/users/google-oauth", {
            username: profile.name,
            email: profile.email,
            image: profile.image,
            role: "USER",
          });

          const data = response.data.data;

          token.id = data.id.toString();
          token.email = data.email;
          token.name = data.username;
          token.picture = data.profileImage;
        } catch (error) {
          console.error("Failed to get user from backend:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

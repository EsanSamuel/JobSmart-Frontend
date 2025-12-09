import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwt from "jsonwebtoken";
import { user } from "@/types";

const BACKEND_URL = "https://jobsmart-backend.onrender.com";

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
          const response = await axios.post(
            `${BACKEND_URL}/api/v1/users/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

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
          await axios.post(`${BACKEND_URL}/api/v1/users/google-oauth`, {
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

        token.accessToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );
      }

      if (account?.provider === "google" && profile) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/v1/users/google-oauth`,
            {
              username: profile.name,
              email: profile.email,
              image: profile.image,
              role: "USER",
            }
          );

          const data = response.data.data as user;

          token.id = data.id.toString();
          token.email = data.email;
          token.name = data.username;
          token.picture = data.profileImage;

          token.accessToken = jwt.sign(
            {
              id: data.id.toString(),
              email: data.email,
              name: data.username,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
          );
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
        session.user.accessToken = token.accessToken as string;
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

export default async function getSession() {
  return await getServerSession(authOptions);
}

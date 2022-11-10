import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../prisma/prisma";

// export default NextAuth({
//   // adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: String(process.env.NEXT_PUBLIC_CLIENT_ID),
//       clientSecret: String(process.env.NEXT_PUBLIC_CLIENT_SECRET),
//       authorization: {
//         params: {
//           scope:
//             "openid email profile https://www.googleapis.com/auth/calendar",
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       session.user.id = token.id;
//       session.user.refreshToken = token.refreshToken;
//       session.accesstoken = token.accessToken;
//       return session;
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       if (user) {
//         token.id = user.id;
//       }
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//       }
//       return token;
//     },
//   },
// });

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: String(process.env.NEXT_PUBLIC_CLIENT_ID),
      clientSecret: String(process.env.NEXT_PUBLIC_CLIENT_SECRET),
      authorization: {
        params: {
          scope: "openid   https://www.googleapis.com/auth/calendar",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.user.refreshToken = token.refreshToken;
      session.accesstoken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
});

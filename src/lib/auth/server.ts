import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { sendPasswordResetEmail, sendVerificationEmail } from "./sendMail";
import { captcha } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    }),
  ],
  user: {
    deleteUser: { enabled: true },
    changeEmail: { enabled: true },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Send an email to the user with a link to reset their password
      await sendPasswordResetEmail({
        to: user.email,
        url: url,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Send an email to the user with a link to verify their email
      await sendVerificationEmail({
        to: user.email,
        url: url,
      });
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    }
  },
  // migrate from next-auth
  session: {
    fields: {
      expiresAt: "expires", // Map your existing `expires` field to Better Auth's `expiresAt`
      token: "sessionToken" // Map your existing `sessionToken` field to Better Auth's `token`
    }
  },
  account: {
    fields: {
      accountId: "providerAccountId",
      refreshToken: "refresh_token",
      accessToken: "access_token",
      accessTokenExpiresAt: "access_token_expires",
      idToken: "id_token",
    }
  },
});
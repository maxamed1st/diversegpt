import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { accounts, users, personas, } from "@/db/schema"
import Resend from "next-auth/providers/resend"
import Discord from "next-auth/providers/discord"
import defaultPersonas from "@/utils/defaultPersonas"
import setupStripeCustomerAndSubscription from "@/utils/setupStripeCustomerAndSubscription"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [
    Resend({
      from: "DiverseGPT <no-reply@diversegpt.pro>",
    }),
    Discord,
  ],
  events: {
    async createUser({ user }) {
      try {
        const initialPersonas = defaultPersonas(user);
        await db.insert(personas).values(initialPersonas);
      } catch (error) {
        console.error('Error creating default personas:', error);
      }
      await setupStripeCustomerAndSubscription(user.id as string, user.email as string);
    }
  },
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl + '/chat/new'
    },
    async session({ session, user }) {
      if (session?.user) {
        const personasTable = await db.query.personas.findMany({
          where: eq(personas.userId, user.id as string),
        });
        return {
          ...session,
          personas: personasTable
        }
      }
      return session;
    }
  }
})

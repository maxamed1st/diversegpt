import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { accounts, users, personas, } from "@/db/schema"
import Resend from "next-auth/providers/resend"
import Discord from "next-auth/providers/discord"
import defaultPersonas from "@/utils/defaultPersonas"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [
    Resend({
      from: "FocusGPT <no-reply@walaalka.site>",
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
    }
  },
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl + '/chat'
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

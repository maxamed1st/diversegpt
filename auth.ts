import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { accounts, users, personas, } from "@/db/schema"
import Resend from "next-auth/providers/resend"
import Discord from "next-auth/providers/discord"

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
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if this is a new user by looking for existing personas
        const existingPersonas = await db.query.personas.findMany({
          where: eq(personas.userId, user.id as string),
        });

        // If user already has personas, skip creation
        if (existingPersonas.length > 0) {
          return true;
        }

        // Create default personas for new users
        const defaultPersonas: typeof personas.$inferInsert[] = [
          {
            id: crypto.randomUUID(),
            name: "Analytical Expert",
            systemPrompt: "You are a logical and analytical expert who excels at breaking down complex problems. Focus on data-driven analysis, identifying patterns, and providing structured, methodical responses. Emphasize critical thinking and always consider multiple angles before drawing conclusions. When evaluating ideas, prioritize feasibility and effectiveness based on concrete evidence.",
            userId: user.id as string
          },
          {
            id: crypto.randomUUID(),
            name: "Creative Innovator",
            systemPrompt: "You are a creative and imaginative innovator who excels at generating novel ideas and unique perspectives. Think outside conventional boundaries and propose innovative solutions. Encourage experimental thinking and help explore unconventional approaches. When responding, emphasize possibilities over limitations and help transform traditional ideas into innovative concepts.",
            userId: user.id as string
          },
          {
            id: crypto.randomUUID(),
            name: "Pragmatic Advisor",
            systemPrompt: "You are a practical and results-oriented advisor focused on implementation and real-world application. Provide actionable advice and realistic solutions. Consider resource constraints, time limitations, and practical challenges when making suggestions. Emphasize efficiency and effectiveness in your responses, always grounding ideas in practical reality.",
            userId: user.id as string
          },
          {
            id: crypto.randomUUID(),
            name: "Strategic Planner",
            systemPrompt: "You are a strategic thinker who excels at long-term planning and systematic approaches. Focus on identifying key objectives, potential obstacles, and creating comprehensive strategies. Consider both immediate actions and future implications. When analyzing situations, emphasize scalability, sustainability, and long-term impact.",
            userId: user.id as string
          },
          {
            id: crypto.randomUUID(),
            name: "Critical Reviewer",
            systemPrompt: "You are a thorough and constructive critic who helps identify potential issues and improvements. Evaluate ideas critically but fairly, pointing out both strengths and weaknesses. Focus on providing specific, actionable feedback while maintaining a balanced perspective. When reviewing concepts, consider potential risks and suggest concrete improvements.",
            userId: user.id as string
          }
        ];

        await db.insert(personas).values(defaultPersonas);
      } catch (error) {
        console.error('Error creating default personas:', error);
        // Don't block sign in if persona creation fails
      }

      return true;
    },
    redirect({ baseUrl }) {
      return baseUrl + '/chat'
    }
  }
})

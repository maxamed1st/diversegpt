import { relations, sql } from "drizzle-orm"
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripeCustomerId").unique(),
  subscriptionStatus: text("subscriptionStatus").default('inactive'),
  subscriptionId: text("subscriptionId").unique(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const personas = pgTable("persona", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  systemPrompt: text("systemPrompt").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const chat = pgTable("chat", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const chatPersona = pgTable("chat_persona", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  personaId: text("personaId")
    .notNull()
    .references(() => personas.id, { onDelete: "cascade" }),
})

export const message = pgTable("message", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  fromUserId: text("fromUserId")
    .references(() => users.id, { onDelete: "cascade" }),
  fromPersonaId: text("fromPersonaId")
    .references(() => personas.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (message) => ({
  messageUserIdx: index('message_user_idx').on(message.chatId, message.fromUserId),
  messagePersonaIdx: index('message_persona_idx').on(message.chatId, message.fromPersonaId),
  messageCreateAtIdx: index('message_created_at_idx').on(message.createdAt),
  messageCheckConstraint: sql`CHECK (
      (fromUserId IS NOT NULL AND fromPersonaId IS NULL) OR 
      (fromUserId IS NULL AND fromPersonaId IS NOT NULL)
    )`,
}))

//user has many personas
export const userRelations = relations(users, ({ many }) => ({
  personas: many(personas),
}))

//persona belongs to user
export const personaRelations = relations(personas, ({ one, many }) => ({
  user: one(users, {
    fields: [personas.userId],
    references: [users.id],
  }),
  chats: many(chatPersona),
}))

// Chat relations
export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(users, {
    fields: [chat.userId],
    references: [users.id],
  }),
  personas: many(chatPersona),
  messages: many(message),
}))

// ChatPersona relations
export const chatPersonaRelations = relations(chatPersona, ({ one }) => ({
  chat: one(chat, {
    fields: [chatPersona.chatId],
    references: [chat.id],
  }),
  persona: one(personas, {
    fields: [chatPersona.personaId],
    references: [personas.id],
  }),
}))

// Message relations
export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
  fromUser: one(users, {
    fields: [message.fromUserId],
    references: [users.id],
  }),
  fromPersona: one(personas, {
    fields: [message.fromPersonaId],
    references: [personas.id],
  }),
}))

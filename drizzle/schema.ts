import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, index, unique } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * DESTINY HACKING DATABASE SCHEMA
 * 
 * This schema implements a complete data model for the Destiny Hacking PWA.
 * It supports emotional calibration, daily will cycles, social accountability,
 * and AI-powered insights while maintaining offline-first capabilities.
 * 
 * Design principles:
 * - User data ownership (all tables link to users.id)
 * - Time-based state tracking for pattern analysis
 * - Flexible JSON fields for future expansion
 * - Optimized for both offline sync and real-time queries
 */

// ============================================================================
// CORE USER TABLE
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // User preferences and settings
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  dailyReminderTime: varchar("dailyReminderTime", { length: 5 }), // HH:MM format
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// EMOTIONAL SLIDERS SYSTEM
// ============================================================================

/**
 * Emotional Axes define the bipolar dimensions users can calibrate.
 * Each axis has two opposing poles (e.g., Fear ← → Courage).
 * Users can create custom axes for different life contexts.
 */
export const emotionalAxes = mysqlTable("emotional_axes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Axis definition
  leftLabel: varchar("leftLabel", { length: 50 }).notNull(), // e.g., "Fear"
  rightLabel: varchar("rightLabel", { length: 50 }).notNull(), // e.g., "Courage"
  contextTag: varchar("contextTag", { length: 50 }), // e.g., "work", "relationships", "conflict"
  
  // Display and ordering
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true).notNull(),
  
  // Metadata for future features
  color: varchar("color", { length: 7 }), // Hex color for UI customization
  description: text("description"), // Optional explanation of what this axis measures
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("emotional_axes_user_id_idx").on(table.userId),
}));

export type EmotionalAxis = typeof emotionalAxes.$inferSelect;
export type InsertEmotionalAxis = typeof emotionalAxes.$inferInsert;

/**
 * Slider States capture the time-series data of emotional calibrations.
 * This is the core data structure for pattern analysis and insights.
 * 
 * Design notes:
 * - Stores raw 0-100 value for each axis at a specific moment
 * - Links to daily cycles for structured tracking
 * - Supports both manual calibrations and check-ins
 * - Optimized for offline-first with clientTimestamp
 */
export const sliderStates = mysqlTable("slider_states", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  axisId: int("axisId").notNull().references(() => emotionalAxes.id, { onDelete: "cascade" }),
  dailyCycleId: int("dailyCycleId").references(() => dailyCycles.id, { onDelete: "set null" }),
  
  // Calibration data
  value: int("value").notNull(), // 0-100 range
  
  // Temporal tracking
  clientTimestamp: timestamp("clientTimestamp").notNull(), // When user made the calibration
  serverTimestamp: timestamp("serverTimestamp").defaultNow().notNull(), // When it synced
  
  // Context and metadata
  calibrationType: mysqlEnum("calibrationType", ["morning", "midday", "evening", "manual"]).notNull(),
  note: text("note"), // Optional user reflection
  
  // Sync management for offline-first
  syncStatus: mysqlEnum("syncStatus", ["synced", "pending", "conflict"]).default("synced").notNull(),
  clientId: varchar("clientId", { length: 64 }), // For conflict resolution
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("slider_states_user_id_idx").on(table.userId),
  axisIdIdx: index("slider_states_axis_id_idx").on(table.axisId),
  dailyCycleIdIdx: index("slider_states_daily_cycle_id_idx").on(table.dailyCycleId),
  clientTimestampIdx: index("slider_states_client_timestamp_idx").on(table.clientTimestamp),
}));

export type SliderState = typeof sliderStates.$inferSelect;
export type InsertSliderState = typeof sliderStates.$inferInsert;

// ============================================================================
// DAILY WILL CYCLE
// ============================================================================

/**
 * Daily Cycles structure the user's intentional practice.
 * Each day consists of:
 * 1. Morning calibration (set emotional state)
 * 2. Decisive prompt (one action to take)
 * 3. Evening reflection (cause-effect mapping)
 * 
 * This is NOT a journal—it's a command interface for conscious will.
 */
export const dailyCycles = mysqlTable("daily_cycles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Date tracking (stored as YYYY-MM-DD for easy querying)
  cycleDate: varchar("cycleDate", { length: 10 }).notNull(), // e.g., "2025-12-20"
  
  // Morning: Calibration (linked via sliderStates.dailyCycleId)
  morningCompletedAt: timestamp("morningCompletedAt"),
  
  // Midday: Decisive Prompt & Action
  decisivePrompt: text("decisivePrompt"), // AI-generated or user-selected prompt
  intendedAction: text("intendedAction"), // What the user commits to doing
  middayCompletedAt: timestamp("middayCompletedAt"),
  
  // Evening: Reflection & Cause-Effect Mapping
  actionTaken: text("actionTaken"), // What actually happened
  observedEffect: text("observedEffect"), // What changed as a result
  reflection: text("reflection"), // Short user reflection
  eveningCompletedAt: timestamp("eveningCompletedAt"),
  
  // Completion tracking
  isComplete: boolean("isComplete").default(false).notNull(),
  
  // AI insights (generated after evening reflection)
  aiInsightId: int("aiInsightId").references(() => insights.id, { onDelete: "set null" }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("daily_cycles_user_id_idx").on(table.userId),
  cycleDateIdx: index("daily_cycles_cycle_date_idx").on(table.cycleDate),
  userDateUnique: unique("daily_cycles_user_date_unique").on(table.userId, table.cycleDate),
}));

export type DailyCycle = typeof dailyCycles.$inferSelect;
export type InsertDailyCycle = typeof dailyCycles.$inferInsert;

// ============================================================================
// AI INSIGHTS & CAUSE-EFFECT ANALYSIS
// ============================================================================

/**
 * Insights are AI-generated summaries of patterns, cause-effect relationships,
 * and strategic observations. These are NOT therapy—they are Stoic strategist
 * reflections that frame responsibility as power.
 */
export const insights = mysqlTable("insights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Insight metadata
  insightType: mysqlEnum("insightType", ["daily", "weekly", "pattern", "cause_effect"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(), // AI-generated insight
  
  // Time range this insight covers
  startDate: varchar("startDate", { length: 10 }),
  endDate: varchar("endDate", { length: 10 }),
  
  // Pattern data (JSON for flexibility)
  patternData: json("patternData"), // e.g., { "axis": "courage", "trend": "increasing", "correlation": [...] }
  
  // User interaction
  isRead: boolean("isRead").default(false).notNull(),
  userRating: int("userRating"), // 1-5 rating of insight usefulness
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("insights_user_id_idx").on(table.userId),
  insightTypeIdx: index("insights_insight_type_idx").on(table.insightType),
  createdAtIdx: index("insights_created_at_idx").on(table.createdAt),
}));

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = typeof insights.$inferInsert;

// ============================================================================
// INNER CIRCLE (CONTROLLED SOCIAL)
// ============================================================================

/**
 * Connections represent invite-only relationships between users.
 * This is NOT social media—it's mutual accountability.
 * Users share states (slider calibrations), not content (posts/likes).
 */
export const connections = mysqlTable("connections", {
  id: int("id").autoincrement().primaryKey(),
  
  // Bidirectional relationship
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  connectedUserId: int("connectedUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Connection lifecycle
  status: mysqlEnum("status", ["pending", "accepted", "declined", "blocked"]).default("pending").notNull(),
  invitedBy: int("invitedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Sharing preferences
  shareSliderStates: boolean("shareSliderStates").default(true).notNull(),
  shareDailyCycles: boolean("shareDailyCycles").default(false).notNull(),
  
  // Timestamps
  invitedAt: timestamp("invitedAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("connections_user_id_idx").on(table.userId),
  connectedUserIdIdx: index("connections_connected_user_id_idx").on(table.connectedUserId),
  statusIdx: index("connections_status_idx").on(table.status),
  // Prevent duplicate connections
  uniqueConnection: unique("connections_unique").on(table.userId, table.connectedUserId),
}));

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = typeof connections.$inferInsert;

/**
 * Group Sessions orchestrate collective challenges with defined start/end dates.
 * Examples: "30-Day Courage Challenge", "Weekly Stoic Practice Group"
 */
export const groupSessions = mysqlTable("group_sessions", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Session definition
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  challengeType: varchar("challengeType", { length: 50 }), // e.g., "axis_focus", "daily_consistency"
  
  // Time boundaries
  startDate: varchar("startDate", { length: 10 }).notNull(),
  endDate: varchar("endDate", { length: 10 }).notNull(),
  
  // Challenge parameters (flexible JSON structure)
  challengeParams: json("challengeParams"), // e.g., { "targetAxis": "courage", "minDailyCalibrations": 3 }
  
  // Visibility and access
  isPrivate: boolean("isPrivate").default(true).notNull(),
  maxParticipants: int("maxParticipants"),
  
  // Status
  status: mysqlEnum("status", ["upcoming", "active", "completed", "cancelled"]).default("upcoming").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  creatorIdIdx: index("group_sessions_creator_id_idx").on(table.creatorId),
  statusIdx: index("group_sessions_status_idx").on(table.status),
  startDateIdx: index("group_sessions_start_date_idx").on(table.startDate),
}));

export type GroupSession = typeof groupSessions.$inferSelect;
export type InsertGroupSession = typeof groupSessions.$inferInsert;

/**
 * Group Participants link users to group sessions and track their progress.
 */
export const groupParticipants = mysqlTable("group_participants", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => groupSessions.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Participation tracking
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["active", "completed", "dropped"]).default("active").notNull(),
  
  // Progress metrics (JSON for flexibility based on challenge type)
  progressData: json("progressData"), // e.g., { "daysCompleted": 15, "currentStreak": 7 }
  
  // Completion
  completedAt: timestamp("completedAt"),
  
}, (table) => ({
  sessionIdIdx: index("group_participants_session_id_idx").on(table.sessionId),
  userIdIdx: index("group_participants_user_id_idx").on(table.userId),
  uniqueParticipant: unique("group_participants_unique").on(table.sessionId, table.userId),
}));

export type GroupParticipant = typeof groupParticipants.$inferSelect;
export type InsertGroupParticipant = typeof groupParticipants.$inferInsert;

// ============================================================================
// DRIZZLE RELATIONS (for easier querying)
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  emotionalAxes: many(emotionalAxes),
  sliderStates: many(sliderStates),
  dailyCycles: many(dailyCycles),
  insights: many(insights),
  connections: many(connections),
  groupSessions: many(groupSessions),
  groupParticipants: many(groupParticipants),
}));

export const emotionalAxesRelations = relations(emotionalAxes, ({ one, many }) => ({
  user: one(users, {
    fields: [emotionalAxes.userId],
    references: [users.id],
  }),
  sliderStates: many(sliderStates),
}));

export const sliderStatesRelations = relations(sliderStates, ({ one }) => ({
  user: one(users, {
    fields: [sliderStates.userId],
    references: [users.id],
  }),
  axis: one(emotionalAxes, {
    fields: [sliderStates.axisId],
    references: [emotionalAxes.id],
  }),
  dailyCycle: one(dailyCycles, {
    fields: [sliderStates.dailyCycleId],
    references: [dailyCycles.id],
  }),
}));

export const dailyCyclesRelations = relations(dailyCycles, ({ one, many }) => ({
  user: one(users, {
    fields: [dailyCycles.userId],
    references: [users.id],
  }),
  sliderStates: many(sliderStates),
  aiInsight: one(insights, {
    fields: [dailyCycles.aiInsightId],
    references: [insights.id],
  }),
}));

export const insightsRelations = relations(insights, ({ one }) => ({
  user: one(users, {
    fields: [insights.userId],
    references: [users.id],
  }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
  }),
  connectedUser: one(users, {
    fields: [connections.connectedUserId],
    references: [users.id],
  }),
}));

export const groupSessionsRelations = relations(groupSessions, ({ one, many }) => ({
  creator: one(users, {
    fields: [groupSessions.creatorId],
    references: [users.id],
  }),
  participants: many(groupParticipants),
}));

export const groupParticipantsRelations = relations(groupParticipants, ({ one }) => ({
  session: one(groupSessions, {
    fields: [groupParticipants.sessionId],
    references: [groupSessions.id],
  }),
  user: one(users, {
    fields: [groupParticipants.userId],
    references: [users.id],
  }),
}));

# Destiny Hacking - System Architecture

**Version:** 1.0.0  
**Last Updated:** December 20, 2025  
**Author:** Manus AI

---

## Executive Summary

Destiny Hacking is a Progressive Web App (PWA) that operationalizes the philosophy of conscious will through emotional calibration, daily practice, and AI-powered insights. The architecture prioritizes offline-first functionality, data integrity, user privacy, and a clear migration path to React Native.

This document describes the complete system architecture, including frontend structure, backend services, database design, offline sync strategy, and AI integration.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React PWA  │  │Service Worker│  │ IndexedDB    │         │
│  │  (TypeScript)│◄─┤  (Offline)   │◄─┤ (Local State)│         │
│  └──────┬───────┘  └──────────────┘  └──────────────┘         │
└─────────┼────────────────────────────────────────────────────────┘
          │
          │ tRPC (Type-safe API)
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                      APPLICATION SERVER LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Express.js   │  │  tRPC Router │  │  Auth Module │          │
│  │   Server     │◄─┤  (Procedures)│◄─┤ (Supabase)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
└─────────┼──────────────────┼──────────────────────────────────────┘
          │                  │
          │                  │
┌─────────▼──────────────────▼──────────────────────────────────────┐
│                       DATA & SERVICES LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │   LLM API    │  │  Background  │           │
│  │  (Supabase)  │  │ (AI Coach)   │  │    Jobs      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture (PWA)

### Technology Stack

**Core Framework:**
- React 19 with TypeScript
- Wouter (lightweight routing)
- Zustand (state management, React Native compatible)

**UI Layer:**
- Tailwind CSS 4
- shadcn/ui components
- Framer Motion (slider physics)
- Web Animations API

**Offline-First:**
- Service Workers (Workbox)
- IndexedDB (local state persistence)
- Background Sync API

### Component Structure

```
client/src/
├── pages/
│   ├── Home.tsx                    # Landing page
│   ├── Dashboard.tsx               # Main control panel
│   ├── EmotionalSliders.tsx        # Slider calibration interface
│   ├── DailyCycle.tsx              # Daily practice workflow
│   └── InnerCircle.tsx             # Social accountability
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── SliderControl.tsx           # Individual slider component
│   ├── DailyPrompt.tsx             # AI-generated prompt display
│   ├── StateVisualization.tsx      # Emotional state charts
│   └── ConnectionCard.tsx          # Inner circle member display
├── lib/
│   ├── trpc.ts                     # tRPC client
│   ├── offline.ts                  # Offline sync logic
│   └── sliderPhysics.ts            # Slider interaction physics
├── hooks/
│   ├── useSliderState.ts           # Slider state management
│   ├── useDailyCycle.ts            # Daily cycle workflow
│   └── useOfflineSync.ts           # Sync status and queue
└── stores/
    ├── sliderStore.ts              # Zustand store for sliders
    └── syncStore.ts                # Zustand store for sync queue
```

### Offline-First Strategy

**Local State Management:**

1. **IndexedDB Schema:**
   ```typescript
   {
     sliderStates: {
       keyPath: 'id',
       indexes: ['clientTimestamp', 'syncStatus']
     },
     dailyCycles: {
       keyPath: 'id',
       indexes: ['cycleDate', 'syncStatus']
     },
     syncQueue: {
       keyPath: 'id',
       indexes: ['timestamp', 'operation']
     }
   }
   ```

2. **Sync Queue Operations:**
   - All mutations are immediately written to IndexedDB
   - Sync queue tracks pending operations (CREATE, UPDATE, DELETE)
   - Background sync attempts to push to server when online
   - Conflict resolution uses "last-write-wins" with clientTimestamp

3. **Service Worker Caching:**
   ```typescript
   // Cache strategy
   - App shell: Cache-first (HTML, CSS, JS)
   - API calls: Network-first with fallback to cache
   - Static assets: Cache-first with stale-while-revalidate
   ```

**Sync Flow:**

```
User Action
    ↓
Write to IndexedDB (immediate)
    ↓
Update UI (optimistic)
    ↓
Add to Sync Queue
    ↓
[Online?] → YES → Push to Server → Mark as Synced
    ↓
    NO → Wait for connection → Background Sync
```

---

## Backend Architecture

### Technology Stack

**Server:**
- Node.js with Express
- tRPC 11 (type-safe API)
- Drizzle ORM (database queries)

**Database:**
- PostgreSQL (via Supabase)
- Row-Level Security (RLS) enabled
- Automatic timestamps and soft deletes

**Authentication:**
- Supabase Auth (OAuth flow)
- JWT session cookies
- Protected procedures with user context

### tRPC Router Structure

```typescript
appRouter = {
  auth: {
    me: publicProcedure,
    logout: publicProcedure,
  },
  
  sliders: {
    listAxes: protectedProcedure,
    createAxis: protectedProcedure,
    updateAxis: protectedProcedure,
    deleteAxis: protectedProcedure,
    recordState: protectedProcedure,
    getStateHistory: protectedProcedure,
  },
  
  dailyCycle: {
    getToday: protectedProcedure,
    startMorning: protectedProcedure,
    completeMidday: protectedProcedure,
    completeEvening: protectedProcedure,
    getHistory: protectedProcedure,
  },
  
  insights: {
    list: protectedProcedure,
    generate: protectedProcedure,
    rate: protectedProcedure,
  },
  
  innerCircle: {
    listConnections: protectedProcedure,
    invite: protectedProcedure,
    acceptInvite: protectedProcedure,
    shareState: protectedProcedure,
  },
  
  groupSessions: {
    list: protectedProcedure,
    create: protectedProcedure,
    join: protectedProcedure,
    getProgress: protectedProcedure,
  },
  
  aiCoach: {
    generatePrompt: protectedProcedure,
    analyzePattern: protectedProcedure,
    reflectOnCycle: protectedProcedure,
  },
}
```

### Database Query Helpers

All database operations are abstracted into helper functions in `server/db.ts`:

```typescript
// Emotional Sliders
export async function getUserAxes(userId: number): Promise<EmotionalAxis[]>
export async function createAxis(data: InsertEmotionalAxis): Promise<EmotionalAxis>
export async function recordSliderState(data: InsertSliderState): Promise<SliderState>
export async function getStateHistory(userId: number, axisId: number, days: number): Promise<SliderState[]>

// Daily Cycles
export async function getTodayCycle(userId: number, date: string): Promise<DailyCycle | null>
export async function createDailyCycle(data: InsertDailyCycle): Promise<DailyCycle>
export async function updateDailyCycle(id: number, data: Partial<DailyCycle>): Promise<void>

// Insights
export async function createInsight(data: InsertInsight): Promise<Insight>
export async function getUserInsights(userId: number, limit: number): Promise<Insight[]>

// Inner Circle
export async function getConnections(userId: number): Promise<Connection[]>
export async function createConnection(data: InsertConnection): Promise<Connection>
export async function updateConnectionStatus(id: number, status: string): Promise<void>

// Group Sessions
export async function getActiveSessions(userId: number): Promise<GroupSession[]>
export async function createSession(data: InsertGroupSession): Promise<GroupSession>
export async function joinSession(sessionId: number, userId: number): Promise<void>
```

---

## AI Coach Integration

### Architecture

The AI Coach is implemented as a stateless service that generates:
1. Daily decisive prompts
2. Pattern analysis insights
3. Evening reflection feedback

**Integration Pattern:**

```typescript
import { invokeLLM } from "./server/_core/llm";

async function generateDailyPrompt(userId: number): Promise<string> {
  // Fetch recent slider states and daily cycles
  const recentStates = await getStateHistory(userId, null, 7);
  const recentCycles = await getRecentCycles(userId, 7);
  
  // Build context for LLM
  const context = buildPromptContext(recentStates, recentCycles);
  
  // Invoke LLM with strict behavioral rules
  const response = await invokeLLM({
    messages: [
      { role: "system", content: STOIC_STRATEGIST_SYSTEM_PROMPT },
      { role: "user", content: context },
    ],
  });
  
  return response.choices[0].message.content;
}
```

### Behavioral Rules (System Prompt)

```
You are a Stoic strategist, not a therapist. Your role is to help users 
operationalize their free will through conscious emotional calibration.

YOU MUST:
- Speak calmly, briefly, and precisely
- Frame responsibility as power
- Translate emotion → decision → action
- End responses with an action or observation
- Treat emotions as variables, not identities

YOU MUST NEVER:
- Diagnose or provide therapy language
- Validate helplessness
- Use motivational clichés
- Give medical or psychological advice
- Suggest the user is broken or needs fixing

TONE: Command interface, not diary. Pilot, not passenger.
```

### AI-Generated Content Types

1. **Daily Decisive Prompts:**
   - Generated each morning based on recent emotional patterns
   - Single, actionable question (not motivational fluff)
   - Example: "Your courage slider dropped 30 points after Monday's meeting. What specific action will you take today to reclaim that ground?"

2. **Pattern Insights:**
   - Generated weekly or on-demand
   - Identifies cause-effect relationships in slider data
   - Example: "Your anxiety spikes correlate with low sleep (< 6 hours). This is a mechanical relationship, not a character flaw. Adjust the input."

3. **Evening Reflections:**
   - Generated after user completes daily cycle
   - Connects intended action → observed effect
   - Example: "You committed to 'speak up in the meeting.' You did. Your confidence slider moved +15. This is evidence, not encouragement."

---

## Authentication & Security

### Supabase Auth Flow

```
1. User clicks "Sign In" → Redirects to Supabase OAuth portal
2. User authenticates (Google, GitHub, email)
3. Supabase redirects to /api/oauth/callback with code
4. Server exchanges code for JWT
5. Server creates session cookie (httpOnly, secure, sameSite)
6. All subsequent requests include cookie
7. tRPC context extracts user from JWT
```

### Row-Level Security (RLS)

All tables have RLS policies that enforce:
- Users can only read/write their own data
- Connections require mutual acceptance
- Group sessions respect privacy settings

**Example RLS Policy:**

```sql
-- Users can only see their own slider states
CREATE POLICY "Users can view own slider states"
  ON slider_states FOR SELECT
  USING (auth.uid() = user_id);

-- Users can share states with accepted connections
CREATE POLICY "Users can view connected slider states"
  ON slider_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE (user_id = auth.uid() AND connected_user_id = slider_states.user_id)
        AND status = 'accepted'
        AND share_slider_states = true
    )
  );
```

### Data Ownership

- All user data is tied to `users.id`
- Cascade deletes ensure complete data removal
- No cross-user data leakage
- Users can export all data as JSON

---

## Deployment Strategy

### Phase 1: PWA Deployment

**Hosting:**
- Frontend: Vercel or Netlify (static PWA)
- Backend: Railway or Render (Node.js server)
- Database: Supabase (managed PostgreSQL)

**Environment Variables:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
LLM_API_KEY=...
```

**Build Process:**
```bash
# Frontend build
cd client && pnpm build

# Backend build
pnpm build

# Deploy
# Frontend → Vercel
# Backend → Railway
```

### Phase 2: React Native Migration

**Reusable Components:**
- All Zustand stores (state management)
- All tRPC procedures (API layer)
- All business logic in `lib/`

**Rebuild Components:**
- UI layer (React Native components)
- Slider physics (React Native Gesture Handler)
- Offline sync (React Native AsyncStorage + NetInfo)

**Migration Path:**

```
1. Keep PWA running (web users)
2. Create React Native project
3. Copy Zustand stores → React Native
4. Rebuild UI with React Native components
5. Test offline sync with AsyncStorage
6. Deploy to App Store / Play Store
7. Maintain both PWA and native apps
```

---

## Performance Considerations

### Frontend Optimization

1. **Code Splitting:**
   - Lazy load routes with React.lazy()
   - Split vendor bundles
   - Preload critical routes

2. **Slider Performance:**
   - Use requestAnimationFrame for smooth 60fps
   - Debounce state writes to IndexedDB
   - Throttle network sync to avoid spam

3. **Caching:**
   - Service worker caches app shell
   - IndexedDB caches user data
   - React Query caches tRPC responses

### Backend Optimization

1. **Database Indexing:**
   - All foreign keys are indexed
   - Timestamp columns are indexed for time-series queries
   - Composite indexes on (userId, cycleDate) for daily cycles

2. **Query Optimization:**
   - Use Drizzle's relational queries to avoid N+1
   - Paginate large result sets
   - Cache frequently accessed data (Redis)

3. **Rate Limiting:**
   - AI coach calls limited to 10/hour per user
   - Slider state writes limited to 100/hour per user
   - Connection invites limited to 5/day per user

---

## Monitoring & Observability

### Metrics to Track

1. **User Engagement:**
   - Daily active users (DAU)
   - Daily cycle completion rate
   - Slider calibration frequency
   - AI insight rating average

2. **Technical Health:**
   - API response times (p50, p95, p99)
   - Offline sync success rate
   - Service worker cache hit rate
   - Database query performance

3. **Business Metrics:**
   - User retention (7-day, 30-day)
   - Inner circle invite acceptance rate
   - Group session completion rate
   - Premium conversion rate

### Error Tracking

- Frontend: Sentry (React error boundary)
- Backend: Sentry (Express error middleware)
- Database: Supabase logs
- Offline sync: Custom IndexedDB error logs

---

## Future Enhancements

### V2 Features (Post-MVP)

1. **Wearable Integration:**
   - Apple Watch slider controls
   - Fitbit emotional state tracking
   - Biometric data correlation

2. **Advanced AI:**
   - Personalized coaching based on long-term patterns
   - Predictive insights (e.g., "Your courage typically drops on Mondays")
   - Voice-activated calibration

3. **Expanded Social:**
   - Public group challenges
   - Leaderboards (opt-in)
   - Anonymous state sharing

4. **Content Library:**
   - Stoic philosophy modules
   - Guided practices
   - Video lessons

---

## Conclusion

This architecture provides a solid foundation for the Destiny Hacking PWA while maintaining a clear path to React Native migration. The offline-first design ensures reliability, the tRPC layer ensures type safety, and the Supabase backend ensures scalability.

The system is designed to feel like a **control panel for human will**—not a diary, not therapy, not social media. Every technical decision reinforces this core philosophy.

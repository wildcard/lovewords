# LoveWords Contextualism Roadmap
## Context-Aware AAC Ecosystem

**Version**: 2.0 (Major Strategic Expansion)
**Last Updated**: January 18, 2026
**Status**: Planning Phase

---

## Vision: "Envelope of Love"

**Core Insight**: The best AAC tool doesn't just let you communicate - it *anticipates what you need to say* based on rich contextual understanding.

**What is Contextualism?**

Traditional AAC: "Here are 500 phrases. Find what you need."
**Contextual AAC**: "It's 8am, you usually say 'good morning' to Mom. She just walked in. Would you like to say hello?"

---

## The Contextualism Pyramid

```
                    ┌─────────────────────┐
                    │   ANTICIPATION      │ ← AI predicts needs
                    └─────────────────────┘
                  ┌───────────────────────┐
                  │  SOCIAL CONTEXT       │ ← Who's nearby?
                  └───────────────────────┘
                ┌─────────────────────────┐
                │  ENVIRONMENTAL CONTEXT  │ ← News, weather, events
                └─────────────────────────┘
              ┌───────────────────────────┐
              │  TEMPORAL CONTEXT         │ ← Time, day, season
              └───────────────────────────┘
            ┌─────────────────────────────┐
            │  USAGE INTELLIGENCE         │ ← What you use, when
            └─────────────────────────────┘
          ┌───────────────────────────────┐
          │  CORE AAC (MVP)               │ ← Custom boards, switch scanning
          └───────────────────────────────┘
```

Each layer builds on the previous, creating increasingly intelligent communication assistance.

---

## Phase 4: Usage Intelligence (Months 9-12)

**Goal**: Learn user patterns to surface relevant phrases automatically

**Priority**: P1 (High value, moderate complexity)

### Features

#### 4.1: Usage Tracking & Analytics

**Deliverables:**
1. **Button Usage Tracking**
   - Count button presses (per button, per board)
   - Store in localStorage (no backend for MVP+1)
   - Privacy-first: No cloud upload, user owns data

2. **Temporal Patterns**
   - Track time of day for each button press
   - Identify morning/afternoon/evening patterns
   - Store as `{ buttonId: string, timestamp: ISO, boardId: string }`

3. **Frequency Analysis**
   - Most used buttons (all-time)
   - Most used boards (all-time)
   - Recently used (last 24 hours, last week)

**Technical Approach:**
```typescript
// localStorage structure
interface UsageEvent {
  buttonId: string;
  boardId: string;
  timestamp: string; // ISO 8601
  label: string; // For analytics
}

interface UsageStats {
  totalPresses: number;
  firstUsed: string; // ISO 8601
  lastUsed: string; // ISO 8601
  timeOfDayDistribution: {
    morning: number; // 6am-12pm
    afternoon: number; // 12pm-6pm
    evening: number; // 6pm-12am
    night: number; // 12am-6am
  };
  dayOfWeekDistribution: {
    monday: number;
    // ... etc
  };
}

localStorage["lovewords-usage-log"] = UsageEvent[];
localStorage["lovewords-usage-stats"] = Map<buttonId, UsageStats>;
```

**Privacy Controls:**
- Opt-in toggle in Settings
- "Clear usage data" button
- Export usage data (JSON download)
- No analytics sent to server (local-only)

---

#### 4.2: Smart Suggestions Panel

**Deliverables:**
1. **"Suggested for You" Section**
   - Show 3-5 most relevant buttons above main board
   - Based on time of day + usage frequency
   - Scrollable horizontal list

2. **Suggestion Algorithm** (v1 - simple)
   ```javascript
   function getSuggestions(hour) {
     const timeOfDay = getTimeOfDay(hour); // morning/afternoon/evening/night

     // Get buttons used in this time slot historically
     const timeRelevant = filterByTimeOfDay(usageStats, timeOfDay);

     // Sort by frequency
     const sorted = sortByFrequency(timeRelevant);

     // Take top 5
     return sorted.slice(0, 5);
   }
   ```

3. **Suggestion UI**
   - Appears above message bar
   - Dismissible ("Hide suggestions")
   - Tap to speak or add to message
   - Visual indicator: "⭐ Suggested"

**Success Metrics:**
- 30%+ of communications use suggestions (after 1 week of usage)
- Reduce average taps to communicate by 20%
- User satisfaction: 70%+ find suggestions helpful

---

#### 4.3: Seasonal & Calendar Awareness

**Deliverables:**
1. **Holiday Boards**
   - Detect holidays from device calendar (no API needed)
   - Suggest holiday-specific boards:
     - Christmas: "Merry Christmas", "Santa", "presents"
     - Birthday: "Happy birthday", "cake", "party"
     - Valentine's Day: Enhanced romantic phrases

2. **Season Detection**
   - Use device date to determine season
   - Seasonal vocabulary:
     - Summer: "hot", "swimming", "ice cream"
     - Winter: "cold", "snow", "cozy"
     - Spring: "flowers", "allergies", "rain"
     - Fall: "leaves", "pumpkin", "sweater"

3. **Time-of-Day Boards**
   - Morning (6am-12pm): "good morning", "breakfast", "coffee"
   - Afternoon (12pm-6pm): "lunch", "tired", "nap"
   - Evening (6pm-12am): "dinner", "TV", "bedtime"
   - Night (12am-6am): "can't sleep", "bathroom", "pain"

**Technical Approach:**
```typescript
function getContextualBoards() {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const hour = now.getHours(); // 0-23

  const boards = [];

  // Holiday detection
  if (month === 11 && now.getDate() === 25) {
    boards.push("christmas");
  }

  // Time of day
  if (hour >= 6 && hour < 12) {
    boards.push("morning-routine");
  }

  // Season
  if (month >= 5 && month <= 7) {
    boards.push("summer-activities");
  }

  return boards;
}
```

---

### Phase 4 Success Criteria

- [ ] Usage tracking functional (localStorage-based)
- [ ] Smart suggestions appear based on time + frequency
- [ ] Seasonal boards activate automatically
- [ ] 30%+ of users enable usage tracking
- [ ] 20% reduction in average taps per message
- [ ] Privacy controls working (opt-in, clear data, export)

### Phase 4 Timeline

- **Month 9**: Usage tracking + analytics
- **Month 10**: Smart suggestions UI
- **Month 11**: Seasonal/calendar awareness
- **Month 12**: Testing, refinement, privacy audit

---

## Phase 5: Multi-User Ecosystem (Months 12-18)

**Goal**: Connect family, caretakers, and therapists in a shared communication ecosystem

**Priority**: P0 (Critical for "envelope of love" vision)

### Features

#### 5.1: User Authentication & Accounts

**Deliverables:**
1. **User Accounts** (Backend required)
   - Email/password authentication
   - OAuth (Google, Apple Sign-In)
   - Account creation flow
   - Password reset

2. **User Roles**
   - **Primary User**: The AAC user (non-verbal person)
   - **Caretaker**: Parents, nurses, aides
   - **Family**: Siblings, grandparents, friends
   - **Therapist**: SLPs, OTs, medical professionals

3. **Role-Based Permissions**
   - Primary User: Full access, can't be deleted
   - Caretaker: Can create boards, view usage, manage family
   - Family: Can view boards, contribute phrases (with approval)
   - Therapist: Read-only usage reports, can suggest vocabulary

**Technical Architecture:**
```
Backend Stack (Options):
- Firebase (easiest, scales well)
- Supabase (open-source Firebase alternative)
- Custom (Node.js + PostgreSQL)

Authentication:
- NextAuth.js / Firebase Auth
- JWT tokens
- Refresh tokens (24h expiry)

Database Schema:
users:
  - id (UUID)
  - email
  - role (primary | caretaker | family | therapist)
  - created_at
  - last_login

user_circles:
  - id (UUID)
  - primary_user_id (FK)
  - member_user_id (FK)
  - role
  - permissions (JSON)
```

---

#### 5.2: Cloud Sync & Backup

**Deliverables:**
1. **Board Sync**
   - Upload custom boards to cloud
   - Download boards from cloud
   - Conflict resolution (last-write-wins or manual merge)

2. **Multi-Device Support**
   - Use LoveWords on phone, tablet, desktop
   - Boards sync automatically
   - Settings sync (voice, scan speed, etc.)

3. **Automatic Backup**
   - Daily backup of custom boards
   - Backup on every board edit
   - Restore from backup UI

**Data Model:**
```typescript
// Cloud firestore structure
/users/{userId}/boards/{boardId}
{
  id: string;
  name: string;
  ...ObfBoard fields...
  created_at: Timestamp;
  updated_at: Timestamp;
  synced_at: Timestamp;
  version: number; // For conflict resolution
}

/users/{userId}/settings
{
  speech: SpeechSettings;
  display: DisplaySettings;
  scanning: ScanningSettings;
  privacy: PrivacySettings;
  updated_at: Timestamp;
}
```

---

#### 5.3: Caretaker Mobile App

**Deliverables:**
1. **iOS & Android Apps**
   - React Native or Flutter
   - View primary user's boards
   - Monitor usage (if permitted)
   - Add boards remotely

2. **Remote Board Management**
   - Create boards for primary user
   - Requires approval from primary user (if capable)
   - Push notifications when boards are ready

3. **Usage Insights Dashboard**
   - Most used phrases (daily, weekly, monthly)
   - Time-of-day patterns
   - Communication frequency trends
   - Export reports (PDF, CSV)

**Privacy Controls:**
- Primary user can disable usage sharing
- Granular permissions (caretaker can see boards but not usage)
- Audit log (who accessed what, when)

---

#### 5.4: Collaborative Boards

**Deliverables:**
1. **Family Contributions**
   - Family members suggest phrases
   - Primary user approves/rejects
   - Approval queue in Settings

2. **Shared Board Library**
   - "Family Favorites" board (collaborative)
   - Everyone can add, primary user moderates
   - Version history (see who added what)

3. **Board Templates**
   - Caretaker creates template
   - Primary user customizes with their photos
   - Share templates with community (opt-in)

---

### Phase 5 Success Criteria

- [ ] User authentication working (email + OAuth)
- [ ] Cloud sync functional (boards + settings)
- [ ] Caretaker app launched (iOS + Android)
- [ ] Collaborative boards with approval workflow
- [ ] Multi-device support (phone + tablet seamless)
- [ ] Privacy controls granular and auditable
- [ ] 500+ users with multi-user accounts

### Phase 5 Timeline

- **Month 12-13**: Backend infrastructure + authentication
- **Month 14-15**: Cloud sync + multi-device
- **Month 16-17**: Caretaker app (React Native)
- **Month 18**: Collaborative boards, testing, launch

---

## Phase 6: Proximity & Environmental Context (Months 18-24)

**Goal**: Detect who's nearby and what's happening to suggest relevant communication

**Priority**: P1 (High value, high complexity)

### Features

#### 6.1: Proximity Awareness

**Deliverables:**
1. **Bluetooth Low Energy (BLE) Detection**
   - Detect nearby devices (family members' phones)
   - Show "Mom is nearby" notification
   - Suggest Mom-specific board/phrases

2. **Named Contacts**
   - User assigns names to BLE devices
   - "Mom's iPhone", "Dad's Android", "Nurse Jane's phone"
   - Store MAC addresses securely

3. **Proximity-Triggered Boards**
   - "When Mom is nearby, show 'Talk to Mom' board"
   - Automatic board switching (opt-in)
   - History: "You talked to Mom 3 times today"

**Technical Approach:**
```typescript
// Native mobile APIs (React Native or Flutter)
import { BleManager } from 'react-native-ble-plx';

function detectNearbyDevices() {
  const devices = BleManager.scanForDevices();

  const knownDevices = devices.filter(device =>
    userKnownDevices.includes(device.macAddress)
  );

  return knownDevices.map(device => ({
    name: getUserName(device.macAddress),
    distance: estimateDistance(device.rssi),
    lastSeen: new Date()
  }));
}
```

**Privacy Concerns:**
- BLE scanning is intrusive (can detect all nearby devices)
- User must opt-in
- Only detect known/registered devices
- No tracking of unknown devices
- Clear privacy policy

---

#### 6.2: Environmental Context

**Deliverables:**
1. **Weather Integration**
   - Detect current weather (via API)
   - Suggest relevant phrases:
     - Rain: "I need my umbrella", "It's wet outside"
     - Snow: "I'm cold", "Can we build a snowman?"
     - Hot: "I'm hot", "Can we go swimming?"

2. **News & Events**
   - Fetch local news headlines (API)
   - Detect major events (sports games, holidays, concerts)
   - Suggest relevant vocabulary:
     - "Our team won!" (after sports victory)
     - "Happy New Year!" (on New Year's)

3. **Location Awareness**
   - Detect location via GPS (opt-in)
   - Suggest location-specific phrases:
     - At doctor: "I'm nervous", "Does it hurt?"
     - At restaurant: "I'd like water", "Can we order?"
     - At home: "I want to rest", "I'm comfortable"

**APIs Needed:**
- Weather: OpenWeatherMap, WeatherAPI
- News: NewsAPI, Google News
- Location: Browser Geolocation API

**Privacy:**
- All context features are opt-in
- Location never shared with third parties
- News/weather cached locally (minimize API calls)
- User can disable any context source

---

#### 6.3: Contextual Anticipation AI

**Deliverables:**
1. **Pattern Recognition**
   - ML model learns user patterns
   - "Every morning at 8am, you say 'good morning' to Mom"
   - "When Dad is nearby, you usually ask 'How was work?'"

2. **Proactive Suggestions**
   - "It's 8am, Mom just arrived. Say good morning?"
   - "It's lunchtime. Do you need help with food?"
   - "You usually watch TV at 7pm. Want to ask for the remote?"

3. **Context Fusion**
   - Combine multiple context signals:
     - Time + proximity + usage history
     - "It's bedtime, Mom is nearby, you usually say goodnight"
   - Rank suggestions by relevance

**ML Approach (Simple for MVP+2):**
```python
# Logistic regression on usage patterns
def predict_next_phrase(current_context):
  features = {
    "hour_of_day": current_context.hour,
    "day_of_week": current_context.day,
    "nearby_people": current_context.proximity,
    "last_used_phrase": current_context.last_phrase,
    "location": current_context.location
  }

  # Simple frequency-based prediction (no neural net needed)
  return most_frequent_in_context(features)
```

**Privacy:**
- ML model trained locally (on-device)
- No data sent to cloud for training
- User can reset model ("forget my patterns")

---

### Phase 6 Success Criteria

- [ ] BLE proximity detection working (iOS + Android)
- [ ] Environmental context (weather, news, location)
- [ ] Contextual suggestions based on proximity + time + usage
- [ ] Privacy controls for all context sources
- [ ] 50%+ of users enable at least one context feature
- [ ] 40% reduction in taps per message (vs. Phase 4)

### Phase 6 Timeline

- **Month 18-19**: BLE proximity detection
- **Month 20-21**: Environmental context (weather, news, location)
- **Month 22-23**: Contextual AI (pattern recognition, suggestions)
- **Month 24**: Testing, privacy audit, launch

---

## Technical Infrastructure

### Backend Architecture (Phase 5+)

**Option A: Firebase (Recommended for MVP)**
- Pros: Fast setup, scales automatically, real-time sync
- Cons: Vendor lock-in, pricing at scale
- Cost: Free tier (100 concurrent users), ~$25/mo for 1000 users

**Option B: Supabase (Open-Source)**
- Pros: Self-hostable, PostgreSQL, similar to Firebase
- Cons: Less mature, requires more DevOps
- Cost: Free tier (500MB), ~$25/mo for 8GB

**Option C: Custom Backend**
- Pros: Full control, no vendor lock-in
- Cons: Most development time, maintenance burden
- Stack: Node.js + Express + PostgreSQL + Redis
- Cost: ~$10/mo (DigitalOcean), ~$50/mo (AWS)

**Recommendation**: Start with Firebase, migrate to Supabase if costs grow.

---

### Mobile App Architecture

**Option A: React Native (Recommended)**
- Pros: Reuse web code (React), large ecosystem
- Cons: Native modules needed for BLE, can be buggy
- Timeline: 3-4 months for caretaker app

**Option B: Flutter**
- Pros: Fast, beautiful, great BLE support
- Cons: Learn Dart, no code reuse from web
- Timeline: 4-5 months

**Option C: Progressive Web App (PWA)**
- Pros: Zero install, works everywhere
- Cons: No BLE, no background tasks, limited features
- Timeline: 1-2 months (extend web app)

**Recommendation**: React Native for caretaker app (can reuse components), PWA for primary user (install on home screen).

---

### Privacy & Security

**Data Ownership:**
- User owns all data (boards, usage, settings)
- Can export all data as JSON
- Can delete account + all data

**Encryption:**
- Data encrypted at rest (database level)
- Data encrypted in transit (HTTPS/WSS)
- End-to-end encryption for collaborative boards (opt-in)

**Permissions:**
- Granular (per-user, per-feature)
- Auditable (log all access)
- Revocable (remove family member instantly)

**Compliance:**
- GDPR compliant (EU users)
- CCPA compliant (California users)
- HIPAA considerations (if used in medical settings)

---

## Roadmap Summary

| Phase | Timeline | Focus | Key Features |
|-------|----------|-------|--------------|
| **MVP** (v1.0) | Months 1-4 | Core AAC | Custom boards, switch scanning, images |
| **Phase 4** (v2.0) | Months 9-12 | Usage Intelligence | Smart suggestions, time/season awareness |
| **Phase 5** (v3.0) | Months 12-18 | Multi-User Ecosystem | Auth, cloud sync, caretaker app, collaborative boards |
| **Phase 6** (v4.0) | Months 18-24 | Proximity & Context | BLE, weather, news, AI anticipation |

---

## Business Model

**Free Tier:**
- Core AAC (custom boards, switch scanning)
- Usage intelligence (local-only)
- Up to 3 family members

**Pro Tier ($9.99/month):**
- Cloud sync (unlimited devices)
- Unlimited family members
- Caretaker app access
- Advanced analytics
- Priority support

**Enterprise ($99/month for organizations):**
- For care facilities, schools, hospitals
- Bulk licensing (10+ users)
- Admin dashboard
- Custom branding
- HIPAA compliance assistance

---

## Success Metrics

**Phase 4:**
- 30%+ users enable usage tracking
- 20% reduction in taps per message
- 70%+ find suggestions helpful

**Phase 5:**
- 500+ multi-user accounts
- 1000+ caretaker app installs
- 80%+ boards backed up to cloud

**Phase 6:**
- 50%+ enable proximity detection
- 40% reduction in taps per message (vs. baseline)
- 90%+ user satisfaction with contextual suggestions

---

## Open Questions

1. **Backend Timing**: Introduce backend in Phase 5 or earlier?
2. **Native Apps**: React Native or Flutter?
3. **Privacy Model**: How granular should permissions be?
4. **Business Model**: Freemium or ads?
5. **BLE Protocol**: How to handle device pairing/naming?
6. **AI Model**: Local (TensorFlow.js) or cloud (OpenAI API)?
7. **Data Export**: JSON, CSV, or PDF for usage reports?

---

## Next Steps

1. Finish Sprint 2 (custom boards + images) - **This Month**
2. Complete Sprint 3-5 (MVP) - **Next 3 Months**
3. User testing + feedback - **Month 4**
4. Plan Phase 4 detailed spec - **Month 5**
5. Backend architecture decision - **Month 6**
6. Phase 4 development (usage intelligence) - **Months 9-12**

---

**Status**: Planning complete, ready for detailed spec and GitHub issues.

# LoveWords Product Roadmap

**Version**: 2.0 (Updated with Contextualism Vision)
**Last Updated**: January 18, 2026
**Status**: Active Development

---

## Vision

**Mission**: Empower non-verbal adults to express love, affection, and intimate communication through a free, accessible, relationship-focused AAC tool that *anticipates their needs* through context-aware intelligence.

**Vision**: Create the world's first context-aware AAC ecosystem - the "envelope of love" - where family, caretakers, and technology work together to help users communicate what they need, when they need it, with minimal effort.

**Strategic Shift**: Moving beyond static communication boards to a living, learning system that understands:
- What you say most
- When you say it
- Who you're with
- What's happening around you

This transforms AAC from a tool you use to a companion that helps you communicate.

---

## Current State (v0.1 - January 2026)

### ✅ What We Have

**Core Functionality:**
- 8 communication boards with 100+ phrases/words
- Web Speech API integration
- Message bar for sentence building
- Keyboard navigation (arrow keys, Enter/Space)
- Settings (voice, speed, pitch, volume)

**Accessibility Features:**
- WCAG 2.1 Level AA compliant
- Screen reader support (ARIA live regions)
- Focus trap in modals
- Skip navigation link
- High contrast colors

**Technical Foundation:**
- React 18 + TypeScript
- Vite build system
- Tailwind CSS
- Open Board Format (OBF) 0.1 compliant
- 19 passing accessibility tests
- Comprehensive documentation

**Deployment:**
- Live on Vercel: https://lovewords-web.vercel.app/
- Works on all modern browsers
- Mobile-responsive
- Offline-capable (after initial load)

### ❌ Critical Gaps

Based on competitive analysis, we need:

1. **Switch Scanning** (P0) - blocks motor-impaired users
2. **Custom Board Creation** (P0) - can't personalize vocabulary
3. **Word Prediction** (P1) - slower communication
4. **Enhanced Voices** (P1) - limited quality
5. **Cloud Sync** (P2) - no multi-device support
6. **Usage Tracking** (P2) - no caregiver insights

---

## Roadmap Overview

| Phase | Timeline | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| **Phase 1** | Months 1-3 | Accessibility | Switch scanning, motor accessibility |
| **Phase 2** | Months 3-6 | Customization | Custom boards, import/export |
| **Phase 3** | Months 6-9 | Core Intelligence | Word prediction, smart search |
| **MVP Launch** | Month 4 | Public Release | v1.0 - Production-ready AAC tool |
| **Phase 4** | Months 9-12 | Usage Intelligence | Smart suggestions, temporal/seasonal awareness |
| **Phase 5** | Months 12-18 | Multi-User Ecosystem | Cloud sync, caretaker app, collaborative boards |
| **Phase 6** | Months 18-24 | Contextual AI | Proximity sensing, environmental context, anticipation |

**New Strategic Direction**: Phases 4-6 implement the "Envelope of Love" vision - context-aware communication assistance. See [CONTEXTUALISM_ROADMAP.md](./CONTEXTUALISM_ROADMAP.md) for details.

---

## Phase 1: Essential Accessibility (Months 1-3)

**Goal**: Make LoveWords accessible to users with motor impairments (CP, ALS, quadriplegia)

**Priority**: P0 (Blocker for key user segment)

### Milestone 1.1: Switch Scanning Foundation (Weeks 1-4)

**Deliverables:**
1. **Single-Switch Automatic Scanning**
   - Visual highlight moves automatically through cells
   - Configurable scan speed (0.5s - 5s intervals)
   - Press switch to select highlighted cell
   - Screen touch acts as switch (for testing)

2. **Single-Switch Step Scanning**
   - Press switch to advance highlight
   - Hold switch to select
   - Configurable hold duration (0.5s - 3s)

3. **Scan Patterns**
   - Linear scanning (left-to-right, top-to-bottom)
   - Row-column scanning (select row, then column)
   - Reverse scanning (scan backwards)

**Technical Approach:**
- Create `useScanner` hook with state machine
- Add `Scanner` component with visual highlighting
- Implement scan timer with `setInterval`
- Add keyboard mappings for switch simulation
- Settings panel for scan speed/pattern

**Success Metrics:**
- User can navigate entire board with single switch
- Scan speed adjustable without page reload
- <2 second selection time for experienced users
- Pass accessibility tests (automated + manual)

**Testing:**
- Unit tests for scanner state machine
- Integration tests for scan patterns
- User testing with CP patients (if available)
- Keyboard-only testing (simulating switch)

**Risks & Mitigation:**
- **Risk**: Performance issues with frequent DOM updates
  - **Mitigation**: Use CSS animations, optimize re-renders
- **Risk**: Confusing for non-switch users
  - **Mitigation**: Disable by default, clear toggle in Settings

---

### Milestone 1.2: Two-Switch Scanning (Weeks 5-6)

**Deliverables:**
1. **Two-Switch Mode**
   - Switch 1 (Stepper): Advance to next item
   - Switch 2 (Picker): Select current item
   - Faster than single-switch (no auto-advance)

2. **External Switch Support**
   - Map keyboard keys to switches (e.g., Space = Switch 1, Enter = Switch 2)
   - Support for assistive tech (via keyboard interface)
   - USB switch adapters (work as keyboard)

**Success Metrics:**
- 30-50% faster selection vs. single-switch automatic
- Keyboard mapping works with external switches
- User preference saves in localStorage

---

### Milestone 1.3: Enhanced Motor Accessibility (Weeks 7-9)

**Deliverables:**
1. **Dwell Time Activation**
   - Hover/focus on button for N seconds to activate
   - Visual progress indicator (circular countdown)
   - Adjustable dwell time (0.5s - 5s)

2. **Touch Target Optimization**
   - Configurable button sizes (small, medium, large, extra-large)
   - Minimum 44x44px touch targets (WCAG AAA)
   - Spacing between buttons (prevent mis-taps)

3. **Reduced Motion**
   - Respect `prefers-reduced-motion` media query
   - Disable scan animations for users who need it
   - Static highlight instead of sliding

**Success Metrics:**
- Pass WCAG 2.1 Level AAA for motor accessibility
- Dwell activation works without mouse clicks
- Touch targets meet 44x44px minimum

---

### Milestone 1.4: Testing & Documentation (Weeks 10-12)

**Deliverables:**
1. **User Testing**
   - Recruit 3-5 users with motor impairments
   - Test switch scanning with real switches (if possible)
   - Collect feedback on scan speed, patterns
   - Iterate based on feedback

2. **Documentation**
   - Update USER_GUIDE.md with switch scanning instructions
   - Create video tutorial for switch setup
   - Accessibility statement (WCAG conformance)

3. **Deployment**
   - Deploy Phase 1 to production
   - Announce switch scanning support
   - Collect usage analytics (opt-in)

**Success Metrics:**
- 3+ successful user tests with motor-impaired users
- <5 bug reports in first month
- 10%+ of users enable switch scanning

---

## Phase 2: Personalization & Customization (Months 3-6)

**Goal**: Enable users to create custom boards with their own vocabulary, photos, and vocalizations

**Priority**: P0 (Core value proposition)

### Milestone 2.1: Custom Board Builder (Weeks 13-18)

**Deliverables:**
1. **Board Creation Interface**
   - "Create New Board" button in navigation
   - Board editor modal with form:
     - Board name
     - Description
     - Grid size (3x3, 4x4, 5x4, 6x6)
     - Locale (language)

2. **Button Editor**
   - Add button modal with fields:
     - Label (text shown on button)
     - Vocalization (text spoken)
     - Action (speak, add to message, navigate)
     - Background color (color picker)
     - Border color
   - Grid position selector (drag-and-drop or coordinate input)
   - Delete button option
   - Edit existing buttons

3. **Custom Images**
   - Upload photo from device
   - Take photo with camera (mobile)
   - Search free icon libraries (OpenMoji, ARASAAC)
   - Crop/resize images
   - Associate image with button

4. **Custom Audio**
   - Record vocalization with device microphone
   - Upload audio file (MP3, WAV)
   - Preview audio before saving
   - Associate audio with button

**Technical Approach:**
- Create `BoardEditor` component with drag-and-drop (react-dnd or dnd-kit)
- Use `FileReader` API for image/audio uploads
- Store custom boards in localStorage (OBF format)
- Validate OBF structure before saving
- Add to `boardNavigator` state

**Success Metrics:**
- User can create custom board in <10 minutes
- Image upload works on mobile
- Audio recording works in Chrome/Safari
- Custom boards persist across sessions

**Testing:**
- Unit tests for OBF validation
- Integration tests for board creation flow
- User testing: "Create a board with 3 phrases for your partner"

---

### Milestone 2.2: Import/Export & Sharing (Weeks 19-22)

**Deliverables:**
1. **Import OBF Files**
   - "Import Board" button
   - File picker (*.obf.json, *.json)
   - Validate OBF format
   - Preview board before importing
   - Handle duplicates (ask to replace or rename)

2. **Export OBF Files**
   - "Export Board" button on each board
   - Download as `{board-name}.obf.json`
   - Include all images/sounds (data URLs or base64)
   - Works offline

3. **Share via Link**
   - "Share Board" generates shareable link
   - Upload board to cloud storage (GitHub Gist, Pastebin, or custom backend)
   - QR code for mobile sharing
   - Privacy: boards are unlisted (not searchable)

**Success Metrics:**
- User can import board from Proloquo2Go/TouchChat (OBF compatible)
- Export works in all browsers
- Share link works across devices
- 20%+ of users import/export boards

---

### Milestone 2.3: Board Management (Weeks 23-24)

**Deliverables:**
1. **Board Library**
   - "My Boards" page listing all boards (default + custom)
   - Search/filter boards by name, tags
   - Star/favorite boards
   - Delete custom boards (confirm dialog)

2. **Board Metadata**
   - Add tags (romantic, playful, daily needs)
   - Add description
   - Set visibility (private, shared)
   - Track usage count (most-used boards)

**Success Metrics:**
- Users organize boards with tags
- Favorites appear at top of navigation
- Library search works quickly (<100ms)

---

## Phase 3: Intelligence & Speed (Months 6-9)

**Goal**: Speed up communication with AI-powered word prediction and smart features

**Priority**: P1 (Competitive parity)

### Milestone 3.1: Word Prediction Engine (Weeks 25-30)

**Deliverables:**
1. **Next-Word Prediction**
   - Show 2-3 next-word suggestions above message bar
   - Based on:
     - N-gram model (trained on English corpus)
     - User's past messages (learn patterns)
     - Current board context (board-specific vocab)
   - Tap suggestion to add word
   - Works offline (local model)

2. **Phrase Completion**
   - Auto-complete common phrases
   - Examples:
     - "I love" → "you", "you so much", "spending time with you"
     - "Good" → "morning", "night", "afternoon"
   - User-trained (learns from custom boards)

3. **Recency & Frequency**
   - Recently used words appear first
   - Frequently used words ranked higher
   - Clear recents history option (privacy)

**Technical Approach:**
- **Option A**: Simple n-gram model (lightweight)
  - Train on common English phrases
  - Store in localStorage (small footprint)
  - Fast inference (<10ms)

- **Option B**: Transformer-based model (advanced)
  - Use GPT-2 or similar (ONNX.js for browser)
  - ~50MB model size (download once)
  - Slower but more accurate

- **Decision**: Start with Option A (n-gram), offer Option B as opt-in

**Success Metrics:**
- 30%+ reduction in taps to communicate common phrases
- Prediction accuracy >60% (user accepts suggestion)
- <50ms prediction latency
- User satisfaction >70% (survey)

---

### Milestone 3.2: Smart Search (Weeks 31-34)

**Deliverables:**
1. **Quick Search**
   - Search bar in navigation
   - Search across all boards (name, labels, vocalizations)
   - Fuzzy matching ("luv" → "love")
   - Highlight matches
   - Jump to board + cell when selected

2. **Search Filters**
   - Filter by board
   - Filter by action type (speak, add)
   - Filter by tags (romantic, playful)

**Success Metrics:**
- User can find any phrase in <5 seconds
- Search works offline
- Fuzzy search improves findability

---

### Milestone 3.3: Favorites & Shortcuts (Weeks 35-36)

**Deliverables:**
1. **Favorite Phrases**
   - Star/favorite any button
   - "Favorites" quick-access board
   - Appears in navigation
   - Max 20 favorites (keep it manageable)

2. **Keyboard Shortcuts**
   - Press 1-9 to activate top 9 favorites
   - Customizable shortcuts
   - Visual indicators (show number on button)

**Success Metrics:**
- 50%+ of users create favorites
- Shortcuts reduce time to communicate by 40%

---

## Phase 4: Advanced Features (Months 9-12)

**Goal**: Achieve competitive parity with premium AAC apps

**Priority**: P1-P2

### Milestone 4.1: Enhanced Voice Options (Weeks 37-42)

**Deliverables:**
1. **Cloud TTS Integration**
   - Support multiple providers:
     - Google Cloud Text-to-Speech
     - Azure Cognitive Services
     - AWS Polly
     - ElevenLabs (high quality)
   - User provides API key (privacy-preserving)
   - 50+ voices per provider
   - Natural, human-like quality

2. **Voice Recording**
   - Record your own voice saying phrases
   - "Voice banking" for ALS patients
   - Save recordings per button
   - Fallback to TTS if no recording

3. **Voice Customization**
   - Select favorite voice
   - Fine-tune pitch, speed, volume per voice
   - Preview voices before selecting

**Technical Approach:**
- Create `TTSProvider` abstraction (Google, Azure, AWS)
- Store API key in localStorage (encrypted)
- Fallback to browser TTS if API fails
- Voice banking: record audio, store as data URL

**Success Metrics:**
- 10%+ of users integrate cloud TTS
- Voice quality rating >4/5
- Voice banking used by ALS patients

---

### Milestone 4.2: Cloud Sync (Weeks 43-48)

**Deliverables:**
1. **Anonymous Account**
   - Create account with no email (anonymous ID)
   - Generate secure token (UUID)
   - Optional email for recovery

2. **Sync Features**
   - Sync settings across devices
   - Sync custom boards
   - Sync favorites and usage data
   - End-to-end encryption (user-controlled key)

3. **Multi-Device Support**
   - Login on multiple devices
   - Changes sync automatically (when online)
   - Offline mode (queue changes for sync)
   - Conflict resolution (last-write-wins)

**Technical Approach:**
- **Backend Option A**: Firebase (free tier)
- **Backend Option B**: Supabase (open source)
- **Backend Option C**: Custom backend (Node.js + PostgreSQL)
- **Decision**: Use Supabase (open source, generous free tier)

**Success Metrics:**
- 20%+ of users create account
- Sync works across 2+ devices
- <1 sync conflict per 100 users

---

### Milestone 4.3: Usage Analytics (Weeks 49-52)

**Deliverables:**
1. **Communication Tracking**
   - Track most-used words/phrases
   - Track communication frequency (per day)
   - Track boards used
   - Privacy: opt-in only, user controls all data

2. **Insights Dashboard**
   - Visualize usage over time
   - Top 10 phrases
   - Communication patterns (time of day, day of week)
   - Export data as CSV for therapists

3. **Caregiver Portal (Optional)**
   - Separate login for caregivers
   - View user's insights (with permission)
   - Set goals (e.g., "Use 5 new words this week")
   - Progress tracking

**Success Metrics:**
- 15%+ of users opt into tracking
- Insights help users/therapists see progress
- Privacy concerns <5% (user trust maintained)

---

## Phase 5: Community & Ecosystem (Months 12+)

**Goal**: Build a thriving community around LoveWords

**Priority**: P2-P3 (Long-term growth)

### Milestone 5.1: Board Sharing Platform (Months 13-15)

**Deliverables:**
1. **Community Boards**
   - User-submitted boards (curated)
   - Categories (romantic, playful, daily needs, holidays)
   - Ratings & reviews
   - Download count
   - Search & filter

2. **Board Collections**
   - Curated collections (e.g., "Valentine's Day", "Anniversary")
   - Community-voted "Best Of"
   - Featured boards (editorial picks)

3. **Moderation**
   - Report inappropriate boards
   - Community guidelines
   - Moderator review queue

**Success Metrics:**
- 100+ community-created boards
- 1,000+ board downloads
- Active community (10+ boards/month)

---

### Milestone 5.2: Multilingual Expansion (Months 16-18)

**Deliverables:**
1. **Language Support**
   - Spanish translation (primary)
   - French translation
   - German translation
   - Community-contributed translations (Crowdin)

2. **RTL Language Support**
   - Arabic
   - Hebrew
   - Proper text direction handling

3. **Localized Vocabulary**
   - Culture-specific phrases
   - Region-specific symbols (flags, food, customs)

**Success Metrics:**
- 5+ languages supported
- 20%+ of users use non-English
- Community contributes translations

---

### Milestone 5.3: Advanced Integrations (Months 19-21)

**Deliverables:**
1. **Video Call Integration**
   - One-tap share to Zoom/Teams/FaceTime
   - Use LoveWords during video calls
   - Screen sharing mode (larger text)

2. **Social Media Integration**
   - Post to Twitter/Facebook
   - Share phrases as images
   - Privacy: user controls sharing

3. **Wearable Support**
   - Apple Watch complication
   - Quick access to favorites
   - Haptic feedback for scanning

**Success Metrics:**
- Video call integration used by 5%+ of users
- Social sharing increases awareness

---

## Success Metrics & KPIs

### User Growth

| Metric | Current | 6 Months | 12 Months | 24 Months |
|--------|---------|----------|-----------|-----------|
| **Active Users** | 100 | 1,000 | 5,000 | 25,000 |
| **Daily Active Users** | 20 | 200 | 1,000 | 5,000 |
| **Retention (30-day)** | 30% | 50% | 60% | 70% |
| **Custom Boards Created** | 0 | 500 | 2,500 | 10,000 |
| **Community Boards** | 0 | 50 | 200 | 1,000 |

### Accessibility Impact

| Metric | Current | 6 Months | 12 Months |
|--------|---------|----------|-----------|
| **Switch Scanner Users** | 0% | 10% | 15% |
| **WCAG Compliance** | AA | AAA | AAA |
| **Assistive Tech Compat.** | 80% | 95% | 99% |

### Feature Adoption

| Feature | 6 Months | 12 Months | 24 Months |
|---------|----------|-----------|-----------|
| **Custom Boards** | 30% | 50% | 70% |
| **Word Prediction** | 40% | 60% | 75% |
| **Cloud Sync** | 15% | 25% | 40% |
| **Switch Scanning** | 10% | 15% | 20% |
| **Cloud TTS** | 5% | 10% | 20% |

### Quality Metrics

| Metric | Target |
|--------|--------|
| **Page Load Time** | <2s |
| **Speech Latency** | <500ms |
| **Search Latency** | <100ms |
| **Uptime** | 99.9% |
| **Bug Reports/Month** | <10 |
| **User Satisfaction** | >4.5/5 |

---

## Resource Requirements

### Development Team (Estimated FTE)

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|
| **Frontend Engineer** | 1.0 | 1.0 | 1.5 | 1.5 | 1.0 |
| **Accessibility Specialist** | 0.5 | 0.25 | 0.25 | 0.25 | 0.25 |
| **ML Engineer** | 0 | 0 | 0.75 | 0.5 | 0.25 |
| **Backend Engineer** | 0 | 0 | 0 | 1.0 | 0.75 |
| **Designer** | 0.25 | 0.5 | 0.25 | 0.25 | 0.5 |
| **QA/Tester** | 0.25 | 0.5 | 0.5 | 0.5 | 0.5 |
| **Technical Writer** | 0.25 | 0.25 | 0.25 | 0.25 | 0.25 |

### Infrastructure Costs (Estimated/Month)

| Service | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|---------|---------|---------|---------|---------|---------|
| **Hosting (Vercel)** | $0 | $0 | $0 | $0 | $20 |
| **Backend (Supabase)** | $0 | $0 | $0 | $0 | $25 |
| **CDN (Images)** | $0 | $0 | $0 | $10 | $50 |
| **Monitoring** | $0 | $0 | $0 | $10 | $20 |
| **Total** | $0 | $0 | $0 | $20 | $115 |

---

## Risk Management

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Browser TTS quality varies** | Medium | High | Offer cloud TTS integration |
| **Switch scanning performance** | High | Medium | Optimize with CSS animations, test early |
| **LocalStorage size limits** | Medium | Medium | Offer cloud sync, compress data |
| **ML model size (word prediction)** | Medium | Medium | Start with n-gram, offer transformer opt-in |
| **Cross-browser compatibility** | Medium | Medium | Test on all major browsers, use polyfills |

### Product Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Users don't customize boards** | High | Medium | Make board creation easy, offer templates |
| **Switch scanning too complex** | High | Low | User testing, clear documentation |
| **Privacy concerns (cloud sync)** | Medium | Medium | Make opt-in, use encryption, clear privacy policy |
| **Competitors copy features** | Low | High | Stay ahead with unique features, community |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **No funding for development** | High | Medium | Open source, volunteer contributors, grants |
| **Low user adoption** | High | Medium | Marketing, partnerships with SLPs/therapists |
| **Feature creep** | Medium | High | Stick to roadmap, prioritize ruthlessly |

---

## Go-to-Market Strategy

### Launch Plan (Phase 1 Release)

**Week -4: Pre-Launch**
- Finalize switch scanning features
- User testing with 5 motor-impaired users
- Create demo videos (YouTube)
- Write launch blog post
- Prepare social media content

**Week -2: Soft Launch**
- Beta test with 20 users
- Collect feedback
- Fix critical bugs
- Update documentation

**Week 0: Public Launch**
- Publish to Product Hunt
- Post on Reddit (r/AAC, r/accessibility)
- Tweet launch announcement
- Email SLPs/therapists
- Submit to AAC app directories

**Week 1-4: Post-Launch**
- Monitor bug reports
- Respond to feedback
- Iterate quickly
- Collect user testimonials

### Marketing Channels

| Channel | Target Audience | Strategy |
|---------|----------------|----------|
| **Product Hunt** | Tech-savvy early adopters | Launch day push for upvotes |
| **Reddit** | AAC users, caregivers | Post in r/AAC, r/accessibility, r/disability |
| **Twitter/X** | Accessibility community | Regular updates, hashtags (#AAC, #a11y) |
| **YouTube** | Visual learners | Tutorial videos, user stories |
| **SLP Newsletters** | Speech-language pathologists | Partner with SLP organizations |
| **AAC Conferences** | Professionals, users | Sponsor/attend conferences (ISAAC, ATIA) |
| **GitHub** | Open source developers | Highlight open source, invite contributors |

### Partnerships

- **SLP Organizations**: ASHA (American Speech-Language-Hearing Association)
- **Disability Advocacy**: ALS Association, Cerebral Palsy Foundation
- **Open Source**: OpenAAC, UNICEF Innovation Fund
- **Academic**: University research labs studying AAC

---

## Iteration Strategy

### Agile Sprint Structure

**Sprint Duration**: 2 weeks
**Ceremonies**:
- Sprint Planning (Day 1): Define goals, break down tasks
- Daily Standup (Daily): 15-min sync
- Sprint Review (Day 14): Demo to stakeholders
- Sprint Retro (Day 14): What went well, what to improve

**Release Cadence**:
- **Minor releases**: Every sprint (2 weeks)
- **Major releases**: Every phase (3 months)
- **Hotfixes**: As needed (1-2 days)

### User Feedback Loop

**Feedback Channels**:
1. **In-App**: Feedback button (opens GitHub issue)
2. **GitHub Issues**: Bug reports, feature requests
3. **User Interviews**: Monthly (5 users)
4. **Surveys**: Quarterly (all users)
5. **Analytics**: Track feature usage (opt-in)

**Feedback → Action Pipeline**:
1. Collect feedback (all channels)
2. Triage weekly (label: bug, enhancement, question)
3. Prioritize (P0-P3)
4. Add to roadmap
5. Communicate decisions (GitHub, blog)

---

## Open Questions & Decisions Needed

| Question | Impact | Decision By |
|----------|--------|-------------|
| Which ML model for word prediction? | Medium | End of Phase 2 |
| Which cloud backend for sync? | High | End of Phase 3 |
| Should we charge for cloud features? | High | End of Phase 3 |
| Which languages to support first? | Medium | End of Phase 4 |
| How to moderate community boards? | Medium | End of Phase 4 |

---

## Next Steps

### Immediate Actions (This Week)

1. **User Testing Plan**
   - Define test scenarios for switch scanning
   - Recruit 3-5 users with motor impairments
   - Schedule testing sessions

2. **Technical Spike**
   - Research switch scanning libraries (react-aria, downshift)
   - Prototype scan timer and highlight
   - Test performance (60fps?)

3. **Ralph Loop Setup**
   - Create `/ralph-loop` skill for continuous iteration
   - Set up feedback tracking (GitHub issues)
   - Define success criteria for Phase 1

### This Month

- Start Phase 1: Milestone 1.1 (Switch Scanning Foundation)
- Recruit user testers
- Set up CI/CD for faster iterations
- Write Phase 1 blog post

### This Quarter

- Complete Phase 1 (Switch Scanning)
- Launch publicly with switch scanning support
- Collect user feedback
- Begin Phase 2 planning

---

**Last Updated**: January 2026
**Next Review**: End of Phase 1 (Month 3)

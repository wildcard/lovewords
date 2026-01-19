# LoveWords MVP Definition

**Last Updated**: January 2026
**Status**: Active Planning
**Current Version**: v0.2 (Post-Sprint 1)
**Target MVP Version**: v1.0

---

## Executive Summary

**Current State**: We have a working prototype with basic communication boards and switch scanning.

**Gap to MVP**: We are **NOT close to MVP**. We lack critical features that prevent real-world adoption:
- ❌ Custom board creation (users can't personalize vocabulary)
- ❌ Image/photo support (no visual communication)
- ❌ Board import/export (can't share or backup)
- ❌ Multi-device support (can't use on phone + tablet)
- ❌ Practical board content (current boards too limited)

**MVP Timeline**: 3-4 months of focused development

---

## What is an MVP for LoveWords?

An MVP must enable this user story:

> "As a non-verbal adult with ALS, I can use LoveWords on my tablet to communicate affection with my partner using **my own photos and phrases**, accessible via **switch scanning**, and **synchronized across my devices**."

### MVP Success Criteria

1. **Usable**: Non-technical users can start communicating in <5 minutes
2. **Accessible**: Works for motor-impaired users (switch scanning functional)
3. **Valuable**: Offers unique value vs. free competitors (relationship focus)
4. **Personalizable**: Users can create custom boards with their vocabulary
5. **Reliable**: Data doesn't disappear (cloud sync or export/import)
6. **Multi-platform**: Works on mobile, tablet, desktop

---

## MVP Feature Set

### ✅ Complete (v0.2)

| Feature | Status | Notes |
|---------|--------|-------|
| Basic communication boards | ✅ | 8 boards, 100+ phrases |
| Web Speech API | ✅ | TTS working |
| Message bar (sentence building) | ✅ | Works well |
| Keyboard navigation | ✅ | Arrow keys, Enter/Space |
| Switch scanning | ✅ | Single-switch automatic scanning |
| Scan speed configuration | ✅ | 0.5s - 5s adjustable |
| Screen tap as switch | ✅ | For testing/mobile |
| Settings (voice, speech, display) | ✅ | Comprehensive |
| WCAG 2.1 Level AA | ✅ | Accessible baseline |
| Mobile-responsive | ✅ | Works on phones/tablets |

**Verdict**: Strong foundation, but not usable in real-world scenarios yet.

---

### 🚧 In Progress (Sprint 2 Goals)

These are critical gaps that prevent real adoption:

#### 1. Custom Board Creation (P0 - Blocker)

**Why critical**: Current boards are generic. Users need personalized vocabulary for relationships.

**Features needed**:
- ✅ Create new board (name, grid size, description)
- ✅ Add/edit/delete buttons
- ✅ Set button labels and vocalizations
- ✅ Choose button colors
- ✅ Upload photos from device
- ✅ Position buttons in grid (drag-and-drop preferred)
- ✅ Save custom boards to localStorage
- ✅ Navigate to custom boards

**Timeline**: 2-3 weeks (Milestone 2.1)

**MVP Requirement**: Users MUST be able to create at least one custom board with 6-12 buttons including photos.

---

#### 2. Image & Photo Support (P0 - Blocker)

**Why critical**: Visual communication is essential for non-verbal users. Seeing a photo of "Mom", "Dog", "Home" is more meaningful than text alone.

**Features needed**:
- ✅ Upload photo from device (File API)
- ✅ Take photo with camera (mobile)
- ✅ Crop/resize images (basic editing)
- ✅ Display images on buttons
- ✅ Fallback to symbols/icons (for buttons without photos)
- ✅ Support for icon libraries (OpenMoji, ARASAAC)

**Timeline**: 1-2 weeks (Milestone 2.1)

**MVP Requirement**: Users MUST be able to upload at least 6 photos and display them on buttons.

---

#### 3. Import/Export Boards (P0 - Blocker)

**Why critical**: Without this, users lose their data if they clear browser cache or switch devices. This is a deal-breaker.

**Features needed**:
- ✅ Export board as OBF JSON file
- ✅ Include images in export (base64 or data URLs)
- ✅ Import board from JSON file
- ✅ Validate imported boards
- ✅ Handle duplicate boards (rename or replace)
- ✅ Backup all boards (export all as ZIP)

**Timeline**: 1 week (Milestone 2.2)

**MVP Requirement**: Users MUST be able to export/import boards to preserve their data.

---

#### 4. Expanded Board Content (P0 - Blocker)

**Why critical**: Current 8 boards are too limited for real relationships. We need at least 15-20 boards covering:
- Basic needs (bathroom, water, tired, pain)
- Emotions (happy, sad, frustrated, scared, excited)
- Questions (yes/no, what/where/when/who, how are you)
- Romantic phrases (expanded love & affection)
- Daily activities (TV, music, outside, book)
- Emergency (help, call 911, medicine)

**Features needed**:
- ✅ Create 10-12 new default boards
- ✅ Add 200+ new phrases
- ✅ Organize by category (basic, emotions, questions, etc.)
- ✅ Ensure phrases are adult-appropriate (not childish)
- ✅ Include intimate communication options

**Timeline**: 1 week (content creation)

**MVP Requirement**: At least 15 boards with 300+ total phrases covering essential communication needs.

---

#### 5. Board Library & Management (P1 - Important)

**Why important**: As users create custom boards, they need to organize them.

**Features needed**:
- ✅ "My Boards" page listing all boards
- ✅ Search/filter boards
- ✅ Star/favorite boards (appear at top)
- ✅ Delete custom boards
- ✅ Edit board metadata (name, description)
- ✅ Reorder boards in navigation

**Timeline**: 1 week (Milestone 2.3)

**MVP Requirement**: Users can organize at least 10 boards easily.

---

#### 6. Two-Switch Scanning (P1 - Important)

**Why important**: Two-switch scanning is 30-50% faster than single-switch automatic scanning for users who can operate two switches.

**Features needed**:
- ✅ Two-switch mode (Switch 1 = advance, Switch 2 = select)
- ✅ Keyboard mapping (e.g., Space = advance, Enter = select)
- ✅ Settings toggle (single-switch vs. two-switch)
- ✅ Instructions in Settings

**Timeline**: 1 week (Milestone 1.2)

**MVP Requirement**: Users with two-switch capability should have faster access.

---

#### 7. Enhanced Accessibility (P1 - Important)

**Why important**: Current accessibility is baseline. Power users need more control.

**Features needed**:
- ✅ Dwell time activation (hover to activate)
- ✅ Configurable button sizes (small, medium, large, XL)
- ✅ Row-column scanning (alternative scan pattern)
- ✅ Auditory feedback (beep on scan, click on select) - optional
- ✅ High contrast mode
- ✅ Reduced motion mode (respects prefers-reduced-motion)

**Timeline**: 1-2 weeks (Milestone 1.3)

**MVP Requirement**: WCAG 2.1 Level AAA for motor accessibility.

---

### 📅 Post-MVP (v2.0+)

These features are valuable but not required for initial launch:

| Feature | Priority | Timeline | Notes |
|---------|----------|----------|-------|
| Cloud sync (multi-device) | P1 | v2.0 | Important but complex (backend needed) |
| Word prediction | P1 | v2.0 | Nice-to-have, not critical for MVP |
| Custom audio recordings | P2 | v2.1 | Can use TTS for MVP |
| Enhanced voices (premium) | P2 | v2.1 | Web Speech API is sufficient for MVP |
| Usage analytics | P2 | v2.2 | Privacy concerns, defer |
| Board sharing community | P2 | v2.3 | Requires moderation |
| Multilingual support | P3 | v3.0 | English-only for MVP |
| Offline PWA | P1 | v2.0 | Nice-to-have, not critical |

---

## MVP Development Plan

### Sprint 2: Custom Boards & Images (3 weeks)

**Goal**: Enable users to create personalized boards with photos

**Deliverables**:
1. Board creation UI (name, grid size)
2. Button editor (label, vocalization, color)
3. Image upload (from device)
4. Camera integration (mobile)
5. Image cropping/resizing
6. Save to localStorage
7. Navigation to custom boards

**Success Criteria**:
- User can create a custom "Family" board with 6-12 photos in <10 minutes
- Images display correctly on buttons
- Custom boards persist across page reloads

---

### Sprint 3: Import/Export & Content (2 weeks)

**Goal**: Data preservation and expanded vocabulary

**Deliverables**:
1. Export board as OBF JSON
2. Import board from JSON
3. Backup all boards (ZIP download)
4. Create 10-12 new default boards
5. Add 200+ new phrases (basic needs, emotions, questions, romantic, daily, emergency)
6. Board library UI (list, search, delete)

**Success Criteria**:
- User can export/import boards without data loss
- Users have access to 15-20 comprehensive boards
- Board library is navigable and organized

---

### Sprint 4: Enhanced Accessibility (2 weeks)

**Goal**: Advanced motor accessibility features

**Deliverables**:
1. Two-switch scanning
2. Row-column scan pattern
3. Dwell time activation
4. Configurable button sizes
5. High contrast mode
6. Reduced motion support
7. Auditory feedback (optional)

**Success Criteria**:
- Two-switch users can communicate 30% faster
- Dwell activation works without mouse clicks
- Pass WCAG 2.1 Level AAA for motor accessibility

---

### Sprint 5: Polish & Testing (2 weeks)

**Goal**: Production-ready MVP

**Deliverables**:
1. User testing with 5-10 real users (motor-impaired if possible)
2. Bug fixes from testing
3. Performance optimization (bundle size, load time)
4. Documentation (user guide, video tutorial)
5. Accessibility audit (automated + manual)
6. Deploy to production (Vercel)

**Success Criteria**:
- 0 critical bugs
- <3 second load time
- <500KB bundle size
- 90%+ user satisfaction in testing
- All WCAG 2.1 Level AA criteria met

---

## MVP vs. Competitors

| Feature | LoveWords MVP | Proloquo2Go | TouchChat | CBoard | LetMeTalk |
|---------|---------------|-------------|-----------|--------|-----------|
| **Price** | **FREE** | $150 | $300 | FREE | FREE |
| **Custom boards** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Photo upload** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Switch scanning** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Two-switch mode** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Import/Export** | ✅ OBF | ✅ | ✅ | ❌ | ❌ |
| **Relationship focus** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Adult vocabulary** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Cloud sync** | ❌ (v2.0) | ✅ | ✅ | ❌ | ❌ |
| **Word prediction** | ❌ (v2.0) | ✅ | ✅ | ❌ | ❌ |

**Competitive Positioning**: LoveWords MVP will be the ONLY free AAC app with:
1. Switch scanning (motor accessibility)
2. Custom boards with photo upload
3. Relationship-focused vocabulary for adults
4. Import/export (data portability)

This creates a strong niche: **free AAC for adults in relationships who need motor accessibility**.

---

## Success Metrics (MVP Launch)

### Acquisition
- 100+ users in first month
- 50% from AAC forums/communities (Reddit, Facebook groups)
- 30% from ALS/CP support organizations
- 20% organic (search, referrals)

### Activation
- 70%+ of users create at least one custom board
- 50%+ upload at least one photo
- 30%+ enable switch scanning

### Retention
- 40%+ return after 1 week
- 25%+ return after 1 month
- 15%+ use daily

### Satisfaction
- 80%+ user satisfaction (survey)
- <10 critical bug reports per month
- 5+ positive testimonials

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Users lose custom boards (browser cache cleared)** | High | Critical | Implement export/import ASAP, educate users to backup regularly |
| **Performance issues with large custom boards** | Medium | High | Optimize rendering, lazy-load images, test with 50+ button boards |
| **Switch scanning too slow/frustrating** | Medium | High | User testing, adjust defaults, offer two-switch mode |
| **Lack of real users for testing** | High | Medium | Recruit via ALS Association, CP Foundation, Reddit r/AAC |
| **Photo upload doesn't work on iOS Safari** | Low | High | Test thoroughly on iOS, provide fallback (icon library) |
| **OBF import breaks on invalid files** | Medium | Medium | Robust validation, clear error messages, preview before import |

---

## Go/No-Go Decision

**MVP is ready to launch when**:
- ✅ Users can create custom boards with photos
- ✅ Switch scanning works reliably
- ✅ Import/export works for data preservation
- ✅ 15+ boards with 300+ phrases available
- ✅ Passes WCAG 2.1 Level AA
- ✅ 5+ successful user tests
- ✅ 0 critical bugs, <5 known bugs
- ✅ Documentation complete (user guide, video)

**Estimated Launch Date**: April 2026 (3 months from now)

---

## Post-MVP Roadmap

After MVP launch, prioritize:

1. **Cloud Sync** (v2.0) - Most requested feature, enables multi-device usage
2. **Word Prediction** (v2.0) - Speeds up communication significantly
3. **PWA (Offline Support)** (v2.0) - Works without internet
4. **Board Sharing Community** (v2.1) - User-generated content
5. **Enhanced Voices** (v2.1) - Premium TTS (ElevenLabs, Google Cloud)
6. **Multilingual Support** (v3.0) - Expand to Spanish, French, German

---

## Conclusion

**Current State**: Strong foundation (v0.2) with switch scanning working.

**Path to MVP**: 3-4 months of focused development on:
1. Custom board creation + photo upload
2. Import/export for data preservation
3. Expanded board content (15-20 boards, 300+ phrases)
4. Enhanced accessibility (two-switch, dwell, row-column)
5. User testing + polish

**Competitive Advantage**: Only free AAC app combining motor accessibility, customization, and adult relationship focus.

**Launch Target**: April 2026

---

**Next Steps**:
1. Start Sprint 2 (Custom Boards) this week
2. Recruit user testers (ALS/CP communities)
3. Create detailed Sprint 2 task breakdown
4. Begin board content creation (10-12 new boards)

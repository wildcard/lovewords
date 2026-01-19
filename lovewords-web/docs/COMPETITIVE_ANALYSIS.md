# LoveWords Competitive Analysis & Product Research

**Date**: January 2026
**Purpose**: Comprehensive competitive landscape research, gap analysis, and feature discovery for LoveWords

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Overview](#market-overview)
3. [Competitive Landscape](#competitive-landscape)
4. [Feature Comparison Matrix](#feature-comparison-matrix)
5. [User Needs & Pain Points](#user-needs--pain-points)
6. [Gap Analysis](#gap-analysis)
7. [Feature Discovery](#feature-discovery)
8. [Market Positioning](#market-positioning)

---

## Executive Summary

**Key Findings:**

- AAC market is dominated by expensive premium apps ($150-$300) with limited free alternatives
- Users face significant pain points: affordability, speed of communication, lack of personalization for adults
- Switch scanning and motor accessibility features are critical for users with physical disabilities
- Open source solutions (CBoard, Otsimo AAC) exist but lack polish and relationship-focused content
- **LoveWords opportunity**: Fill the gap as a free, relationship-focused, accessible AAC tool

**LoveWords Strengths:**
- ✅ Free and open source (CC BY-SA 4.0)
- ✅ Relationship and affection-focused vocabulary (unique niche)
- ✅ Modern web-based (works on all devices)
- ✅ Strong accessibility foundation (WCAG 2.1 Level AA)
- ✅ Open Board Format compliant (interoperable)

**Critical Gaps to Address:**
- ❌ No switch scanning support (critical for motor impairments)
- ❌ Limited customization (can't add custom boards/phrases)
- ❌ No cloud sync across devices
- ❌ No AI-powered word prediction
- ❌ Limited voice options (depends on browser)
- ❌ No data tracking for caregivers/therapists

---

## Market Overview

### Market Size & Segments

The AAC market spans from low-tech picture boards ($30) to high-tech speech-generating devices ($7,000+), with mobile apps offering mid-range solutions ($0-$300).

**Primary User Segments:**
1. **Children with autism** (largest segment)
2. **Adults with aphasia** (stroke, brain injury)
3. **ALS/MND patients** (progressive motor impairment)
4. **Cerebral palsy** (motor and speech challenges)
5. **Non-verbal adults** (including relationship communication needs) ← **LoveWords focus**

### Pricing Tiers

| Tier | Price Range | Examples | Limitations |
|------|-------------|----------|-------------|
| **Free** | $0 | LetMeTalk, Speech Assistant AAC, Grid Player, CBoard | Limited features, ads, or basic functionality |
| **Budget** | $30-$100 | TalkTablet, Avaz Lite | Fewer customization options |
| **Mid-Range** | $150-$200 | TouchChat HD ($149.99) | Good features but still expensive |
| **Premium** | $250-$300 | Proloquo2Go ($249), TouchChat w/ WordPower ($299.99) | Full features but prohibitive cost |
| **Enterprise** | $7,000+ | Dedicated AAC devices (Tobii Dynavox) | Hospital/clinic use |

**LoveWords Position**: Free tier with premium features (target mid-range quality at $0 cost)

---

## Competitive Landscape

### Premium Apps (Direct Competitors)

#### 1. Proloquo2Go ($249)
**Vendor**: AssistiveWare
**Strengths:**
- 27,000+ symbols library
- 100+ natural-sounding voices (including children's voices)
- Core vocabulary with motor planning focus
- Switch scanning support (single and dual switch)
- Research-backed design
- Bilingual support with mid-sentence language switching

**Weaknesses:**
- Very expensive ($249 one-time)
- iOS only (platform lock-in)
- Not relationship-focused (generic vocabulary)
- Steep learning curve

**Market Position**: Industry leader for children with autism

---

#### 2. TouchChat HD ($149.99-$299.99)
**Vendor**: PRC-Saltillo
**Strengths:**
- Highly customizable vocabularies
- Symbol and text-based communication
- 30-day risk-free trial
- Simpler interface than Proloquo2Go
- Family sharing features

**Weaknesses:**
- Still expensive ($149.99+)
- Less polished than Proloquo2Go
- Customization can be overwhelming
- Limited free version

**Market Position**: Budget-friendly alternative to Proloquo2Go

---

#### 3. CoughDrop (Subscription)
**Vendor**: CoughDrop
**Strengths:**
- Cloud-based sync across devices (iPad, phone, computer)
- Affordable monthly pricing
- Built-in data tracking for therapists
- Family-friendly management tools
- Multi-device access

**Weaknesses:**
- Subscription model (ongoing cost)
- Requires internet for sync
- Less comprehensive symbol library
- Generic vocabulary sets

**Market Position**: Best for multi-device families

---

### Free/Open Source Apps (Indirect Competitors)

#### 4. CBoard (Web-based, Open Source)
**Vendor**: UNICEF Innovation Fund
**Strengths:**
- Completely free, open source
- Web-based (works on all devices)
- Multilingual support
- Modern browser APIs
- Offline capable

**Weaknesses:**
- Generic vocabulary (not relationship-focused)
- Basic UI/UX
- Limited customization
- No advanced features (switch scanning, AI prediction)

**Market Position**: Best free option for basic needs

---

#### 5. LetMeTalk (Free)
**Strengths:**
- Completely free
- 9,000+ symbols from ARASAAC
- Works offline
- Simple interface

**Weaknesses:**
- Very basic features
- Limited customization
- No advanced accessibility (switch scanning)
- Generic vocabulary

**Market Position**: Entry-level free option

---

#### 6. Grid Player (Free)
**Strengths:**
- Free AAC app
- Sentence building
- Text-to-speech
- Available on iOS/Android

**Weaknesses:**
- Basic feature set
- Generic vocabulary
- Limited customization
- No relationship focus

**Market Position**: Simple free alternative

---

### Other Notable Apps

| App | Price | Key Feature | Weakness |
|-----|-------|-------------|----------|
| **Speech Assistant AAC** | Free | Text-to-speech for aphasia | Text-only (no symbols) |
| **TalkTablet PRO** | ~$100 | Multilingual | Expensive for basic features |
| **Proloquo4Text** | $119.99 | Typing-based (for literate users) | Not symbol-based |
| **Avaz Pro** | ~$150 | AI prediction | Expensive, Android-focused |
| **Alexicom AAC** | Free | Simple interface | Very limited features |

---

## Feature Comparison Matrix

| Feature | Proloquo2Go | TouchChat | CoughDrop | CBoard | LetMeTalk | **LoveWords** |
|---------|-------------|-----------|-----------|--------|-----------|---------------|
| **Pricing** | $249 | $149.99 | Subscription | Free | Free | **Free** |
| **Platform** | iOS only | iOS/Android | Multi-device | Web | iOS/Android | **Web (all)** |
| **Symbol Library** | 27,000+ | 10,000+ | Varies | Varies | 9,000+ | **Focused set** |
| **Custom Symbols** | ✅ | ✅ | ✅ | ✅ | ❌ | **❌ (gap)** |
| **Voice Options** | 100+ | 40+ | 30+ | Browser TTS | Browser TTS | **Browser TTS** |
| **Switch Scanning** | ✅ | ✅ | ✅ | ❌ | ❌ | **❌ (critical gap)** |
| **Word Prediction** | ✅ AI | ✅ | ✅ | ❌ | ❌ | **❌ (gap)** |
| **Cloud Sync** | iCloud | Optional | ✅ | ❌ | ❌ | **❌ (gap)** |
| **Offline Mode** | ✅ | ✅ | ⚠️ | ✅ | ✅ | **✅** |
| **Customization** | High | High | Medium | Medium | Low | **Low (gap)** |
| **Data Tracking** | ✅ | ✅ | ✅ | ❌ | ❌ | **❌ (gap)** |
| **Multilingual** | ✅ | ✅ | ✅ | ✅ | ❌ | **❌ (gap)** |
| **Relationship Focus** | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ (unique)** |
| **Open Source** | ❌ | ❌ | ❌ | ✅ | ❌ | **✅** |
| **Accessibility** | Excellent | Good | Good | Basic | Basic | **Excellent** |

**Legend:**
✅ = Supported | ⚠️ = Partial | ❌ = Not supported

---

## User Needs & Pain Points

### Research-Backed User Needs

Based on AAC user research, users need AAC systems that provide:

1. **Input Flexibility**: Multiple access methods (touch, switch, eye gaze, head tracking)
2. **Output Flexibility**: Natural voices, customizable speech parameters
3. **Selecting/Adapting AAC**: Easy vocabulary selection and modification
4. **Contexts for Use**: Support for multiple communication contexts (home, work, intimate relationships)
5. **Benefits**: Clear value proposition (speed, expressiveness, personalization)
6. **Access as Adult**: Not just child-focused design
7. **Control of Communication**: User agency over vocabulary and expression

### Top 10 Pain Points

| Pain Point | Frequency | Impact | LoveWords Addresses? |
|------------|-----------|--------|---------------------|
| **1. Affordability** | 10/10 users | Critical | ✅ Yes (free) |
| **2. Platform Lock-in** | 4/10 users | High | ✅ Yes (web-based) |
| **3. Speed of Communication** | High | Critical | ⚠️ Partial (needs prediction) |
| **4. Lack of Personalization** | High | High | ⚠️ Partial (can't customize yet) |
| **5. Adult User Neglect** | High | Critical | ✅ Yes (adult-focused) |
| **6. Generic Vocabulary** | Medium | Medium | ✅ Yes (relationship-focused) |
| **7. Low-Quality Speech** | Medium | Medium | ⚠️ Depends on browser |
| **8. Difficulty Finding Words** | Medium | High | ⚠️ Needs prediction |
| **9. No Personality/Humor** | Medium | Medium | ✅ Yes (warmth extensions) |
| **10. Feature Fragmentation** | 3/10 users | Medium | ✅ Yes (all-in-one) |

### Critical User Quotes

> "Affordability plays an important role in choosing an AAC application, with most participants (10) speaking explicitly about this pain point."

> "As many of these tools are created with children in mind, autistic adults are often neglected in the design of AAC tools to begin with."

> "Three participants said that consolidating features from various apps into a single platform would make things more convenient."

> "Past participants mentioned a tendency for AAC devices to be too focused on needs rather than other topics of conversation or lack personality/humor."

---

## Gap Analysis

### What LoveWords Does Well (Competitive Advantages)

| Strength | vs. Premium Apps | vs. Free Apps | Strategic Value |
|----------|------------------|---------------|-----------------|
| **Free & Open Source** | Saves users $150-$300 | Equal | ⭐⭐⭐⭐⭐ High adoption potential |
| **Relationship-Focused** | Unique niche | Unique niche | ⭐⭐⭐⭐⭐ Unmet market need |
| **Web-Based** | More accessible | Better than mobile-only | ⭐⭐⭐⭐ No platform lock-in |
| **WCAG AA Compliant** | On par with best | Better than most | ⭐⭐⭐⭐ Professional quality |
| **OBF Standard** | On par | Better interoperability | ⭐⭐⭐ Future-proof |
| **Privacy-First** | Better (no cloud tracking) | Equal | ⭐⭐⭐ Trust builder |
| **Modern Tech Stack** | More maintainable | Better DX | ⭐⭐⭐ Long-term viability |

### Critical Gaps (Must-Have Features)

#### 1. **Switch Scanning Support** ⚠️ **CRITICAL**
**Impact**: Excludes users with motor impairments (ALS, CP, quadriplegia)
**Competitor Status**: All premium apps support this, free apps don't
**Priority**: **P0 - Blocker for key user segment**

**Required Features:**
- Single-switch automatic scanning
- Single-switch step scanning
- Two-switch scanning (stepper + picker)
- Configurable scan patterns (linear, row-column, snake)
- Scan speed adjustment
- Visual/auditory feedback
- Screen touch as switch option
- External switch support (via keyboard mapping)

**Estimated Effort**: 2-3 weeks (medium complexity)

---

#### 2. **Custom Board Creation** ⚠️ **HIGH PRIORITY**
**Impact**: Users can't personalize vocabulary for their relationships
**Competitor Status**: All premium apps support, some free apps support
**Priority**: **P0 - Core value proposition**

**Required Features:**
- Create custom boards in-app
- Add custom buttons with labels/vocalizations
- Upload custom images
- Record custom audio
- Edit existing boards
- Import/export OBF files
- Share boards with community

**Estimated Effort**: 3-4 weeks (high complexity)

---

#### 3. **Word Prediction / AI Assistance** ⚠️ **MEDIUM PRIORITY**
**Impact**: Slower communication vs. premium apps
**Competitor Status**: Most premium apps have this, free apps don't
**Priority**: **P1 - Competitive parity**

**Required Features:**
- Next-word prediction based on usage patterns
- Phrase completion suggestions
- Learning from user patterns
- Context-aware suggestions (board-specific)
- AI-powered "complete my thought" (optional advanced feature)

**Estimated Effort**: 4-6 weeks (AI integration complexity)

---

#### 4. **Enhanced Voice Options** ⚠️ **MEDIUM PRIORITY**
**Impact**: Limited to browser TTS (quality varies)
**Competitor Status**: Premium apps have 40-100+ voices
**Priority**: **P1 - Quality improvement**

**Options:**
- **Option A**: Integrate cloud TTS API (Google, Azure, AWS) - requires API keys
- **Option B**: Partner with open source TTS (Mozilla TTS, Coqui)
- **Option C**: Allow users to provide their own API keys (privacy-preserving)

**Estimated Effort**: 2-3 weeks (integration)

---

#### 5. **Cloud Sync & Multi-Device** ⚠️ **LOW-MEDIUM PRIORITY**
**Impact**: Settings don't sync across devices
**Competitor Status**: CoughDrop's key differentiator
**Priority**: **P2 - Nice to have**

**Required Features:**
- Optional account creation (email or anonymous ID)
- Sync settings, custom boards, usage data
- Work offline, sync when online
- Privacy-first (encrypted, user-controlled)

**Estimated Effort**: 3-4 weeks (backend infrastructure)

---

#### 6. **Usage Data Tracking (for caregivers)** ⚠️ **LOW PRIORITY**
**Impact**: Therapists/families can't track progress
**Competitor Status**: Premium apps have this
**Priority**: **P2 - Therapeutic value**

**Required Features:**
- Track most-used words/phrases
- Communication frequency reports
- Export data for therapists
- Privacy controls (opt-in, user consent)

**Estimated Effort**: 2-3 weeks

---

### Nice-to-Have Features (Competitive Extras)

| Feature | Value | Effort | Priority |
|---------|-------|--------|----------|
| Multilingual Support | High | High | P2 |
| Eye Gaze Integration | Medium | Very High | P3 |
| Head Tracking | Medium | Very High | P3 |
| Grammar Prediction | Medium | High | P2 |
| Board Themes (visual styles) | Low | Low | P3 |
| Social Media Integration | Low | Medium | P3 |
| Video Call Integration | Medium | High | P3 |

---

## Feature Discovery

### Phase 1: Essential Accessibility (0-3 months)
**Goal**: Make LoveWords accessible to users with motor impairments

**Features:**
1. **Switch Scanning Mode**
   - Single-switch automatic scanning
   - Single-switch step scanning
   - Two-switch scanning
   - Configurable scan speed and patterns
   - Visual/auditory feedback

2. **Enhanced Keyboard Navigation**
   - Keyboard-only operation (already good)
   - Customizable keyboard shortcuts
   - Keyboard mapping for external switches

3. **Motor Accessibility Settings**
   - Dwell time adjustment (hold to activate)
   - Touch target size options
   - Reduce motion option
   - Sticky keys support

**Success Metrics:**
- Switch users can navigate and communicate
- Pass WCAG 2.1 Level AAA for motor accessibility
- User testing with CP/ALS patients successful

---

### Phase 2: Personalization & Customization (3-6 months)
**Goal**: Enable users to create vocabulary that fits their relationships

**Features:**
1. **Custom Board Builder**
   - In-app board creation interface
   - Add/edit/delete buttons
   - Upload custom images (photos)
   - Record custom vocalizations
   - Organize boards into categories

2. **Board Import/Export**
   - Import OBF files from other apps
   - Export boards to share with partners
   - Community board library (optional)

3. **Advanced Customization**
   - Custom color schemes
   - Button size preferences
   - Grid layout options (3x3, 4x4, 5x4, 6x6)
   - Label font size and style

**Success Metrics:**
- Users create at least 1 custom board within first week
- 30%+ of active users have custom boards
- Boards shared with partners/family

---

### Phase 3: Intelligence & Speed (6-9 months)
**Goal**: Speed up communication with AI assistance

**Features:**
1. **Word Prediction**
   - Next-word suggestions (2-3 options)
   - Learning from user patterns
   - Context-aware (board-specific predictions)
   - Disable option for users who don't want it

2. **Phrase Completion**
   - Auto-complete common phrases
   - "I love..." → suggestions: "you", "you so much", "spending time with you"
   - User-trained patterns

3. **Smart Search**
   - Quick search across all boards
   - Fuzzy matching ("luv" → "love")
   - Recents and favorites

**Success Metrics:**
- 30% reduction in taps to communicate common phrases
- User satisfaction with predictions >70%
- Opt-in rate for AI features >50%

---

### Phase 4: Advanced Features (9-12 months)
**Goal**: Competitive parity with premium apps

**Features:**
1. **Enhanced Voice Options**
   - Cloud TTS integration (Google/Azure/AWS)
   - User-provided API keys (privacy option)
   - Voice recording (use your own voice)
   - Voice banking for ALS patients

2. **Cloud Sync (Optional)**
   - Anonymous account (no email required)
   - Sync settings, boards, favorites
   - Multi-device support
   - End-to-end encryption

3. **Usage Analytics (Opt-in)**
   - Communication frequency tracking
   - Most-used words/phrases
   - Export reports for therapists
   - Privacy-first (user controls all data)

**Success Metrics:**
- 20% of users enable cloud sync
- 10% of users integrate custom TTS
- Usage data helps users/therapists track progress

---

### Phase 5: Community & Ecosystem (12+ months)
**Goal**: Build a community around LoveWords

**Features:**
1. **Board Sharing Platform**
   - User-submitted boards
   - Ratings and reviews
   - Categories (romantic, playful, daily needs)
   - Curated collections

2. **Multilingual Expansion**
   - Spanish translation
   - French translation
   - Community-contributed translations
   - RTL language support (Arabic, Hebrew)

3. **Caregiver Portal (Optional)**
   - Family/therapist accounts
   - Progress tracking dashboard
   - Communication insights
   - Privacy controls (user consent required)

**Success Metrics:**
- 100+ community-created boards
- 5+ languages supported
- Active contributor community

---

## Market Positioning

### Target User Personas

#### Persona 1: "Emma" - Young Adult with Cerebral Palsy
**Demographics:**
- Age: 28
- Condition: Cerebral palsy with motor speech disorder
- Living: With romantic partner
- Tech: Uses iPad with switch access

**Needs:**
- Express love and affection to partner
- Switch scanning support (can't use touchscreen)
- Affordable (on disability income)
- Privacy (intimate communication)

**LoveWords Fit:**
- ✅ Free (no $250 cost barrier)
- ⚠️ Needs switch scanning (gap to fill)
- ✅ Relationship-focused vocabulary
- ✅ Privacy-first (no cloud tracking)

**Priority**: **HIGH** (once switch scanning added)

---

#### Persona 2: "Marcus" - Adult with Aphasia
**Demographics:**
- Age: 52
- Condition: Aphasia from stroke
- Living: Married, 2 adult children
- Tech: Uses smartphone and laptop

**Needs:**
- Rebuild communication with spouse
- Adult-focused (not children's vocabulary)
- Multi-device access
- Simple interface (cognitive fatigue)

**LoveWords Fit:**
- ✅ Adult-focused, relationship vocabulary
- ✅ Web-based (works on all devices)
- ⚠️ Needs cloud sync (gap)
- ✅ Simple, uncluttered interface

**Priority**: **MEDIUM** (good fit now, better with sync)

---

#### Persona 3: "David" - ALS Patient
**Demographics:**
- Age: 45
- Condition: ALS (progressive motor impairment)
- Living: With partner and teenage kids
- Tech: Currently uses eye gaze, will need switch access soon

**Needs:**
- Express love before losing ability
- Switch access (as motor function declines)
- Voice banking (preserve his voice)
- Fast communication (time-sensitive)

**LoveWords Fit:**
- ✅ Relationship-focused vocabulary (express love to family)
- ⚠️ Needs switch scanning (critical gap)
- ⚠️ Needs voice banking (advanced feature)
- ⚠️ Needs word prediction (speed critical)

**Priority**: **MEDIUM-HIGH** (after switch scanning + prediction)

---

#### Persona 4: "Sarah" - Autistic Adult
**Demographics:**
- Age: 30
- Condition: Autism, non-verbal
- Living: In relationship, lives independently
- Tech: Uses iPad and Android phone

**Needs:**
- Express emotions in romantic relationship
- Customizable (her own phrases/photos)
- Works on multiple devices
- Affordable (freelance income)

**LoveWords Fit:**
- ✅ Free and accessible
- ✅ Relationship-focused
- ⚠️ Needs custom board creation (gap)
- ✅ Web-based (works on both devices)

**Priority**: **HIGH** (after custom boards)

---

### Competitive Positioning Statement

**For** non-verbal adults in romantic relationships
**Who need** to express love, affection, and intimate communication
**LoveWords is** a free, web-based AAC communication tool
**That** focuses specifically on relationship vocabulary
**Unlike** generic AAC apps costing $150-$300
**LoveWords** is free, relationship-focused, privacy-first, and works on any device.

---

### Differentiation Matrix

| Attribute | Proloquo2Go | TouchChat | CBoard | LoveWords |
|-----------|-------------|-----------|--------|-----------|
| **Price** | $249 | $149.99 | Free | **Free** |
| **Focus** | General/children | General | General | **Relationships** ✨ |
| **Platform** | iOS only | iOS/Android | Web | **Web (all)** ✨ |
| **Accessibility** | Excellent | Good | Basic | **Excellent** ✨ |
| **Switch Access** | ✅ | ✅ | ❌ | ⚠️ Roadmap |
| **Customization** | High | High | Medium | ⚠️ Roadmap |
| **Privacy** | Good | Good | Good | **Excellent** ✨ |
| **Open Source** | ❌ | ❌ | ✅ | **✅** ✨ |

**Legend**: ✨ = Competitive advantage

---

## Sources

This competitive analysis is based on the following sources:

- [AAC Apps | Best AAC Apps for Children (2025)](https://www.speechandlanguagekids.com/aac-apps-review/)
- [10 Best AAC Devices for Speech Therapy (2026 SLP Guide)](https://www.speechpathologygraduateprograms.org/blog/top-10-aac-augmentative-and-alternative-communication-devices/)
- [The Best AAC Apps of 2025](https://spokenaac.com/best-aac-apps/)
- [Top 10 Free AAC Apps for Parents and Clinicians](https://www.rori.care/post/top-10-free-aac-apps-for-parents-and-clinicians)
- [Proloquo2Go vs Touchchat AAC - Goally Apps & Tablets for Kids](https://getgoally.com/compare-aac-apps/proloquo2go-vs-touchchat-aac/)
- [AAC Systems - OpenAAC](https://www.openaac.org/aac.html)
- [Cboard AAC | Home - Communication Boards for All](https://www.cboard.io/)
- [Aging Up AAC: An Introspection on Augmentative and Alternative Communication Applications for Autistic Adults](https://arxiv.org/html/2404.17730v3)
- [Challenges and Opportunities in Using Augmentative and Alternative Communication (AAC) Technologies](https://dl.acm.org/doi/10.1145/3369457.3369473)
- [Maximize AAC Device Personalization for Better Communication](https://quicktalkerfreestyle.com/blog/aac-device-personalization/)
- [Using iPad AAC apps with switch access for speech / motor impairments](https://gettecla.com/blogs/news/14011321-using-ipad-aac-apps-with-switch-access-for-speech-and-motor-impairments)
- [AAC Device Access Options - PRC](https://www.prentrom.com/caregivers/aac-device-access-options)
- [Choose a scanning mode and pattern - AssistiveWare](https://www.assistiveware.com/support/proloquo2go/alternative-access/scanning-mode)

---

**Next Steps:**
1. Validate findings with user interviews
2. Prioritize features based on user testing
3. Create detailed product roadmap
4. Begin implementation of P0 features (switch scanning, custom boards)

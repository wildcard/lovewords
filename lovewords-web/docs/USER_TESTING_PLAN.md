# LoveWords User Testing Plan

**Version**: 1.0
**Last Updated**: January 2026
**Purpose**: Guide user testing, feedback collection, and iterative product improvement

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test User Recruitment](#test-user-recruitment)
3. [Test Scenarios](#test-scenarios)
4. [Testing Protocols](#testing-protocols)
5. [Feedback Collection](#feedback-collection)
6. [Analysis & Iteration](#analysis--iteration)

---

## Testing Philosophy

### Core Principles

1. **Users First**: Test with real AAC users, not proxies (developers, family members)
2. **Accessibility Testing**: Include users with diverse motor, visual, and cognitive abilities
3. **Iterative**: Test early, test often, incorporate feedback quickly
4. **Ethical**: Obtain informed consent, respect privacy, compensate participants
5. **Inclusive**: Recruit diverse participants (age, gender, condition, tech proficiency)

### Testing Cadence

| Phase | Testing Frequency | Participants per Round | Focus |
|-------|-------------------|------------------------|-------|
| **Phase 1** (Accessibility) | Every 2 weeks | 3-5 | Switch scanning, motor accessibility |
| **Phase 2** (Customization) | Monthly | 5-8 | Custom board creation, usability |
| **Phase 3** (Intelligence) | Monthly | 5-10 | Word prediction, search |
| **Phase 4+** | Quarterly | 10-15 | Full feature testing, satisfaction |

---

## Test User Recruitment

### Target User Segments

Based on our competitive analysis, we need to recruit from these segments:

#### Primary Segment 1: **Motor-Impaired Users** (Priority: HIGH)
**Conditions**: Cerebral palsy, ALS, quadriplegia, muscular dystrophy
**Why**: Critical for switch scanning validation
**Recruitment Goal**: 5 users for Phase 1 testing

**Recruitment Channels**:
- ALS Association chapters
- Cerebral Palsy Foundation
- United Spinal Association
- SLP clinics (partner for referrals)
- Reddit: r/disability, r/cerebralpalsy
- Facebook groups: AAC support groups

**Screening Criteria**:
- Uses or needs AAC for communication
- Has motor impairment affecting touchscreen use
- Willing to test switch access (or currently uses switches)
- Age 18+ (adults only for relationship focus)
- Able to participate in 60-min remote session

---

#### Primary Segment 2: **Adults with Aphasia** (Priority: MEDIUM)
**Conditions**: Stroke, traumatic brain injury, progressive aphasia
**Why**: Test usability for cognitive + speech challenges
**Recruitment Goal**: 3 users for Phase 2 testing

**Recruitment Channels**:
- National Aphasia Association
- Stroke support groups
- Rehabilitation centers
- SLP referrals
- Aphasia community centers

**Screening Criteria**:
- Aphasia diagnosis (any severity)
- Age 18+
- Interested in relationship communication
- Has smartphone or computer access
- Willing to test 30-45 min

---

#### Primary Segment 3: **Autistic Adults** (Priority: MEDIUM)
**Conditions**: Autism, selective mutism (non-verbal or limited verbal)
**Why**: Test customization, personalization features
**Recruitment Goal**: 5 users for Phase 2-3 testing

**Recruitment Channels**:
- Autistic Self Advocacy Network (ASAN)
- Reddit: r/autism, r/autismtranslated
- Twitter: #ActuallyAutistic
- Autism support groups
- AAC user forums

**Screening Criteria**:
- Autistic adult (self-identified)
- Uses or interested in AAC
- Age 18+
- In or interested in romantic relationships
- Willing to provide feedback on customization

---

#### Secondary Segment: **Caregivers/Partners** (Priority: LOW)
**Role**: Family members, romantic partners, SLPs
**Why**: Understand caregiver needs, get proxy feedback
**Recruitment Goal**: 3 caregivers for Phase 4 testing

**Recruitment Channels**:
- Caregiver support groups
- SLP networks
- Partner referrals from primary users

---

### Recruitment Strategy

#### Step 1: Outreach (Weeks 1-2)
**Actions**:
- Post recruitment messages on forums/social media
- Email SLP organizations for referrals
- Contact disability advocacy groups
- Offer referral incentive ($25 Amazon gift card for successful referrals)

**Recruitment Message Template**:
```
Subject: Help Test Free AAC App for Relationship Communication

We're developing LoveWords, a free AAC (communication) app focused on
expressing love, affection, and emotions in relationships. We need your
help testing it!

We're looking for adults who:
- Use or need AAC for communication
- Are in or interested in romantic relationships
- Want to help improve free accessibility tools

Testing involves:
- 30-60 minute remote video call
- Try the app and share your thoughts
- $50 Amazon gift card as thank you

Interested? Reply to this message or fill out this form: [link]

LoveWords is free, open source, and privacy-focused.
Learn more: https://lovewords-web.vercel.app/
```

#### Step 2: Screening (Weeks 2-3)
**Screening Form Questions**:
1. What is your age? (must be 18+)
2. Do you use or need AAC for communication? (yes/no)
3. What condition or disability affects your speech? (open-ended)
4. Do you have motor impairments that affect touchscreen use? (yes/no)
5. If yes, do you currently use switches or other assistive tech? (describe)
6. Are you in a romantic relationship or interested in expressing affection? (yes/no)
7. What devices do you use? (smartphone, tablet, computer)
8. Have you used AAC apps before? Which ones? (open-ended)
9. What's your biggest challenge with current AAC apps? (open-ended)
10. Can you participate in a 60-minute video call? (yes/no)
11. Contact info (email, phone)

**Selection Criteria**:
- Prioritize users with motor impairments for Phase 1
- Diverse conditions (CP, ALS, autism, aphasia)
- Mix of AAC experience (novice to expert)
- Age diversity (18-70+)
- Gender diversity

#### Step 3: Scheduling (Week 3)
- Email selected participants
- Schedule 60-min Zoom sessions
- Send calendar invite with:
  - Meeting link
  - Brief overview of what to expect
  - Test environment setup instructions (install Chrome/Safari)
  - Contact info for technical support

#### Step 4: Pre-Test Prep (Week 4)
- Send reminder email 24 hours before session
- Prepare test environment (demo site, backup devices)
- Review test script
- Set up screen recording (with consent)

---

## Test Scenarios

### Phase 1: Switch Scanning & Motor Accessibility

#### Scenario 1.1: First-Time Switch User
**Goal**: Validate that switch scanning is discoverable and usable

**Setup**:
- Participant has motor impairment but no switch experience
- Simulate switch with keyboard (Space = Switch 1, Enter = Switch 2)

**Tasks**:
1. **Discover Switch Scanning**
   - Open Settings
   - Find "Switch Scanning" option
   - Enable it
   - **Success Criteria**: User finds setting within 2 minutes (with hints if needed)

2. **Configure Scan Speed**
   - Adjust scan speed slider
   - Test at slow, medium, fast speeds
   - Choose preferred speed
   - **Success Criteria**: User understands scan speed concept, selects preference

3. **Navigate with Single-Switch Automatic**
   - Navigate to "Love & Affection" board
   - Select "I love you" button with switch
   - Hear it spoken
   - **Success Criteria**: User selects button within 3 attempts

4. **Build Message with Switch**
   - Navigate to "Core Words" board
   - Add "I" to message bar with switch
   - Add "love" to message bar
   - Add "you" to message bar
   - Speak message
   - **Success Criteria**: User builds and speaks message within 5 minutes

**Post-Task Questions**:
- How easy was it to enable switch scanning? (1-5 scale)
- Was the scan speed adjustable enough? (too slow / just right / too fast)
- Did you feel in control of the scanning? (yes/no, explain)
- What was confusing or frustrating?
- Would you use this feature regularly? (yes/no, why?)

---

#### Scenario 1.2: Experienced Switch User
**Goal**: Validate that advanced switch features work for power users

**Setup**:
- Participant currently uses switches with other AAC apps
- Connect real switch device (if available) or use keyboard

**Tasks**:
1. **Two-Switch Scanning**
   - Enable two-switch mode
   - Map Switch 1 (stepper) and Switch 2 (picker)
   - Navigate board using two-switch
   - **Success Criteria**: User navigates faster than single-switch

2. **Row-Column Scanning**
   - Change scan pattern from linear to row-column
   - Navigate board
   - Compare speed to linear scanning
   - **Success Criteria**: User understands difference, has preference

3. **Scan Pattern Comparison**
   - Try linear, row-column, and reverse patterns
   - Rate each pattern (1-5)
   - Choose favorite
   - **Success Criteria**: User can distinguish patterns, express preference

**Post-Task Questions**:
- How does LoveWords switch scanning compare to [other app]? (better/same/worse, why?)
- What scan pattern did you prefer? Why?
- Is anything missing that you need?
- Would you switch to LoveWords from your current app? (yes/no, why?)

---

#### Scenario 1.3: Dwell Time Activation
**Goal**: Test dwell activation for users who can't click/tap

**Setup**:
- Participant has limited fine motor control
- Enable dwell time activation (hover/focus to select)

**Tasks**:
1. **Enable Dwell Activation**
   - Open Settings
   - Enable "Dwell Time" option
   - Set dwell duration (1.5s, 2s, 3s)
   - **Success Criteria**: User enables feature, understands dwell duration

2. **Navigate with Dwell**
   - Hover/focus on button
   - See circular countdown indicator
   - Button activates after dwell time
   - **Success Criteria**: User successfully activates 3+ buttons

3. **Adjust Dwell Duration**
   - Try short (1s), medium (2s), long (3s)
   - Choose preferred duration
   - **Success Criteria**: User finds comfortable dwell time

**Post-Task Questions**:
- Was the visual countdown indicator helpful? (yes/no)
- What dwell time felt most comfortable?
- Would you use this instead of tapping? (yes/no, why?)

---

### Phase 2: Custom Board Creation

#### Scenario 2.1: Create Personal Board
**Goal**: Test usability of custom board builder

**Setup**:
- Participant wants to create board for their romantic partner

**Tasks**:
1. **Create New Board**
   - Click "Create New Board" button
   - Enter board name: "Messages for [Partner Name]"
   - Choose grid size (suggest 4x4)
   - **Success Criteria**: User creates board within 2 minutes

2. **Add Custom Buttons**
   - Add button 1: "I love you, [name]" (custom phrase)
   - Add button 2: "Kiss me" (from template)
   - Add button 3: Upload photo of partner, label "You"
   - **Success Criteria**: User adds 3 buttons within 10 minutes

3. **Record Custom Audio**
   - Record vocalization for "I love you, [name]"
   - Preview audio
   - Save
   - **Success Criteria**: User records and saves audio successfully

4. **Use Custom Board**
   - Navigate to custom board
   - Press custom button
   - Hear custom vocalization
   - **Success Criteria**: Button works as expected, user is satisfied

**Post-Task Questions**:
- How easy was it to create a custom board? (1-5 scale)
- What was the most confusing step?
- Would you create more custom boards? (yes/no)
- Is anything missing from the board builder?

---

#### Scenario 2.2: Import Board from OBF File
**Goal**: Test import functionality and OBF compatibility

**Setup**:
- Provide test OBF file (or user brings their own from Proloquo2Go)

**Tasks**:
1. **Import OBF File**
   - Click "Import Board"
   - Select OBF file
   - Preview board
   - Confirm import
   - **Success Criteria**: Board imports successfully, all buttons work

2. **Edit Imported Board**
   - Change button label
   - Change button color
   - Save changes
   - **Success Criteria**: Edits save successfully

**Post-Task Questions**:
- Did the import work as expected? (yes/no)
- Were there any issues or errors?
- Would you import boards from other apps? (yes/no)

---

### Phase 3: Word Prediction & Intelligence

#### Scenario 3.1: Word Prediction
**Goal**: Validate word prediction accuracy and usefulness

**Setup**:
- Enable word prediction in Settings

**Tasks**:
1. **Use Word Prediction**
   - Type "I" → see predictions: "love", "want", "am"
   - Select "love" → see predictions: "you", "it", "this"
   - Build full sentence with predictions
   - **Success Criteria**: User builds sentence faster than without prediction

2. **Prediction Accuracy**
   - Type 5 common phrases
   - Count how many times prediction was correct
   - **Success Criteria**: >60% prediction accuracy

**Post-Task Questions**:
- Did word prediction speed up communication? (yes/no)
- Were predictions accurate? (1-5 scale)
- Were predictions relevant to relationship communication? (yes/no)

---

#### Scenario 3.2: Smart Search
**Goal**: Test search functionality and findability

**Tasks**:
1. **Search for Phrase**
   - Open search bar
   - Type "hug"
   - See results from all boards
   - Jump to "Hug me" button on board
   - **Success Criteria**: User finds phrase within 10 seconds

2. **Fuzzy Search**
   - Search "luv" → finds "love"
   - Search "kis" → finds "kiss"
   - **Success Criteria**: Fuzzy matching works

**Post-Task Questions**:
- Was search helpful? (yes/no)
- Could you find what you needed? (yes/no)

---

### Phase 4: Full Feature Testing

#### Scenario 4.1: End-to-End Communication Flow
**Goal**: Test full user journey from login to communication

**Tasks**:
1. Open LoveWords on device
2. Navigate to "Love & Affection" board (if not already there)
3. Express affection using 3+ phrases
4. Switch to "Core Words" board
5. Build custom message: "I want to hold your hand"
6. Speak message
7. Create favorite of most-used phrase
8. Change voice settings (speed, pitch)
9. Test speech with new settings

**Success Criteria**:
- User completes all tasks without errors
- User feels confident using the app
- User would recommend to others

**Post-Task Questions**:
- What was your favorite feature?
- What was most frustrating?
- What's missing that you need?
- Would you use this regularly? (yes/no, why?)
- Would you recommend to others? (yes/no, why?)
- How does this compare to other AAC apps you've used?

---

## Testing Protocols

### Remote Testing Setup

**Tools**:
- Zoom (video call)
- Screen sharing (participant shares screen)
- Screen recording (with consent)
- Note-taking template

**Roles**:
- **Facilitator**: Guides participant, asks questions
- **Note-taker**: Records observations, quotes
- **Observer**: Watches silently (optional, max 1)

### Session Structure (60 minutes)

**Introduction (5 min)**
- Welcome participant
- Explain purpose of test
- Obtain informed consent
- Start screen recording (with permission)
- Explain think-aloud protocol

**Background Questions (5 min)**
- Tell us about your communication needs
- What AAC apps/devices do you currently use?
- What works well? What doesn't?
- What would your ideal AAC app do?

**Task Testing (40 min)**
- Walk through scenarios (see above)
- Encourage think-aloud ("What are you thinking?")
- Observe silently, only help if stuck >2 min
- Note body language, facial expressions, tone

**Debrief (10 min)**
- Overall impressions?
- What did you like? Dislike?
- Would you use this? Why or why not?
- Any final thoughts or suggestions?

**Close**
- Thank participant
- Explain next steps (how feedback will be used)
- Send $50 gift card within 48 hours
- Invite to future tests (opt-in)

---

### Think-Aloud Protocol

**Instructions for Participants**:
> "As you use the app, please say out loud what you're thinking. For example:
> - What you're trying to do
> - What you expect to happen
> - What's confusing or surprising
> - What you like or dislike
>
> There are no right or wrong answers. We're testing the app, not you!"

**Prompts for Facilitator**:
- "What are you thinking right now?"
- "What do you expect to happen when you click that?"
- "How do you feel about that?"
- "What would you do next?"

---

### Informed Consent

**Consent Form** (provide before session):

> **LoveWords User Testing Consent Form**
>
> **Purpose**: We're testing the LoveWords app to improve accessibility and usability.
>
> **What you'll do**: Use the app while we observe and ask questions (60 minutes).
>
> **Compensation**: $50 Amazon gift card.
>
> **Privacy**:
> - We will record your screen and voice (with your permission)
> - Recordings are for internal use only (not public)
> - We will not collect personal messages or data
> - You can stop at any time
> - Your name will not be shared publicly
>
> **Risks**: Minimal (potential frustration with app bugs).
>
> **Benefits**: Help improve free AAC tools for the community.
>
> **Contact**: [email]
>
> **Consent**:
> ☐ I agree to participate
> ☐ I agree to screen/voice recording
> ☐ I agree to anonymous quotes in reports
>
> Signature: _______________ Date: ___________

---

## Feedback Collection

### Quantitative Metrics

#### System Usability Scale (SUS)
**Administer after each test session** (1-5 scale: Strongly Disagree to Strongly Agree)

1. I think that I would like to use this app frequently.
2. I found the app unnecessarily complex.
3. I thought the app was easy to use.
4. I think that I would need support to be able to use this app.
5. I found the various functions in this app were well integrated.
6. I thought there was too much inconsistency in this app.
7. I would imagine that most people would learn to use this app very quickly.
8. I found the app very cumbersome to use.
9. I felt very confident using the app.
10. I needed to learn a lot of things before I could get going with this app.

**Scoring**: (Sum of odd items - 5) + (25 - sum of even items) × 2.5
- **>80**: Excellent
- **68-80**: Good
- **50-68**: OK
- **<50**: Poor

---

#### Task Success Metrics
**Track for each scenario**:
- **Task completion rate**: % of users who complete task
- **Time on task**: Average time to complete (seconds)
- **Errors**: Number of wrong taps/actions
- **Assists**: Number of hints needed from facilitator

---

### Qualitative Feedback

#### Open-Ended Questions
**Ask during debrief**:
1. What was your first impression of LoveWords?
2. What did you like most?
3. What frustrated you?
4. What's missing that you need?
5. How does this compare to [other AAC app you use]?
6. Would you use this regularly? Why or why not?
7. Would you recommend this to others? Why or why not?
8. If you could change one thing, what would it be?

#### Observation Notes
**Record during testing**:
- Body language (leaning in = engaged, leaning back = frustrated)
- Facial expressions (smiling, frowning, confusion)
- Tone of voice (excited, annoyed, hesitant)
- Unexpected behaviors (creative workarounds, misunderstandings)
- Quotes (exact words for powerful insights)

---

### Feedback Channels (Ongoing)

#### 1. In-App Feedback
**Location**: "Feedback" button in navigation
**Opens**: GitHub issue template (pre-filled)
**Template**:
```
**What were you trying to do?**
[text field]

**What happened instead?**
[text field]

**How can we improve?**
[text field]

**Your device/browser** (auto-filled)
```

#### 2. GitHub Issues
**Categories** (labels):
- `bug` - Something broken
- `enhancement` - Feature request
- `accessibility` - A11y issue
- `documentation` - Docs unclear
- `question` - Need help

**Triage Weekly**: Prioritize P0-P3

#### 3. User Surveys
**Frequency**: Quarterly
**Tool**: Google Forms (free)
**Questions**:
- How often do you use LoveWords? (daily, weekly, monthly, rarely)
- What features do you use most? (checkboxes)
- What features do you want? (open-ended)
- Overall satisfaction (1-5)
- Would you recommend? (NPS: 0-10)

#### 4. User Interviews
**Frequency**: Monthly (5 users/month)
**Format**: 30-min video call
**Focus**: Deep dive on specific features or pain points

---

## Analysis & Iteration

### Weekly Analysis
**Every Monday**:
1. Review GitHub issues from past week
2. Triage: P0 (blocker), P1 (high), P2 (medium), P3 (low)
3. Assign to sprint if P0 or P1
4. Respond to users (acknowledge, ask clarifying questions)

### Post-Test Analysis
**After each testing round**:
1. **Transcribe recordings** (use Otter.ai or manual)
2. **Calculate metrics**:
   - SUS score (target: >68)
   - Task completion rate (target: >80%)
   - Time on task (compare to baseline)
3. **Thematic analysis**:
   - Group feedback into themes (e.g., "switch scanning too slow", "customization confusing")
   - Count frequency (how many users mentioned each theme?)
   - Prioritize (high frequency + high impact = P0)
4. **Create report** (1-page summary):
   - Key findings
   - Top 3 issues to fix
   - Top 3 features to add
   - Participant quotes
   - Next steps

### Iteration Cycle
**After analysis**:
1. **Create GitHub issues** for top findings
2. **Update roadmap** (re-prioritize if needed)
3. **Fix P0 issues** within 1 sprint (2 weeks)
4. **Communicate changes** to users:
   - Email participants: "We heard you, here's what we fixed"
   - Blog post: "What we learned from user testing"
   - Changelog: "v0.2 - Based on your feedback..."

---

## Success Metrics

### Phase 1 Goals (Switch Scanning)
- ✅ 5 motor-impaired users test successfully
- ✅ SUS score >68 (good usability)
- ✅ Task completion rate >80% (switch scanning)
- ✅ <5 critical bugs reported
- ✅ 3+ users would use regularly

### Phase 2 Goals (Customization)
- ✅ 5 users create custom boards
- ✅ SUS score >70
- ✅ Custom board creation time <15 minutes
- ✅ 80%+ of users would create more boards
- ✅ OBF import works with Proloquo2Go/TouchChat

### Phase 3 Goals (Intelligence)
- ✅ Word prediction accuracy >60%
- ✅ 30%+ reduction in taps to communicate
- ✅ Search findability >90% (users find what they need)
- ✅ SUS score >75

### Overall Goals (All Phases)
- ✅ User retention: 50%+ at 30 days
- ✅ NPS (Net Promoter Score): >30 (good)
- ✅ Accessibility: WCAG 2.1 Level AAA
- ✅ Community growth: 100+ active users by end of Phase 2

---

## Budget

### Participant Compensation
| Phase | Participants | $ per User | Total |
|-------|--------------|------------|-------|
| Phase 1 | 15 | $50 | $750 |
| Phase 2 | 15 | $50 | $750 |
| Phase 3 | 15 | $50 | $750 |
| Phase 4 | 30 | $50 | $1,500 |
| **Total** | 75 | - | **$3,750** |

### Tools
- Zoom: $0 (free tier)
- Screen recording: $0 (built-in or OBS)
- Otter.ai transcription: $0 (free tier) or $10/month
- Google Forms: $0
- GitHub: $0

**Total Tools Cost**: $0-$120/year

---

## Appendix

### Sample Recruitment Email

**Subject**: Help Test Free AAC App - $50 Gift Card

Hi [Name],

We're building LoveWords, a free AAC app focused on relationship communication. We need your expertise!

**What**: Test the app and share your feedback (60 min)
**When**: [Date/time options]
**Where**: Remote (Zoom video call)
**Compensation**: $50 Amazon gift card

**Looking for**:
- Adults (18+) who use or need AAC
- Especially users with motor impairments (for switch scanning testing)
- Interested in expressing affection in relationships

Interested? Reply to this email or schedule here: [link]

Learn more about LoveWords: https://lovewords-web.vercel.app/

Thanks!
[Your name]

---

### Sample Test Notes Template

```
## LoveWords User Test - [Date]

**Participant**: P[number] (anonymous)
**Condition**: [CP, ALS, autism, aphasia, etc.]
**AAC Experience**: [novice, intermediate, expert]
**Duration**: [actual time]

### Background
- Current AAC: [app/device]
- Relationship status: [in relationship, single, married, etc.]
- Biggest challenge: [quote]

### Scenario 1: [Name]
- Task completion: [yes/no]
- Time: [seconds]
- Errors: [count]
- Assists: [count]
- Quote: "[what they said]"

### Scenario 2: [Name]
...

### SUS Score: [calculated score]

### Debrief Notes
- Liked: [list]
- Disliked: [list]
- Missing: [list]
- Would use: [yes/no, why]
- Quote: "[memorable quote]"

### Top 3 Issues
1. [issue + severity]
2. [issue + severity]
3. [issue + severity]

### Action Items
- [ ] Fix [P0 issue]
- [ ] Consider [feature request]
```

---

**Next Steps**:
1. Recruit 5 users for Phase 1 testing
2. Schedule sessions for next month
3. Run first round of tests
4. Analyze results and iterate

**Questions?** Open a GitHub issue or email [contact]

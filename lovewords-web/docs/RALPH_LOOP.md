# LoveWords Ralph Loop - Continuous Improvement Cycle

**Version**: 1.0
**Last Updated**: January 2026
**Purpose**: Establish systematic iteration loop for product improvement based on roadmap and user feedback

---

## What is the Ralph Loop?

The **Ralph Loop** is a continuous improvement cycle inspired by the "Ralph Wiggum" technique - iteratively improving the product through rapid feedback, testing, and refinement. Named after the character who represents learning through repeated attempts.

**Core Philosophy**: Ship fast, learn fast, improve fast.

---

## Loop Structure

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  1. PLAN → 2. BUILD → 3. TEST → 4. LEARN        │
│      ↑                                    ↓      │
│      └────────────────────────────────────┘      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Cycle Duration
- **Micro Loop**: 2 weeks (sprint cycle)
- **Macro Loop**: 3 months (phase cycle)

---

## Phase 1: PLAN

### Inputs
1. **Product Roadmap** (PRODUCT_ROADMAP.md)
   - Current phase milestones
   - Feature priorities (P0-P3)
   - Success metrics

2. **Competitive Analysis** (COMPETITIVE_ANALYSIS.md)
   - Gap analysis
   - Feature comparison
   - User pain points

3. **User Feedback**
   - GitHub issues
   - User testing insights
   - Support requests

### Activities

#### Week 1: Sprint Planning
**Monday - Sprint Planning Meeting**
- Review roadmap for current phase
- Select features for this sprint (from roadmap)
- Define success criteria
- Break down into tasks (GitHub issues)
- Assign priorities (P0 = must-ship, P1 = should-ship, P2 = nice-to-have)

**Example Sprint Goal (Phase 1, Sprint 1)**:
```
Goal: Implement single-switch automatic scanning

Features:
- [P0] Single-switch automatic scan mode
- [P0] Visual highlight with scan timer
- [P0] Configurable scan speed (0.5s - 5s)
- [P1] Scan speed settings panel
- [P2] Auditory feedback (beep on select)

Success Criteria:
- User can navigate board with single switch
- Scan speed adjustable without refresh
- Pass accessibility tests (no ARIA violations)
- User testing: 3/5 users can use successfully
```

#### Week 1-2: Technical Spike (if needed)
- Research unfamiliar technologies
- Prototype risky features
- Validate approach before committing

**Example Technical Spikes**:
- Phase 1: "How do we implement scan timer without performance issues?"
- Phase 2: "Which drag-and-drop library works best for board builder?"
- Phase 3: "Can we run ML model in browser, or need server?"

### Outputs
- Sprint backlog (GitHub issues with labels: `P0`, `P1`, `P2`)
- Sprint goal (documented in GitHub milestone)
- Technical design doc (for complex features)

---

## Phase 2: BUILD

### Activities

#### Daily Development
**Every Day**:
- Code, test, commit (small atomic commits)
- Update GitHub issue status (In Progress → In Review)
- Run automated tests locally
- Self-review before PR

**Daily Standup** (async via Slack/Discord, 15 min):
- What I did yesterday
- What I'm doing today
- Any blockers?

#### Code Quality
**Before every commit**:
- Run automated tests: `npm test`
- Run type check: `npm run typecheck`
- Run accessibility tests: `npm test -- --grep a11y`
- Format code: `npm run format` (if using Prettier)

**Before every PR**:
- Self-review diff
- Write clear PR description:
  - What changed?
  - Why? (link to issue)
  - How to test?
  - Screenshots (if UI change)

#### Continuous Integration
**Automated checks on PR**:
- All tests pass
- No TypeScript errors
- No accessibility violations (jest-axe)
- Build succeeds
- Bundle size <500KB

### Outputs
- Working code (merged PRs)
- Updated tests
- Documentation updates

---

## Phase 3: TEST

### Testing Layers

#### Layer 1: Automated Testing (Every PR)
**Unit Tests**:
- Components render correctly
- Functions return expected values
- Edge cases handled

**Integration Tests**:
- Features work end-to-end
- Navigation flows correctly
- State updates propagate

**Accessibility Tests**:
- No ARIA violations (jest-axe)
- Keyboard navigation works
- Screen reader announcements correct

**Target**: 80%+ code coverage, 100% critical path coverage

---

#### Layer 2: Manual Testing (Every Sprint)
**Week 2: Internal Testing**
- Test all new features on:
  - Chrome (desktop + mobile)
  - Safari (desktop + mobile)
  - Firefox (desktop)
  - Edge (desktop)
- Test keyboard navigation
- Test with screen reader (VoiceOver or NVDA)
- Test on slow connection (throttle network)

**Checklist** (copy to GitHub issue):
```
## Manual Test Checklist - Sprint [N]

### Feature: [Name]
- [ ] Works in Chrome desktop
- [ ] Works in Safari desktop
- [ ] Works in Chrome mobile (Android)
- [ ] Works in Safari mobile (iOS)
- [ ] Works in Firefox
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] No visual bugs
- [ ] No console errors
- [ ] Loads quickly (<2s)

### Regressions
- [ ] Existing features still work
- [ ] No new accessibility violations
- [ ] No performance degradation
```

---

#### Layer 3: User Testing (Every Phase)
**End of Phase Milestone**: Conduct user testing (USER_TESTING_PLAN.md)

**Phase 1 User Testing** (Switch Scanning):
- Recruit 5 motor-impaired users
- Run Scenario 1.1, 1.2, 1.3 (see USER_TESTING_PLAN.md)
- Collect SUS scores, task metrics, feedback
- Target: SUS >68, task completion >80%

**Analyze Results**:
- Transcribe recordings
- Calculate metrics
- Thematic analysis (group feedback)
- Create 1-page summary report

---

#### Layer 4: Dogfooding (Continuous)
**Use LoveWords ourselves**:
- Developers use it for personal communication
- Report bugs as users would
- Identify papercuts (small annoyances)

---

### Outputs
- Test results (automated: pass/fail, manual: checklist)
- User testing report (1-page summary)
- Bug list (GitHub issues labeled `bug`)

---

## Phase 4: LEARN

### Activities

#### Week 2: Sprint Review
**Thursday - Demo to Stakeholders**
- Show completed features (live demo)
- Collect feedback
- Celebrate wins
- Discuss misses

**Friday - Sprint Retrospective**
- What went well?
- What didn't go well?
- What should we change next sprint?

**Example Retro Insights**:
```
What went well:
+ Switch scanning works! Users love it
+ Automated tests caught 3 bugs before release
+ PR reviews improved code quality

What didn't go well:
- Scan speed too slow for some users
- Performance issues on low-end Android
- Documentation unclear on switch setup

What to change:
→ Add scan speed presets (slow, medium, fast)
→ Optimize scan timer (use CSS animations)
→ Create video tutorial for switch setup
```

---

#### Feedback Analysis
**Every Monday**:
1. Review GitHub issues from past week
2. Triage: P0 (blocker), P1 (high), P2 (medium), P3 (low)
3. Add to backlog (or next sprint if P0/P1)

**Every Month**:
1. Analyze user survey results (if any)
2. Review usage analytics (opt-in data)
3. Identify trends:
   - Most-used features (keep improving)
   - Least-used features (remove or improve)
   - Most-reported bugs (prioritize fixes)

---

#### Update Roadmap
**End of Phase**:
1. Review roadmap (PRODUCT_ROADMAP.md)
2. Update based on learnings:
   - Did we achieve phase goals? (yes/no, why?)
   - What features worked? (keep building on)
   - What features didn't work? (deprioritize or remove)
   - What new features emerged? (add to roadmap)
3. Re-prioritize next phase
4. Communicate changes to users (blog post)

**Example Roadmap Update**:
```
Phase 1 Review (Switch Scanning):
✅ Achieved: Switch scanning works, SUS score 72 (good)
✅ Exceeded: 5/5 users would use regularly (target: 3/5)
❌ Missed: Two-switch scanning too buggy (defer to Phase 2)

Changes to Roadmap:
- Move two-switch scanning to Phase 2, Week 1
- Add scan speed presets (user request)
- Prioritize mobile performance (Android laggy)

Phase 2 Focus (Customization):
- Start custom board builder (as planned)
- Fix two-switch scanning (carryover from Phase 1)
- Optimize mobile performance (new priority)
```

---

### Outputs
- Sprint retro notes (what to change)
- Roadmap updates (prioritization changes)
- Blog post (communicate learnings to users)

---

## Ralph Loop in Practice

### Sprint-Level Loop (2 weeks)

```
Week 1:
  Monday:    Sprint Planning (select features)
  Tue-Thu:   Build features
  Friday:    PR reviews, merge

Week 2:
  Mon-Wed:   Build features
  Thursday:  Sprint Review (demo)
  Thursday:  Internal testing
  Friday:    Sprint Retro (learn)
  Friday:    Deploy to production
  Friday:    Triage new issues

→ Repeat for next sprint
```

---

### Phase-Level Loop (3 months)

```
Month 1:
  Sprint 1-2: Build core features

Month 2:
  Sprint 3-4: Build remaining features
  Week 8:     Internal testing

Month 3:
  Week 9:     User testing (recruit, schedule)
  Week 10:    User testing (run sessions)
  Week 11:    Analyze results
  Week 12:    Fix P0 issues, update roadmap

→ Repeat for next phase
```

---

## Metrics to Track

### Development Velocity
- **Velocity**: Story points completed per sprint
- **Burn-down**: Tasks remaining vs. time
- **Cycle time**: Time from PR open to merge
- **Lead time**: Time from idea to production

**Target**: Consistent velocity (±20%), decreasing cycle time over time

---

### Quality Metrics
- **Bug escape rate**: Bugs found in prod vs. test
- **Test coverage**: % of code covered by tests
- **Accessibility violations**: Count (target: 0)
- **Performance**: Page load time, TTI (Time to Interactive)

**Target**: Bug escape <5%, test coverage >80%, load time <2s

---

### User Metrics
- **SUS Score**: System Usability Scale (target: >68)
- **Task completion rate**: % of users completing tasks (target: >80%)
- **NPS**: Net Promoter Score (target: >30)
- **Retention**: 30-day retention (target: >50%)

**Track in**: Google Analytics (opt-in), user surveys, user testing

---

### Product Metrics
- **Active users**: DAU, WAU, MAU
- **Feature adoption**: % of users using each feature
- **Custom boards created**: Count (target: 30% of users)
- **Switch scanning enabled**: Count (target: 10% of users)

**Track in**: Anonymous usage analytics (opt-in, privacy-first)

---

## Agent-Assisted Ralph Loop

### Using Agents for Iteration
As mentioned in the user request, we'll **work with agents to achieve product goals**. Here's how agents fit into the Ralph loop:

#### 1. Planning Phase
**Agent**: `architect`
**Task**: "Design implementation plan for [feature] based on roadmap and competitive analysis"
**Output**: Technical design document

**Agent**: `plan-reviewer`
**Task**: "Review implementation plan for [feature], identify risks"
**Output**: Risk assessment, recommendations

---

#### 2. Build Phase
**Agent**: `kraken` (TDD implementation)
**Task**: "Implement [feature] using test-driven development"
**Output**: Working code + tests

**Agent**: `spark` (quick fixes)
**Task**: "Fix bug [issue number]"
**Output**: Bug fix + test

---

#### 3. Test Phase
**Agent**: `arbiter` (test execution)
**Task**: "Run all tests and report failures"
**Output**: Test results, coverage report

**Agent**: `aegis` (security testing)
**Task**: "Audit [feature] for security vulnerabilities"
**Output**: Security report

**Agent**: `critic` (code review)
**Task**: "Review PR [number] for code quality, accessibility, and best practices"
**Output**: Review comments, suggestions

---

#### 4. Learn Phase
**Agent**: `session-analyst`
**Task**: "Analyze user testing sessions and extract insights"
**Output**: Thematic analysis, top issues

**Agent**: `chronicler`
**Task**: "Extract learnings from this sprint to avoid repeating mistakes"
**Output**: Session learnings stored in memory

---

### Agent Orchestration

**Parallel Agents** (run simultaneously for speed):
```
# Sprint Start: Plan in parallel
- architect: Design feature A
- architect: Design feature B
- plan-reviewer: Review both plans
```

**Sequential Agents** (run in order for dependencies):
```
# Sprint End: Test and Learn
1. arbiter: Run all tests
2. critic: Review code (only if tests pass)
3. aegis: Security audit (after code review)
4. session-analyst: Analyze results
5. chronicler: Store learnings
```

**Example Workflow** (Phase 1, Sprint 1):
```bash
# Monday: Planning
→ architect: "Design single-switch scanning feature"
→ plan-reviewer: "Review switch scanning plan"
→ validate-agent: "Validate tech choices (react-aria vs custom)"

# Tuesday-Thursday: Building
→ kraken: "Implement switch scanning with TDD"
→ (Human review and merge)

# Friday: Testing
→ arbiter: "Run all tests"
→ critic: "Review switch scanning code"
→ aegis: "Security audit on switch scanner"

# Friday: Learning
→ session-analyst: "Analyze sprint, identify blockers"
→ chronicler: "Store learnings: switch scanning implementation"
```

---

## Ralph Loop Guardrails

### Don't Skip Steps
- ❌ Don't skip user testing to ship faster
- ❌ Don't skip automated tests ("we'll add them later")
- ❌ Don't skip retros ("nothing to learn")
- ✅ Every step adds value, shortcuts create tech debt

### Fail Fast
- ❌ Don't wait 3 months to get user feedback
- ✅ Test with 1-2 users early (even if incomplete)
- ✅ Ship MVP, iterate based on feedback
- ✅ Kill features that don't work (don't double down)

### Measure Everything
- ❌ Don't rely on "gut feel" for decisions
- ✅ Track metrics (SUS, task completion, retention)
- ✅ A/B test when uncertain (if traffic allows)
- ✅ Let data guide priorities

### Communicate Changes
- ❌ Don't silently change roadmap
- ✅ Blog about learnings ("Here's what we learned from user testing")
- ✅ Update users on changes ("We heard you, here's what we fixed")
- ✅ Involve community in decisions (poll for next features)

---

## Success Criteria for Ralph Loop

### Process Health
- ✅ Sprints consistently ship features (velocity ±20%)
- ✅ User testing happens every phase
- ✅ Retros lead to actionable changes
- ✅ Roadmap updated every phase

### Product Health
- ✅ SUS score >68 (good usability)
- ✅ Bug escape rate <5%
- ✅ 30-day retention >50%
- ✅ Users report feeling heard (NPS >30)

### Team Health
- ✅ No burnout (sustainable pace)
- ✅ Clear priorities (no thrashing)
- ✅ Learning culture (retros are safe space)
- ✅ Pride in product (team uses it)

---

## Next Steps

### This Week
1. **Set up Ralph loop infrastructure**:
   - [ ] Create GitHub project board (Backlog, Sprint, In Progress, Review, Done)
   - [ ] Set up sprint milestones (Sprint 1, Sprint 2, etc.)
   - [ ] Create issue templates (feature, bug, chore)
   - [ ] Set up automated testing CI (GitHub Actions)

2. **Plan Sprint 1**:
   - [ ] Review roadmap Phase 1, Milestone 1.1
   - [ ] Break down features into tasks (GitHub issues)
   - [ ] Estimate effort (T-shirt sizes: S, M, L, XL)
   - [ ] Commit to sprint goal

3. **Start building**:
   - [ ] Implement first feature (single-switch scanning)
   - [ ] Write tests as you go (TDD)
   - [ ] Daily standup updates (async)

### This Month
- Complete Sprint 1 and Sprint 2
- Conduct internal testing
- Deploy Phase 1 Milestone 1.1 to production
- Collect feedback from early users

### This Quarter
- Complete Phase 1 (Switch Scanning)
- Conduct user testing with 5 motor-impaired users
- Analyze results, update roadmap
- Celebrate Phase 1 completion, start Phase 2

---

## Ralph Loop Checklist

**Every Sprint** (2 weeks):
- [ ] Monday: Sprint planning (select features, define success criteria)
- [ ] Tue-Thu Week 1: Build features
- [ ] Fri Week 1: PR reviews, merge
- [ ] Mon-Wed Week 2: Build features
- [ ] Thu Week 2: Sprint review (demo)
- [ ] Thu Week 2: Internal testing (manual checklist)
- [ ] Fri Week 2: Sprint retro (what to change)
- [ ] Fri Week 2: Deploy to production
- [ ] Fri Week 2: Triage GitHub issues

**Every Phase** (3 months):
- [ ] Month 1-2: Build features (Sprint 1-4)
- [ ] Month 3 Week 1: Recruit user testers
- [ ] Month 3 Week 2: Conduct user testing (5 sessions)
- [ ] Month 3 Week 3: Analyze results (transcribe, metrics, themes)
- [ ] Month 3 Week 4: Fix P0 issues, update roadmap
- [ ] Month 3 Week 4: Write blog post (learnings)
- [ ] Month 3 Week 4: Celebrate, plan next phase

---

**Ralph Loop Status**: 🟢 **ACTIVE**

**Current Sprint**: Sprint 1 (Phase 1: Switch Scanning)
**Sprint Goal**: Implement single-switch automatic scanning
**Next Review**: End of Week 2

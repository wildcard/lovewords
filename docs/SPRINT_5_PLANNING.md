# Sprint 5: Planning Document

**Status:** Planning Phase
**Date:** 2026-01-24
**Previous Sprints:**
- Sprint 3: Board Export/Import ✅
- Sprint 4: Enhanced UX (Drag-Drop, Export All, Search, QR Codes) ✅
- Issue #26: Community Board Repository ✅

---

## Sprint 5 Candidates

### High Priority Features

#### 1. Image Library (Reusable Images) - Issue #19
**Impact:** High - Reduces redundancy, improves board creation workflow
**Complexity:** Medium
**Dependencies:** None

**Description:**
Create a centralized image library where users can:
- Upload images once and reuse across multiple boards
- Browse available images when creating/editing buttons
- Manage image assets (rename, delete, categorize)
- Reduce storage by eliminating duplicate images

**Scope:**
- Image library storage structure
- Image upload/management UI
- Image picker component for button creation
- Deduplication logic
- Migration path for existing boards

**Estimated Effort:** 2-3 days

---

#### 2. Undo/Redo System for Board Editing - Issue #20
**Impact:** High - Major UX improvement, reduces editing friction
**Complexity:** Medium-High
**Dependencies:** None

**Description:**
Implement undo/redo functionality for board editing:
- Track all board modifications (add/delete/edit buttons)
- Keyboard shortcuts (Ctrl+Z / Cmd+Z for undo, Ctrl+Shift+Z for redo)
- Visual indicators (undo/redo buttons, disabled states)
- History limits (e.g., last 50 actions)

**Scope:**
- Command pattern implementation
- History stack management
- UI controls (toolbar buttons)
- Keyboard shortcuts
- Testing edge cases

**Estimated Effort:** 2-3 days

---

#### 3. Board Templates (Emotions, Needs, Activities) - Issue #21
**Impact:** High - Accelerates board creation, provides starting points
**Complexity:** Low-Medium
**Dependencies:** None

**Description:**
Pre-built board templates for common use cases:
- Basic Emotions (happy, sad, angry, scared, etc.)
- Core Needs (food, water, bathroom, help, etc.)
- Daily Activities (breakfast, lunch, school, play, etc.)
- Template selection UI in board creator
- Customization after selection

**Scope:**
- Create 3-5 template OBF files
- Template selection modal
- Template preview
- "Start from Template" button in BoardLibrary
- Template metadata (name, description, category)

**Estimated Effort:** 1-2 days

---

### Medium Priority Features

#### 4. Board Folders/Categories (New)
**Impact:** Medium - Organizes boards as collection grows
**Complexity:** Medium
**Dependencies:** None

**Description:**
Allow users to organize boards into folders:
- Create/rename/delete folders
- Drag boards into folders
- Folder navigation in BoardLibrary
- Breadcrumb navigation
- Nested folders (optional)

**Scope:**
- Folder data structure
- Folder CRUD operations
- UI for folder management
- Drag-and-drop between folders
- Storage schema migration

**Estimated Effort:** 2-3 days

---

#### 5. Button Styles & Customization (New)
**Impact:** Medium - Personalization, accessibility
**Complexity:** Low-Medium
**Dependencies:** None

**Description:**
Enhanced button customization:
- Border styles (solid, dashed, rounded)
- Shadow effects
- Icon positioning (top, left, right, bottom)
- Font sizes
- Button shape presets

**Scope:**
- Button style options in editor
- CSS implementation
- Style presets
- Preview updates
- OBF extension for styles

**Estimated Effort:** 1-2 days

---

#### 6. Voice Selection for TTS (New)
**Impact:** Medium - Personalization, user preference
**Complexity:** Low
**Dependencies:** None

**Description:**
Allow users to select TTS voice:
- Voice picker in settings
- Preview voices
- Per-board voice settings (optional)
- Voice metadata (language, gender, speed)

**Scope:**
- Voice enumeration (Web Speech API)
- Voice picker UI
- Settings persistence
- Voice preview functionality

**Estimated Effort:** 1 day

---

### Low Priority / Future

#### 7. Board Backup/Restore (New)
**Impact:** Low - Safety net, peace of mind
**Complexity:** Low
**Dependencies:** Export/Import (already done)

**Description:**
Automatic or manual backups:
- Export all boards to ZIP periodically
- Backup to browser's IndexedDB
- Restore from backup
- Backup history (last 5 backups)

**Estimated Effort:** 1-2 days

---

## Recommended Sprint 5 Scope

### Option A: User-Facing Improvements (Recommended)
**Theme:** Enhance board creation and editing experience

**Issues:**
1. #21 - Board Templates ⭐ (Quick win, high impact)
2. #20 - Undo/Redo System ⭐ (High impact, better UX)
3. #19 - Image Library ⭐ (Reduces redundancy, professional feature)

**Total Effort:** 5-8 days
**Impact:** High - All three improve board creation workflow significantly

**Rationale:**
- Templates accelerate onboarding (users can start with working boards)
- Undo/Redo makes editing forgiving and professional
- Image Library reduces storage and improves asset management

---

### Option B: Organization & Personalization
**Theme:** Help users manage growing board collections

**Issues:**
1. #21 - Board Templates
2. Button Styles & Customization (new)
3. Voice Selection for TTS (new)
4. Board Folders/Categories (new)

**Total Effort:** 5-8 days
**Impact:** Medium-High - Helps users organize and personalize

**Rationale:**
- Templates provide starting points
- Folders handle growth beyond 10+ boards
- Styles and voice add personalization
- Good for users who already have multiple boards

---

### Option C: Power User Features
**Theme:** Advanced features for experienced users

**Issues:**
1. #20 - Undo/Redo System
2. #19 - Image Library
3. Board Folders/Categories (new)
4. Board Backup/Restore (new)

**Total Effort:** 6-10 days
**Impact:** Medium - Targets power users

**Rationale:**
- Undo/Redo for complex editing sessions
- Image Library for users with many boards
- Folders for organization
- Backup for safety

---

## Recommendation: **Option A**

**Sprint 5 should focus on Issue #21, #20, and #19.**

### Why?
1. **Cohesive theme:** All three improve board creation/editing
2. **High impact:** Templates help new users, Undo/Redo helps all users, Image Library helps power users
3. **Balanced complexity:** Mix of easy (templates), medium (undo/redo, image library)
4. **Builds on Sprint 4:** Continues improving UX after community features

### Implementation Order
1. **Issue #21: Board Templates** (1-2 days)
   - Quick win
   - Provides value immediately
   - Can be used while building other features

2. **Issue #19: Image Library** (2-3 days)
   - Foundation for better asset management
   - Reduces storage issues early

3. **Issue #20: Undo/Redo System** (2-3 days)
   - More complex, save for end
   - Requires careful testing
   - Big UX payoff

---

## Sprint 5 Goals

### Success Criteria
- [ ] Users can start from pre-built templates (3+ templates available)
- [ ] Users can undo/redo board edits (50-action history)
- [ ] Users can create an image library and reuse images
- [ ] All features tested (automated + manual)
- [ ] Documentation updated
- [ ] Build passes, no regressions

### Stretch Goals
- [ ] Voice selection for TTS
- [ ] Button style customization
- [ ] Board folders (basic implementation)

---

## Next Steps

1. **Review this plan** - Confirm Sprint 5 scope
2. **Create detailed implementation plans** for each issue
3. **Start with Issue #21** (Board Templates) as a quick win
4. **Run `/tdd` for each feature** to ensure quality
5. **Create Sprint 5 GitHub milestone** and assign issues

---

## Questions for Decision

1. **Which option?** Option A (recommended), B, or C?
2. **Template count?** How many templates to include? (Recommend 3-5)
3. **Undo history limit?** 50 actions? 100 actions? Unlimited?
4. **Image library location?** localStorage? IndexedDB? Cloud (future)?
5. **Should we include any stretch goals** in Sprint 5 scope?

---

**Ready to proceed?** Let me know which option or if you want a custom Sprint 5 scope!

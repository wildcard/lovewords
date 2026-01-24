# Issue #21: Board Templates Implementation Plan

**Status:** Planning
**Priority:** High
**Sprint:** 5
**Estimated Effort:** 1-2 days
**Dependencies:** None

---

## Overview

Enable users to start from pre-built board templates instead of creating boards from scratch. This accelerates onboarding and provides working examples of well-designed boards.

---

## Goals

### Primary Goals
- Provide 3-5 pre-built board templates
- Add "Start from Template" option in board creation flow
- Template selection UI with previews
- Seamless template instantiation

### Success Criteria
- [ ] Users can browse available templates
- [ ] Users can preview template content before selection
- [ ] Users can create a board from a template (one click)
- [ ] Template boards are fully customizable after creation
- [ ] Templates stored in version control
- [ ] All features tested (automated + browser)

---

## Templates to Create

### 1. Basic Emotions (3×3) ⭐ Featured
**Purpose:** Express basic feelings
**Buttons:**
- Happy (😊, yellow)
- Sad (😢, blue)
- Angry (😠, red)
- Scared (😨, purple)
- Surprised (😲, orange)
- Excited (🤩, yellow)
- Calm (😌, green)
- Confused (😕, gray)
- Tired (😴, blue-gray)

### 2. Core Needs (4×4) ⭐ Featured
**Purpose:** Basic communication needs
**Buttons:**
- I want (🙋)
- I need (🆘)
- Help (🆘)
- Yes (✅, green)
- No (❌, red)
- More (➕)
- Stop (🛑, red)
- Please (🙏)
- Thank you (💖)
- Food (🍽️)
- Drink (🥤)
- Bathroom (🚻)
- Medicine (💊)
- Hurt (🤕)
- Tired (😴)
- Home (🏠)

### 3. Daily Routine (4×4)
**Purpose:** Daily activities and schedule
**Buttons:**
- Wake up (☀️)
- Breakfast (🥞)
- Get dressed (👕)
- Brush teeth (🪥)
- School (🎒)
- Lunch (🥗)
- Play (⚽)
- TV (📺)
- Snack (🍪)
- Homework (📝)
- Dinner (🍝)
- Bath (🛁)
- Pajamas (👔)
- Story (📖)
- Bed (🛏️)
- Sleep (💤)

### 4. Questions & Conversation (3×4)
**Purpose:** Social interaction starters
**Buttons:**
- Who? (❓)
- What? (❓)
- When? (🕐)
- Where? (📍)
- Why? (🤔)
- How? (❓)
- Tell me (💬)
- Show me (👁️)
- I like (👍)
- I don't like (👎)
- Maybe (🤷)
- I don't know (❓)

### 5. Feelings Scale (5×2)
**Purpose:** Rate intensity of feelings
**Buttons:**
- 1 - Not at all (😐)
- 2 - A little (🙂)
- 3 - Somewhat (😊)
- 4 - A lot (😄)
- 5 - Very much (🤩)
- Happy (😊)
- Sad (😢)
- Angry (😠)
- Scared (😨)
- Excited (🤩)

---

## Technical Design

### File Structure

```
lovewords-web/
  public/
    templates/
      basic-emotions.obf
      core-needs.obf
      daily-routine.obf
      questions-conversation.obf
      feelings-scale.obf
      templates-manifest.json
```

### Templates Manifest Format

```json
{
  "version": "1.0",
  "templates": [
    {
      "id": "basic-emotions",
      "name": "Basic Emotions",
      "description": "Express basic feelings and emotions",
      "category": "Emotions",
      "featured": true,
      "grid": { "rows": 3, "columns": 3 },
      "buttonCount": 9,
      "file": "/templates/basic-emotions.obf",
      "thumbnail": "/templates/thumbnails/basic-emotions.png",
      "tags": ["emotions", "feelings", "beginner"],
      "difficulty": "beginner"
    }
  ]
}
```

### Component Architecture

```
src/
  types/
    template-catalog.ts          # Template types
  utils/
    template-loader.ts           # Load templates from manifest
  components/
    TemplatePickerModal.tsx      # Template selection UI
    TemplateCard.tsx             # Individual template display
    TemplatePreviewModal.tsx     # Preview template content
```

---

## Implementation Phases

### Phase 1: Template Files (1 hour)
**Goal:** Create 5 template OBF files

**Tasks:**
1. Create `public/templates/` directory
2. Generate 5 OBF files with proper structure:
   - Valid OBF format
   - Unique button IDs
   - Proper grid layout
   - Colors and labels
   - Basic symbols (emojis for now, images later)
3. Create `templates-manifest.json` with metadata
4. Test OBF validity (import each manually)

**Files Created:**
- `public/templates/basic-emotions.obf`
- `public/templates/core-needs.obf`
- `public/templates/daily-routine.obf`
- `public/templates/questions-conversation.obf`
- `public/templates/feelings-scale.obf`
- `public/templates/templates-manifest.json`

### Phase 2: Template Types & Utilities (1 hour)
**Goal:** Type definitions and template loading logic

**Files to Create:**

**`src/types/template-catalog.ts`**
```typescript
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  grid: { rows: number; columns: number };
  buttonCount: number;
  file: string;
  thumbnail?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TemplateManifest {
  version: string;
  templates: TemplateMetadata[];
}
```

**`src/utils/template-loader.ts`**
```typescript
export async function loadTemplateManifest(): Promise<TemplateManifest>
export async function loadTemplate(templateId: string): Promise<ObfBoard>
export function filterTemplates(
  templates: TemplateMetadata[],
  query?: string,
  category?: string,
  featured?: boolean
): TemplateMetadata[]
```

**Logic:**
- Fetch manifest from `/templates/templates-manifest.json`
- Cache manifest in memory (no localStorage needed)
- Load individual templates on demand
- Validation of OBF structure

### Phase 3: Template Picker UI (2 hours)
**Goal:** Modal for browsing and selecting templates

**Files to Create:**

**`src/components/TemplatePickerModal.tsx`**
- Modal overlay (similar to CommunityBrowseModal)
- Header: "Choose a Template"
- Category tabs: All, Emotions, Daily Life, Social
- Featured toggle
- Template grid (2-3 columns)
- Each template shows:
  - Name
  - Description
  - Grid size badge (3×3, 4×4)
  - Button count
  - "Preview" button
  - "Use Template" button

**`src/components/TemplateCard.tsx`**
- Template thumbnail or placeholder
- Template name and description
- Metadata badges (featured, difficulty, button count)
- Hover state
- Click handlers for preview/use

**`src/components/TemplatePreviewModal.tsx`**
- Show template content
- Grid preview (similar to board display)
- Button labels visible
- "Use This Template" button
- Close button

**Design Notes:**
- Green accent color (differentiate from community purple and import blue)
- Responsive grid (1 column mobile, 2-3 desktop)
- Focus management and keyboard navigation
- Screen reader announcements

### Phase 4: Integration with Board Creation (1 hour)
**Goal:** Add template option to board creation flow

**Files to Modify:**

**`src/components/BoardLibrary.tsx`**
- Add "📋 Start from Template" button next to "➕ Create Board"
- Button opens TemplatePickerModal
- Pass `onSelectTemplate` handler

**`src/App.tsx`**
- Add state: `showTemplatePicker`
- Handler: `handleSelectTemplate(templateId: string)`
  1. Load template OBF
  2. Generate new unique ID
  3. Set `ext_lovewords_custom: true`
  4. Update timestamps
  5. Save to storage
  6. Navigate to new board
  7. Announce to screen reader
- Integrate TemplatePickerModal

### Phase 5: Testing (2 hours)
**Goal:** Comprehensive automated tests

**Test Files to Create:**

**`src/__tests__/utils/template-loader.test.ts`**
- Load manifest successfully
- Load individual templates
- Filter templates by category
- Filter templates by search query
- Handle fetch errors
- Validate OBF structure

**`src/__tests__/components/TemplatePickerModal.test.tsx`**
- Renders template list
- Filters by category
- Filters by featured
- Search functionality
- Opens preview modal
- Selects template (calls handler)
- Keyboard navigation
- Accessibility (ARIA, focus trap)

**`src/__tests__/integration/template-creation.test.tsx`**
- Full flow: open picker → select template → board created
- Template board is editable
- Template board has unique ID
- Multiple templates can be created
- Error handling (network, invalid OBF)

**Coverage Target:** 100% of public APIs

### Phase 6: Documentation (30 min)
**Goal:** Document template system

**Files to Create/Modify:**

**`docs/TEMPLATES_GUIDE.md`**
- How to use templates
- Available templates list
- Creating custom templates (for future)
- Template format specification

**Update `docs/DEVELOPER_GUIDE.md`**
- Add Templates section
- Template loading architecture
- Adding new templates

---

## File Summary

### Files to Create (15 files)

**Templates (6 files):**
1. `public/templates/basic-emotions.obf`
2. `public/templates/core-needs.obf`
3. `public/templates/daily-routine.obf`
4. `public/templates/questions-conversation.obf`
5. `public/templates/feelings-scale.obf`
6. `public/templates/templates-manifest.json`

**Types (1 file):**
7. `src/types/template-catalog.ts`

**Utils (1 file):**
8. `src/utils/template-loader.ts`

**Components (3 files):**
9. `src/components/TemplatePickerModal.tsx`
10. `src/components/TemplateCard.tsx`
11. `src/components/TemplatePreviewModal.tsx`

**Tests (3 files):**
12. `src/__tests__/utils/template-loader.test.ts`
13. `src/__tests__/components/TemplatePickerModal.test.tsx`
14. `src/__tests__/integration/template-creation.test.tsx`

**Documentation (1 file):**
15. `docs/TEMPLATES_GUIDE.md`

### Files to Modify (3 files)
- `src/components/BoardLibrary.tsx` (add button)
- `src/App.tsx` (add handler and modal)
- `docs/DEVELOPER_GUIDE.md` (add section)

---

## Estimated LOC

| Category | Lines of Code |
|----------|---------------|
| Templates (OBF) | ~800 lines (5 × 160 lines avg) |
| Manifest | ~100 lines |
| Types | ~50 lines |
| Utils | ~150 lines |
| Components | ~600 lines (3 components) |
| Tests | ~800 lines |
| Docs | ~300 lines |
| **Total** | **~2,800 lines** |

---

## Risk Analysis

### Low Risk
- Template files (static JSON)
- Manifest loading (simple fetch)
- UI components (similar to existing modals)

### Medium Risk
- Template instantiation (ID collision, validation)
- Edge cases (network errors, invalid OBF)

### Mitigation
- Reuse import validation logic from Issue #18
- Comprehensive tests for edge cases
- Manual browser testing of all templates

---

## Testing Strategy

### Automated Tests
- Unit tests for template loading
- Component tests for UI
- Integration tests for full flow
- Edge case coverage (errors, invalid data)

### Manual Tests
1. Open BoardLibrary → "Start from Template"
2. Browse all 5 templates
3. Preview each template
4. Create board from each template
5. Verify boards are editable
6. Test keyboard navigation
7. Test screen reader announcements

---

## Acceptance Criteria

- [ ] 5 templates available and working
- [ ] TemplatePickerModal opens from BoardLibrary
- [ ] Templates can be filtered by category/featured
- [ ] Template preview shows button layout
- [ ] Selecting template creates editable board
- [ ] New board has unique ID and custom flag
- [ ] All automated tests pass (target: 50+ tests)
- [ ] Build succeeds, no TypeScript errors
- [ ] Documentation complete
- [ ] Manual browser testing complete

---

## Timeline

**Day 1:**
- Morning: Phase 1 (Template Files) + Phase 2 (Types & Utils)
- Afternoon: Phase 3 (UI Components)
- Evening: Phase 4 (Integration)

**Day 2:**
- Morning: Phase 5 (Testing)
- Afternoon: Phase 6 (Documentation) + Manual testing
- Evening: Commit, push, close issue

**Total: 1.5-2 days**

---

## Next Steps

1. Create templates directory and OBF files
2. Implement template loader utilities
3. Build TemplatePickerModal UI
4. Integrate with board creation flow
5. Write comprehensive tests
6. Document template system
7. Manual browser testing
8. Commit and close Issue #21

---

**Ready to start implementation?** This plan follows the same pattern as Issue #26 - clear phases, comprehensive testing, thorough documentation.

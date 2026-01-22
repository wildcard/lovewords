# Issue #26 Implementation Plan: Community Board Repository

**Issue:** #26 - [Sprint 4] Community Board Repository
**Status:** Planning
**Estimated Effort:** 4-5 days

---

## Overview

Create a community-driven board repository where users can browse, discover, and import boards created by others. This builds on Sprint 3's import functionality and Sprint 4's sharing features.

---

## Architecture

### Repository Structure

**Option A: Separate Repository** (Recommended)
```
lovewords-community-boards/
├── README.md                    # Guidelines, how to contribute
├── metadata.json                # Catalog of all boards
├── boards/
│   ├── family/
│   │   ├── my-family.obf
│   │   ├── grandparents.obf
│   │   └── siblings.obf
│   ├── therapy/
│   │   ├── emotions-chart.obf
│   │   ├── coping-skills.obf
│   │   └── sensory-needs.obf
│   ├── daily-needs/
│   │   ├── morning-routine.obf
│   │   ├── mealtime.obf
│   │   └── bedtime.obf
│   └── education/
│       ├── alphabet.obf
│       ├── numbers.obf
│       └── colors.obf
├── templates/
│   └── board-template.obf       # Template for new submissions
└── CONTRIBUTING.md              # Submission guidelines
```

**Option B: Folder in Main Repo**
```
lovewords/
├── lovewords-web/
├── lovewords-core/
└── community-boards/            # Same structure as Option A
```

**Recommendation:** Option A (separate repo)
- Cleaner separation
- Easier community contributions
- Independent versioning
- Better discoverability

### Metadata Format

**metadata.json:**
```json
{
  "version": "1.0",
  "lastUpdated": "2026-01-22T00:00:00Z",
  "categories": [
    {
      "id": "family",
      "name": "Family",
      "description": "Boards for family communication",
      "icon": "👨‍👩‍👧‍👦",
      "boardCount": 5
    },
    {
      "id": "therapy",
      "name": "Therapy",
      "description": "Therapeutic and emotional support boards",
      "icon": "🧠",
      "boardCount": 8
    }
  ],
  "boards": [
    {
      "id": "family-my-family",
      "name": "My Family",
      "description": "Communication board for talking about family members",
      "category": "family",
      "author": "LoveWords Team",
      "authorUrl": "https://github.com/wildcard/lovewords",
      "tags": ["family", "relationships", "people"],
      "grid": {
        "rows": 4,
        "columns": 4
      },
      "buttons": 12,
      "created": "2026-01-15T00:00:00Z",
      "updated": "2026-01-20T00:00:00Z",
      "featured": true,
      "downloads": 0,
      "url": "https://raw.githubusercontent.com/wildcard/lovewords-community-boards/main/boards/family/my-family.obf",
      "thumbnailUrl": null
    }
  ],
  "featured": ["family-my-family", "therapy-emotions-chart"]
}
```

---

## Implementation Phases

### Phase 1: Repository Setup (Day 1)

**Tasks:**
1. Create `lovewords-community-boards` GitHub repository
2. Set up initial folder structure
3. Write README.md with:
   - Purpose and mission
   - How to use boards
   - Attribution requirements
4. Write CONTRIBUTING.md with:
   - Submission guidelines
   - Quality criteria
   - Review process
5. Create initial metadata.json (empty catalog)
6. Add LICENSE file (CC0 or CC-BY for content)

**Files to Create:**
- GitHub repo: `wildcard/lovewords-community-boards`
- README.md
- CONTRIBUTING.md
- metadata.json
- LICENSE

### Phase 2: Initial Board Content (Day 1-2)

**Tasks:**
1. Convert existing example boards to community format
2. Create 10-15 starter boards across categories:
   - Family: My Family, Grandparents, Siblings, Pets
   - Therapy: Emotions Chart, Coping Skills, Sensory Needs
   - Daily Needs: Morning Routine, Mealtime, Bedtime
   - Education: Alphabet, Numbers, Colors, Shapes
3. Add metadata for each board
4. Test board URLs are accessible

**Quality Criteria:**
- All boards must be valid OBF format
- Buttons must have appropriate labels
- Grid sizes should be 3×3, 4×4, or 5×4 (standard sizes)
- No copyrighted images (use emoji or CC0 images)
- Clear, concise descriptions

### Phase 3: Catalog Utilities (Day 2)

**Files to Create:**
- `src/utils/community-catalog.ts`
- `src/types/community-catalog.ts`

**Functions:**
```typescript
// Types
export interface CommunityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  boardCount: number;
}

export interface CommunityBoard {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  authorUrl?: string;
  tags: string[];
  grid: { rows: number; columns: number };
  buttons: number;
  created: string;
  updated: string;
  featured: boolean;
  downloads: number;
  url: string;
  thumbnailUrl?: string;
}

export interface CommunityCatalog {
  version: string;
  lastUpdated: string;
  categories: CommunityCategory[];
  boards: CommunityBoard[];
  featured: string[];
}

// Utilities
export async function fetchCatalog(): Promise<CommunityCatalog>;
export function filterBoards(boards: CommunityBoard[], options: FilterOptions): CommunityBoard[];
export function sortBoards(boards: CommunityBoard[], sortBy: string): CommunityBoard[];
export function getCategoryBoards(catalog: CommunityCatalog, categoryId: string): CommunityBoard[];
export function getFeaturedBoards(catalog: CommunityCatalog): CommunityBoard[];
export function getNewBoards(catalog: CommunityCatalog, days: number): CommunityBoard[];
```

**Constants:**
```typescript
export const CATALOG_URL = 'https://raw.githubusercontent.com/wildcard/lovewords-community-boards/main/metadata.json';
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
```

### Phase 4: Browse Modal UI (Day 3)

**Files to Create:**
- `src/components/CommunityBrowseModal.tsx`

**Component Structure:**
```
CommunityBrowseModal
├── Header
│   ├── Title: "Community Boards"
│   ├── Search input
│   └── Close button
├── Sidebar (Categories)
│   ├── "Featured" (⭐)
│   ├── "New" (🆕)
│   ├── "All Boards" (📚)
│   ├── Divider
│   └── Category list
│       ├── Family (👨‍👩‍👧‍👦)
│       ├── Therapy (🧠)
│       ├── Daily Needs (🏠)
│       └── Education (📖)
├── Main Content (Board Grid)
│   └── Board cards
│       ├── Name
│       ├── Description
│       ├── Author
│       ├── Metadata (buttons, grid size)
│       ├── Tags
│       └── "Import" button
└── Footer
    └── "Contribute Your Boards" link
```

**Features:**
- Loading state while fetching catalog
- Error state with retry button
- Empty state for empty categories
- Search across board names, descriptions, tags
- Category navigation
- Featured/New sections
- Board card hover effects
- Import button per board

### Phase 5: Import Integration (Day 3-4)

**Files to Modify:**
- `src/App.tsx` - Add community browse modal state
- `src/components/BoardLibrary.tsx` - Add "Browse Community" button

**Flow:**
1. User clicks "Browse Community Boards"
2. CommunityBrowseModal opens
3. Fetches catalog from GitHub
4. Displays categories and boards
5. User clicks "Import" on a board
6. Fetches board .obf file from URL
7. Validates board (existing validation utility)
8. Checks for ID collision (existing logic)
9. Imports board (existing import flow)
10. Shows success message
11. Modal closes, user sees imported board

**New Handler:**
```typescript
const handleImportFromCommunity = useCallback(async (board: CommunityBoard) => {
  try {
    announce(`Importing ${board.name}...`);

    // Fetch board from URL
    const response = await fetch(board.url);
    const obfBoard = await response.json();

    // Validate
    const validation = validateBoard(obfBoard);
    if (!validation.valid) {
      throw new Error('Invalid board format');
    }

    // Check collision
    const existingIds = await getExistingBoardIds();
    const processedBoard = processImportedBoard(
      obfBoard,
      existingIds,
      'rename' // Always rename to avoid conflicts
    );

    // Add attribution
    processedBoard.ext_lovewords_source = 'community';
    processedBoard.ext_lovewords_author = board.author;
    processedBoard.ext_lovewords_community_id = board.id;

    // Save
    await storage.current.saveBoard(processedBoard);
    announce(`Imported ${board.name} successfully`);

    // Navigate to board
    navigator?.registerBoard(processedBoard);
    navigator?.navigate(processedBoard.id);

  } catch (error) {
    console.error('Failed to import board:', error);
    announce('Failed to import board', 'assertive');
  }
}, [navigator, announce]);
```

### Phase 6: Attribution & Metadata (Day 4)

**Extended OBF Format:**
Add LoveWords extensions to imported community boards:
```json
{
  "id": "...",
  "name": "...",
  "ext_lovewords_source": "community",
  "ext_lovewords_author": "Jane Doe",
  "ext_lovewords_author_url": "https://github.com/janedoe",
  "ext_lovewords_community_id": "family-my-family",
  "ext_lovewords_community_category": "family",
  "ext_lovewords_imported_at": "2026-01-22T10:00:00Z"
}
```

**Board Info Display:**
- Show attribution in board settings
- "Imported from Community" badge
- Author credit
- Link to original board

### Phase 7: Caching & Performance (Day 4)

**Caching Strategy:**
- Cache catalog in localStorage
- Cache duration: 1 hour
- Background refresh when cache expires
- Fallback to cached data if fetch fails

**Implementation:**
```typescript
interface CachedCatalog {
  data: CommunityCatalog;
  timestamp: number;
}

function getCachedCatalog(): CachedCatalog | null {
  const cached = localStorage.getItem('lovewords-community-catalog');
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > CACHE_DURATION) {
      return null; // Expired
    }

    return parsed;
  } catch {
    return null;
  }
}

function setCachedCatalog(catalog: CommunityCatalog): void {
  const cached: CachedCatalog = {
    data: catalog,
    timestamp: Date.now()
  };
  localStorage.setItem('lovewords-community-catalog', JSON.stringify(cached));
}
```

### Phase 8: Testing & Polish (Day 5)

**Testing:**
- Fetch catalog successfully
- Handle network errors
- Handle invalid JSON
- Handle empty categories
- Search functionality
- Import from each category
- Attribution preserved
- Cache works correctly

**Polish:**
- Loading skeletons for board cards
- Smooth animations
- Error messages
- Success toasts
- Keyboard navigation
- Screen reader support

---

## UI Mockups

### Community Browse Modal

```
┌──────────────────────────────────────────────────────────────┐
│ 🌍 Community Boards                                        ✕ │
├──────────────────────────────────────────────────────────────┤
│ 🔍 [Search community boards...]                              │
├──────────┬───────────────────────────────────────────────────┤
│ ⭐       │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ Featured │ │ My Family   │ │ Emotions    │ │ Morning     │ │
│          │ │ 👨‍👩‍👧‍👦 12 btns│ │ 😊 16 btns  │ │ ☀️ 9 btns   │ │
│ 🆕 New   │ │ 4×4 grid    │ │ 4×4 grid    │ │ 3×3 grid    │ │
│          │ │ by LoveWords│ │ by Jane D.  │ │ by John S.  │ │
│ 📚 All   │ │ [Import]    │ │ [Import]    │ │ [Import]    │ │
│ Boards   │ └─────────────┘ └─────────────┘ └─────────────┘ │
│          │                                                   │
│ ────────│                                                   │
│          │ More boards...                                    │
│ 👨‍👩‍👧‍👦    │                                                   │
│ Family   │                                                   │
│          │                                                   │
│ 🧠       │                                                   │
│ Therapy  │                                                   │
│          │                                                   │
│ 🏠       │                                                   │
│ Daily    │                                                   │
│          │                                                   │
│ 📖       │                                                   │
│ Education│                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

### Board Card Detail

```
┌─────────────────────────────┐
│ My Family                   │
│ 👨‍👩‍👧‍👦                      │
├─────────────────────────────┤
│ Talk about family members   │
│ and relationships.          │
│                             │
│ 📊 12 buttons · 4×4 grid    │
│ 👤 by LoveWords Team        │
│ 🏷️  family, relationships   │
│                             │
│ [💾 Import Board]           │
└─────────────────────────────┘
```

---

## Contribution Guidelines (for CONTRIBUTING.md)

### How to Contribute a Board

1. **Create your board** in LoveWords
2. **Export** the board as `.obf` file
3. **Fork** the lovewords-community-boards repository
4. **Add your board:**
   - Place `.obf` file in appropriate category folder
   - Update `metadata.json` with board info
5. **Create pull request** with:
   - Board file
   - Updated metadata
   - Screenshot (optional)

### Board Quality Criteria

✅ **Must Have:**
- Valid OBF 0.1 format
- Clear, descriptive name
- Helpful description (2-3 sentences)
- Appropriate category
- 3-5 relevant tags
- Author credit

✅ **Best Practices:**
- Use standard grid sizes (3×3, 4×4, 5×4)
- Include 8-20 buttons (not too sparse, not too crowded)
- Use emoji or CC0 images only
- Clear, concise button labels
- Logical button arrangement
- Test before submitting

❌ **Not Allowed:**
- Copyrighted images or content
- Offensive or inappropriate content
- Personal information
- Advertising or promotional content
- Low-quality or test boards

### Review Process

1. **Automated checks:** Format validation, image licensing
2. **Community review:** Other contributors can comment
3. **Maintainer approval:** Final check and merge
4. **Catalog update:** metadata.json updated automatically

---

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Board Ratings:**
   - Star ratings (1-5)
   - Review comments
   - "Helpful" votes

2. **Advanced Search:**
   - Filter by grid size
   - Filter by button count
   - Filter by date added
   - Sort by popularity

3. **Board Thumbnails:**
   - Auto-generate preview images
   - Show in browse modal
   - Better visual recognition

4. **Download Statistics:**
   - Track download counts
   - Show "Most Popular"
   - Show "Trending"

5. **Board Updates:**
   - Notify when boards are updated
   - One-click update imported boards
   - Version history

6. **User Submissions:**
   - Direct submission from app
   - Auto-generate PR
   - OAuth with GitHub

---

## Testing Plan

### Manual Testing

- [ ] Fetch catalog from GitHub
- [ ] Display all categories
- [ ] Display all boards
- [ ] Search boards
- [ ] Filter by category
- [ ] Featured section works
- [ ] New section works
- [ ] Import board from community
- [ ] Attribution preserved
- [ ] Network error handling
- [ ] Cache works correctly
- [ ] Keyboard navigation
- [ ] Screen reader support

### Edge Cases

- [ ] Empty catalog
- [ ] Invalid JSON response
- [ ] Network timeout
- [ ] Malformed board URLs
- [ ] Duplicate board IDs
- [ ] Very large catalog (100+ boards)

---

## Estimated Timeline

| Phase | Task | Duration | Dependencies |
|-------|------|----------|--------------|
| 1 | Repository setup | 4 hours | None |
| 2 | Initial content | 8 hours | Phase 1 |
| 3 | Catalog utilities | 4 hours | Phase 2 |
| 4 | Browse modal UI | 8 hours | Phase 3 |
| 5 | Import integration | 6 hours | Phase 4 |
| 6 | Attribution | 2 hours | Phase 5 |
| 7 | Caching | 3 hours | Phase 5 |
| 8 | Testing & polish | 5 hours | All |
| **Total** | - | **40 hours** | **(5 days)** |

---

## Success Criteria

- [x] Repository created with proper structure
- [x] 10-15 starter boards across 4 categories
- [x] metadata.json catalog working
- [x] Browse modal displays boards correctly
- [x] Import from community works
- [x] Attribution preserved
- [x] Caching implemented
- [x] All manual tests pass
- [x] Documentation complete

---

## Next Steps

1. Create GitHub repository
2. Set up initial structure
3. Create starter boards
4. Implement catalog utilities
5. Build browse modal
6. Integrate with app
7. Test thoroughly
8. Document for users

---

**Status:** Ready to implement
**Blockers:** None
**Dependencies:** Sprint 3 import functionality (✅ Complete)

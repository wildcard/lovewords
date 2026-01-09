# Contributing to LoveWords

**Thank you for wanting to help make communication accessible to everyone.**

Whether you're a developer, designer, speech-language pathologist, AAC user, caregiver, translator, or simply someone who believes in our mission—there's a place for you here. Every contribution, no matter how small, helps someone communicate.

---

## Table of Contents

- [Our Philosophy](#our-philosophy)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started with Development](#getting-started-with-development)
- [Code Standards](#code-standards)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Community Values & Code of Conduct](#community-values--code-of-conduct)
- [Recognition](#recognition)

---

## Our Philosophy

Before diving into the how, let's talk about the why.

LoveWords exists because communication is a human right. Every decision we make—from architecture to icon placement—should be guided by this question: **Does this help someone be heard?**

We believe:

- **Lived experience is expertise.** If you use AAC, you know things no amount of research can teach us.
- **All contributions matter.** A well-written tutorial can be as impactful as a new feature.
- **Accessibility is non-negotiable.** Every contribution must be usable by everyone.
- **Kindness scales.** How we treat each other shapes what we build.

---

## Ways to Contribute

### You Don't Need to Code

Some of our most valuable contributions come from people who never touch the codebase. Here's how you can help:

#### Share Your Experience

**For AAC users:**
Your voice matters most. Tell us:
- What works well in LoveWords? What's frustrating?
- What features would make your life easier?
- How do you actually use AAC throughout your day?

You can share via GitHub issues, discussions, or email. If typing is difficult, voice recordings or video are welcome.

**For speech-language pathologists & educators:**
- Review our symbol choices and vocabulary organization
- Suggest evidence-based features
- Help us understand clinical workflows
- Test with your clients (with appropriate consent) and share feedback

**For caregivers & families:**
- Tell us about setup and customization pain points
- Share what vocabulary your loved one needs most
- Help us understand different communication contexts (home, school, community)

#### Create Communication Boards

Pre-made boards help new users get started quickly. You can contribute:
- **Starter boards** for specific age groups or skill levels
- **Topic boards** (food, feelings, activities, medical, school)
- **Culturally-specific boards** for different communities
- **Specialized boards** for specific conditions or contexts

No coding required—we'll provide templates and a simple board creation guide.

#### Design & Visual Assets

- **Symbols:** Create open-licensed communication symbols
- **Icons:** Design UI icons that are clear at small sizes
- **Themes:** Design color themes, including high-contrast options
- **Illustrations:** Create welcoming graphics for documentation and marketing

#### Translation & Localization

Help make LoveWords available in more languages:
- **Interface translation:** Buttons, menus, and system messages
- **Vocabulary translation:** Core word sets and phrases
- **Cultural adaptation:** Adjusting boards for regional differences
- **Documentation:** Translating guides and tutorials

#### Documentation & Education

- **User guides:** Help families and caregivers get started
- **Video tutorials:** Visual walkthroughs of features
- **Case studies:** Document how LoveWords is being used
- **Academic resources:** Connect our work to AAC research

#### Testing & Feedback

- **Accessibility testing:** Test with assistive technologies
- **Device testing:** Try LoveWords on different devices and browsers
- **Bug reporting:** Detailed bug reports are incredibly helpful
- **Feature feedback:** Try new features and share your thoughts

---

### Technical Contributions

If you do code, design interfaces, or work with technical systems, here's how to help:

#### Code Contributions

- **Bug fixes:** Check issues labeled `bug`
- **New features:** Look for `help wanted` or `good first issue`
- **Performance:** Help us stay fast on low-powered devices
- **Offline capabilities:** Improve our offline-first architecture
- **Accessibility:** Enhance support for assistive technologies

#### Technical Design

- **UI/UX design:** Create intuitive, accessible interfaces
- **Interaction design:** Design for switch scanning, eye gaze, and touch
- **Information architecture:** Organize features logically

#### Infrastructure

- **Build systems:** Improve our development workflow
- **Testing:** Expand our test coverage, especially accessibility tests
- **CI/CD:** Help automate quality checks
- **Documentation:** Technical docs, API references, architecture guides

---

## Getting Started with Development

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- A modern web browser

### Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/lovewords.git
cd lovewords

# 3. Add the upstream remote
git remote add upstream https://github.com/your-org/lovewords.git

# 4. Install dependencies
npm install

# 5. Start the development server
npm run dev

# 6. Open http://localhost:3000 in your browser
```

### Development Workflow

```bash
# Create a branch for your work
git checkout -b feature/your-feature-name

# Make your changes, then test
npm run test
npm run lint

# Commit with a descriptive message
git commit -m "Add feature: brief description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

### Project Structure

```
lovewords/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main application pages
│   ├── services/       # Business logic and data handling
│   ├── assets/         # Images, symbols, sounds
│   ├── i18n/           # Internationalization files
│   └── styles/         # Global styles and themes
├── public/             # Static files
├── tests/              # Test files
├── docs/               # Documentation
└── boards/             # Pre-made communication boards
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run test suite |
| `npm run test:a11y` | Run accessibility tests |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix style issues |

### Getting Help

Stuck? That's okay! Here's how to get help:

1. **Check the docs:** Look in `/docs` for guides
2. **Search issues:** Someone may have had the same question
3. **Ask in discussions:** No question is too basic
4. **Reach out:** Tag a maintainer if you're blocked

We'd rather answer questions than lose a contributor. Please ask!

---

## Code Standards

Good code helps future contributors. Here's what we aim for:

### General Principles

- **Clarity over cleverness:** Write code that's easy to understand
- **Accessibility first:** Every feature must be accessible from the start
- **Offline-first:** Assume no network connection
- **Performance matters:** Our users may have older devices
- **Test your work:** If it's not tested, it's not done

### JavaScript/TypeScript

```javascript
// Use clear, descriptive names
const speakMessage = (message) => { ... }  // Good
const sm = (m) => { ... }                   // Avoid

// Document complex logic
/**
 * Calculates the optimal grid layout based on the number of symbols
 * and the user's motor accessibility settings.
 */
function calculateGridLayout(symbolCount, accessibilitySettings) {
  // ...
}

// Handle errors gracefully
try {
  await synthesizeSpeech(text);
} catch (error) {
  // Provide fallback, don't just fail silently
  showVisualFeedback(text);
  logError(error);
}
```

### CSS/Styling

```css
/* Use relative units for accessibility */
.button {
  font-size: 1rem;        /* Good: scales with user preferences */
  padding: 0.75em 1.5em;  /* Good: scales with font size */
  min-height: 44px;       /* Good: meets touch target guidelines */
}

/* Support high contrast mode */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
```

### Commit Messages

Write commits that tell a story:

```
Add switch scanning support for communication boards

- Implement row-column scanning pattern
- Add configurable scan timing (0.5s - 5s)
- Include audio feedback on focus change
- Support single-switch and two-switch modes

Closes #123
```

### Pull Request Guidelines

A good PR:
- **Focuses on one thing:** Don't mix unrelated changes
- **Includes tests:** For new features and bug fixes
- **Updates documentation:** If behavior changes
- **Passes CI checks:** All tests and linting must pass
- **Has a clear description:** Explain what and why

---

## Accessibility Guidelines

**This is the most important section.** Every contribution to LoveWords must be accessible. No exceptions.

### The Basics

Every feature must work with:
- **Keyboard only:** No mouse required
- **Screen readers:** NVDA, JAWS, VoiceOver, TalkBack
- **Switch access:** Single-switch scanning at minimum
- **High contrast:** Visible in forced-colors mode
- **Zoom:** Usable at 200% zoom

### Testing Your Contribution

Before submitting, test with:

1. **Keyboard navigation**
   - Can you reach everything with Tab?
   - Can you activate everything with Enter/Space?
   - Is the focus indicator visible?

2. **Screen reader**
   - Are all elements announced correctly?
   - Do images have alt text?
   - Are state changes announced?

3. **Color and contrast**
   - Does it work in high contrast mode?
   - Is color not the only way to convey information?
   - Do text colors have sufficient contrast (4.5:1 minimum)?

4. **Motion and animation**
   - Is animation optional or minimal?
   - Does it respect `prefers-reduced-motion`?

5. **Touch targets**
   - Are interactive elements at least 44x44 pixels?
   - Is there enough space between targets?

### Component Requirements

| Element | Requirements |
|---------|--------------|
| Buttons | Keyboard accessible, visible focus, clear label |
| Images | Meaningful alt text (or empty alt for decorative) |
| Forms | Labels associated with inputs, error messages linked |
| Modals | Focus trapped, Escape to close, focus returns on close |
| Custom widgets | Full ARIA implementation, keyboard support |

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### When in Doubt

If you're unsure whether something is accessible:
1. Ask in your PR—we're happy to help
2. Tag an issue with `accessibility`
3. Ship a basic accessible version first, then enhance

**We'd rather have simple and accessible than fancy and broken.**

---

## Community Values & Code of Conduct

### Our Values

**Empathy First**
We're building for people who may be frustrated, exhausted, or fighting for their basic right to communicate. Let that reality guide every interaction.

**Assume Good Intent**
Contributors come from different backgrounds and skill levels. If something seems wrong, ask clarifying questions before assuming the worst.

**Celebrate All Contributions**
A first-time contributor's typo fix is worth celebrating. A user's bug report is a gift. Recognition isn't reserved for big features.

**Be Patient**
Some contributors use AAC themselves and may communicate differently or more slowly. Give people time and space.

**Stay Humble**
None of us has all the answers. Be open to feedback, especially from AAC users and professionals.

### Code of Conduct

We are committed to providing a welcoming, safe, and inclusive environment for everyone, regardless of:

- Age, disability, or health status
- Gender identity and expression
- Level of experience
- Nationality, ethnicity, or race
- Personal appearance
- Religion or lack thereof
- Sexual identity and orientation
- Socioeconomic status
- Communication style or method

### Expected Behavior

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for AAC users
- Show empathy toward other community members

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Dismissive or demeaning comments
- Personal attacks or trolling
- Publishing others' private information
- Mocking communication differences
- Any conduct inappropriate for a professional setting

### Enforcement

Violations can be reported to [conduct@lovewords.example.com]. All reports will be reviewed promptly and confidentially.

We will take appropriate action, which may include:
- A private warning
- A public warning
- Temporary ban
- Permanent ban

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.1.

---

## Recognition

We believe in celebrating contributions. Here's how we say thank you:

- **Contributors list:** All contributors are listed in our README
- **Release notes:** Contributors are credited for their work
- **Swag:** Active contributors may receive LoveWords stickers and merchandise
- **Recommendations:** We're happy to serve as references for dedicated contributors

---

## Questions?

Still have questions? Here's how to reach us:

- **GitHub Discussions:** Best for general questions
- **GitHub Issues:** For bugs and feature requests
- **Email:** [hello@lovewords.example.com]

---

<p align="center">
  <strong>Thank you for helping give voice to those who communicate differently.</strong>
  <br>
  <em>Every contribution brings us closer to a world where everyone can be heard.</em>
</p>

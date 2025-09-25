# Product Roadmap

## Phase 1: Core MVP

**Goal:** Deliver essential missing Gutenberg block controls and style options.  
**Success Criteria:** Plugin installs and activates without errors; provides at least 5 key style/formatting controls that Gutenberg lacks.

### Features

- [ ] Advanced Typography Controls – font size, line-height, letter spacing, text shadows `[M]`
- [ ] Spacing Controls – margin, padding, gap controls per block `[M]`
- [ ] Border & Radius Controls – full control over block borders, radii, and outlines `[S]`
- [ ] Background Enhancements – gradients, overlay colors, images `[M]`
- [ ] Copy/Paste Block Styles – replicate styles across blocks `[S]`

### Dependencies
- Gutenberg Block Editor API  
- WordPress 6.5+  

---

## Phase 2: Key Differentiators

**Goal:** Add unique features that distinguish Forjeon from competitors like Editor Plus.  
**Success Criteria:** At least 3 differentiating features that improve workflow or design flexibility beyond competing plugins.

### Features

- [ ] Preset Style System – save & reuse custom style sets across blocks `[M]`
- [ ] Role-Based Editing Controls – allow/disallow style options for specific user roles `[M]`
- [ ] Global Design Tokens – color palettes, font sets, spacing units `[L]`
- [ ] Advanced Responsive Controls – per-device visibility, alignment, spacing `[M]`

### Dependencies
- WordPress global styles (theme.json)  
- User capability API  

---

## Phase 3: Scale and Polish

**Goal:** Optimize usability, performance, and prepare for large-scale adoption.  
**Success Criteria:** 1,000+ active installs, positive reviews (4.5+ rating on wp.org), < 1s plugin overhead.

### Features

- [ ] UI/UX Polish – improved inspector panel UI, tooltips, inline previews `[M]`
- [ ] Performance Optimizations – tree-shaking, only load styles when needed `[M]`
- [ ] Compatibility Layer – tested with top 10 themes & block plugins `[L]`
- [ ] Import/Export Styles – JSON import/export of saved design tokens `[S]`
- [ ] Onboarding Experience – setup wizard & usage guides `[S]`

### Dependencies
- Testing suite (PHPUnit, Jest)  
- GitHub Actions for CI/CD  
- WP.org deployment pipeline  

---

**Effort Scale:**  
- XS: 1 day  
- S: 2-3 days  
- M: 1 week  
- L: 2 weeks  
- XL: 3+ weeks  

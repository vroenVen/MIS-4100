# Priority System Implementation Guide

## Overview
The OPal Tasks page now includes a comprehensive AI-driven priority indicator system. Each task displays a priority badge that shows an AI-generated priority score (1-10) based on cognitive load, urgency, and task difficulty.

## Visual Design

### Priority Badges
- **Location**: Top-right corner of each task card (next to task title)
- **Style**: Rounded pill badge with colored dot, numeric value, and optional label
- **Sizes**: Small, medium, and large variants available
- **States**: No priority, Low (1-3), Medium (4-6), High (7-10)

### Color Coding
All priority levels use theme-aware, WCAG AA compliant color combinations:

- **Low Priority (1-3)**: Primary theme color (typically green/blue tones)
  - Visual: Colored dot + number
  - Use case: Low cognitive load, flexible deadline
  
- **Medium Priority (4-6)**: Tertiary theme color (typically blue/purple tones)
  - Visual: Colored dot + number
  - Use case: Moderate complexity and urgency
  
- **High Priority (7-10)**: Secondary theme color (typically red/orange tones)
  - Visual: Alert icon + colored dot + number
  - Use case: High cognitive load or urgent deadline
  
- **No Priority**: Quaternary theme color with reduced opacity
  - Visual: Dash symbol (—) in muted colors
  - Use case: Priority not yet assigned by AI

## Theme Compatibility

The priority system works seamlessly across all 6 character themes:
- 🐱 Cat (Pink, Light Brown, Brown, Black)
- 🦟 Dragonfly (Yellow, Red, Purple, Turquoise)
- 🐻 Bear (Green, Brown, Orange, Black)
- 🐟 Fish (Black, Cyan, White, Salmon)
- 🐰 Bunny (Tan, Light Green, Mint Green, Gray-Blue)
- 🦊 Fox (Dark Gray, Orange, Blue, Cream)

The system automatically adapts to both light and dark mode settings.

## Backend Integration

### Task Object Structure
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
  subtasks?: SubTask[];
  priority?: number; // 1-10 scale, AI-generated
}
```

### API Contract
When creating or updating tasks via your backend API, include the `priority` field:

```json
{
  "id": "task-123",
  "title": "Complete project report",
  "priority": 8,
  "date": "2026-04-10",
  "completed": false,
  "subtasks": []
}
```

### Priority Calculation
The AI backend should calculate priority based on:
1. **Cognitive Load**: Task complexity and mental effort required
2. **Urgency**: Time sensitivity and deadline proximity
3. **Task Difficulty**: Estimated effort and skill level needed

Output: Numeric score from 1 (lowest) to 10 (highest)

### Handling Missing Priorities
- If `priority` is `undefined` or `null`, the badge displays in a muted state with "—"
- The UI gracefully handles missing priority data
- Priorities can be added/updated at any time via the API

## Component Usage

### PriorityBadge Component
```tsx
import { PriorityBadge } from "../components/PriorityBadge";

// Basic usage
<PriorityBadge priority={8} />

// With size specification
<PriorityBadge priority={5} size="small" />
<PriorityBadge priority={7} size="medium" />
<PriorityBadge priority={3} size="large" />

// With label
<PriorityBadge priority={9} showLabel />

// No priority assigned
<PriorityBadge priority={undefined} />
```

### Props
- `priority?: number` - Priority score from 1-10 (optional)
- `size?: 'small' | 'medium' | 'large'` - Badge size (default: 'medium')
- `showLabel?: boolean` - Show text label like "High", "Med", "Low" (default: false)

## Accessibility

### WCAG Compliance
- All color combinations meet WCAG AA contrast requirements (4.5:1 minimum)
- Tested across all 6 themes and both light/dark modes
- High priority items include an alert icon for additional visual distinction

### Screen Reader Support
- Each badge includes `role="status"` and `aria-label` attributes
- Tooltips provide priority information on hover
- Semantic HTML ensures proper navigation

## Implementation Locations

The priority system is integrated across multiple pages:

1. **Tasks Page** (`/src/app/pages/Tasks.tsx`)
   - Main task list with priority badges
   - Priority badges appear on all task cards
   
2. **Home Dashboard** (`/src/app/pages/Home.tsx`)
   - Today's tasks section shows priorities
   - Helps users identify urgent items at a glance
   
3. **Calendar Page** (`/src/app/pages/Calendar.tsx`)
   - Priority indicators in day/week views
   - Month view maintains clean, compact display

## Demo & Testing

### Priority Demo Page
Visit `/priority-demo` to see:
- All priority states (1-10 plus no priority)
- All badge sizes (small, medium, large)
- Theme adaptation across different color schemes
- Integration guide for backend developers

### Current Demo Behavior
In the current implementation, priorities are randomly assigned (1-10) when creating new tasks. This allows you to:
- See the full range of priority states
- Test theme compatibility
- Verify accessibility across all combinations

**For Production**: Replace the random assignment with actual AI-generated priorities from your backend API.

## Production Deployment

### Remove Demo Code
Before production deployment:
1. Remove the info banner on the Tasks page (lines marked "Remove in production")
2. Replace random priority generation with actual API calls
3. Optionally remove the `/priority-demo` route

### API Integration Steps
1. Update `addTask` function to receive priority from backend
2. Implement API endpoint to fetch/update task priorities
3. Add loading states while priorities are being calculated
4. Handle API errors gracefully with fallback to "no priority" state

## Code Structure

### Components
- `/src/app/components/PriorityBadge.tsx` - Main badge component with full documentation
- `/src/app/components/PriorityDemo.tsx` - Demo/testing page component

### Context
- `/src/app/contexts/AppContext.tsx` - Task interface includes optional priority field

### Pages
- `/src/app/pages/Tasks.tsx` - Main implementation
- `/src/app/pages/Home.tsx` - Dashboard integration
- `/src/app/pages/Calendar.tsx` - Calendar view integration

## Best Practices

### When to Show Priority
- **Always visible**: Task list view, today's tasks
- **On hover/expand**: Compact calendar views
- **Optional**: Completed tasks (can show muted priority)

### Performance
- Priority badges are lightweight (no external dependencies except Lucide icons)
- Color calculations are memoized within the component
- No performance impact on large task lists

### Maintenance
- All colors are derived from the theme system
- No hardcoded colors in priority components
- Easy to adjust priority thresholds (currently 1-3, 4-6, 7-10)

## Support

For questions about:
- **Frontend implementation**: Review PriorityBadge component documentation
- **Backend integration**: See API Contract section above
- **Theme customization**: Check ThemeContext.tsx
- **Accessibility**: All WCAG requirements are documented in the component

---

**Last Updated**: April 6, 2026
**Component Version**: 1.0
**Compatible with**: OPal v0.0.1

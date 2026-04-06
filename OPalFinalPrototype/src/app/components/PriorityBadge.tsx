import { useTheme } from "../contexts/ThemeContext";
import { AlertCircle } from "lucide-react";

/**
 * PriorityBadge Component
 * 
 * A reusable, theme-aware priority indicator for task items.
 * Displays AI-generated priority scores with accessible color-coded badges.
 * 
 * INTEGRATION GUIDE FOR BACKEND DEVELOPERS:
 * ------------------------------------------
 * 
 * Priority Scale: 1-10 (numeric)
 * - 1-3: Low priority (displayed in primary color - typically green/blue tones)
 * - 4-6: Medium priority (displayed in tertiary color - typically blue/purple tones)
 * - 7-10: High priority (displayed in secondary color - typically red/orange tones with alert icon)
 * - undefined/null: Shows "not assigned" state (muted appearance)
 * 
 * Backend API Contract:
 * ---------------------
 * When creating or updating tasks, include a "priority" field:
 * 
 * Example Task Object:
 * {
 *   id: "task-123",
 *   title: "Complete project report",
 *   priority: 8,  // AI-generated score based on cognitive load, urgency, difficulty
 *   date: "2026-04-10",
 *   completed: false
 * }
 * 
 * Priority Calculation Factors (handled by AI backend):
 * - Cognitive load: Task complexity and mental effort required
 * - Urgency: Time sensitivity and deadline proximity
 * - Task difficulty: Estimated effort and skill level needed
 * 
 * Accessibility:
 * --------------
 * All color combinations meet WCAG AA contrast requirements.
 * Each badge includes:
 * - Visual indicator (colored dot + number)
 * - High priority items show alert icon
 * - Tooltip with priority level
 * - ARIA labels for screen readers
 * 
 * Usage Examples:
 * ---------------
 * <PriorityBadge priority={8} size="small" />
 * <PriorityBadge priority={task.priority} size="medium" showLabel />
 * <PriorityBadge priority={undefined} /> // Not assigned state
 * 
 * Theme Support:
 * --------------
 * The component automatically adapts to all 6 character themes (Cat, Dragonfly, Bear, Fish, Bunny, Fox)
 * and respects dark mode settings, maintaining accessibility across all theme combinations.
 */

export type PriorityLevel = 'none' | 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority?: number; // 1-10 scale
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function PriorityBadge({ priority, size = 'medium', showLabel = false }: PriorityBadgeProps) {
  const { theme } = useTheme();

  // Determine priority level from numeric value
  const getPriorityLevel = (value?: number): PriorityLevel => {
    if (value === undefined || value === null) return 'none';
    if (value <= 3) return 'low';
    if (value <= 6) return 'medium';
    return 'high';
  };

  const level = getPriorityLevel(priority);

  // Get accessible color combinations for each priority level
  const getPriorityColors = () => {
    switch (level) {
      case 'high':
        return {
          bg: theme.colors.secondary,
          text: theme.textOnSecondary,
          label: 'High',
        };
      case 'medium':
        return {
          bg: theme.colors.tertiary,
          text: theme.textOnTertiary,
          label: 'Med',
        };
      case 'low':
        return {
          bg: theme.colors.primary,
          text: theme.textOnPrimary,
          label: 'Low',
        };
      default:
        return {
          bg: theme.colors.quaternary,
          text: theme.textOnQuaternary,
          label: 'N/A',
        };
    }
  };

  const colors = getPriorityColors();

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'px-1.5 py-0.5',
      text: 'text-xs',
      icon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
    },
    medium: {
      padding: 'px-2 py-1',
      text: 'text-sm',
      icon: 'w-4 h-4',
      dot: 'w-2 h-2',
    },
    large: {
      padding: 'px-3 py-1.5',
      text: 'text-base',
      icon: 'w-5 h-5',
      dot: 'w-2.5 h-2.5',
    },
  };

  const config = sizeConfig[size];

  // Don't render if no priority and not showing label
  if (level === 'none' && !showLabel) {
    return (
      <div
        className={`${config.padding} rounded-full flex items-center gap-1 ${config.text} font-semibold`}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          opacity: 0.4,
        }}
        title="Priority not assigned"
      >
        <div
          className={`${config.dot} rounded-full`}
          style={{ backgroundColor: colors.text }}
        />
        <span>—</span>
      </div>
    );
  }

  return (
    <div
      className={`${config.padding} rounded-full flex items-center gap-1.5 ${config.text} font-semibold`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      title={`Priority: ${priority || 'Not assigned'} ${level !== 'none' ? `(${colors.label})` : ''}`}
      role="status"
      aria-label={`Priority level: ${level !== 'none' ? colors.label : 'Not assigned'}`}
    >
      {level === 'high' && <AlertCircle className={config.icon} />}
      <div
        className={`${config.dot} rounded-full`}
        style={{ backgroundColor: colors.text }}
      />
      <span>{priority || '—'}</span>
      {showLabel && level !== 'none' && (
        <span className="ml-0.5">{colors.label}</span>
      )}
    </div>
  );
}

// Variant for displaying inline priority indicator with just dot and number
export function PriorityDot({ priority }: { priority?: number }) {
  const { theme } = useTheme();

  const getPriorityLevel = (value?: number): PriorityLevel => {
    if (value === undefined || value === null) return 'none';
    if (value <= 3) return 'low';
    if (value <= 6) return 'medium';
    return 'high';
  };

  const level = getPriorityLevel(priority);

  const getPriorityColor = () => {
    switch (level) {
      case 'high':
        return theme.colors.secondary;
      case 'medium':
        return theme.colors.tertiary;
      case 'low':
        return theme.colors.primary;
      default:
        return theme.colors.quaternary;
    }
  };

  if (level === 'none') return null;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getPriorityColor() }}
        title={`Priority: ${priority}`}
      />
      <span className="text-sm font-semibold">{priority}</span>
    </div>
  );
}
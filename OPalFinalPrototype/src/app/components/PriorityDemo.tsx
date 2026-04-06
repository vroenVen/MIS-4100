import { useTheme } from "../contexts/ThemeContext";
import { PriorityBadge } from "./PriorityBadge";

/**
 * Demo component showing all priority states for documentation/testing
 * This can be used by developers to understand how priority values map to visual states
 */
export function PriorityDemo() {
  const { theme, darkMode } = useTheme();
  
  const backgroundColor = darkMode ? theme.surface : theme.background;
  const textColor = darkMode ? theme.surfaceText : theme.text;

  const priorityExamples = [
    { priority: undefined, label: 'No Priority Assigned', description: 'Priority not yet set by AI' },
    { priority: 1, label: 'Low Priority (1-3)', description: 'Low cognitive load, low urgency' },
    { priority: 3, label: 'Low Priority', description: 'Simple task, flexible deadline' },
    { priority: 5, label: 'Medium Priority (4-6)', description: 'Moderate complexity and urgency' },
    { priority: 6, label: 'Medium Priority', description: 'Important but not critical' },
    { priority: 8, label: 'High Priority (7-10)', description: 'High cognitive load or urgent' },
    { priority: 10, label: 'High Priority', description: 'Critical task, immediate attention' },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Priority System Demo</h1>
        <p className="opacity-70 mb-6">
          All priority states with theme-aware, accessible color combinations
        </p>

        <div className="space-y-4">
          {priorityExamples.map((example, index) => (
            <div
              key={index}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.textOnSecondary,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="font-semibold">{example.label}</div>
                  <div className="text-sm opacity-70 mt-1">{example.description}</div>
                </div>
                <PriorityBadge priority={example.priority} size="medium" />
              </div>
              
              <div className="flex gap-2 mt-3">
                <div className="text-xs opacity-70">Badge sizes:</div>
                <PriorityBadge priority={example.priority} size="small" />
                <PriorityBadge priority={example.priority} size="medium" />
                <PriorityBadge priority={example.priority} size="large" />
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 p-4 rounded-lg"
          style={{
            backgroundColor: theme.colors.tertiary,
            color: theme.textOnTertiary,
          }}
        >
          <h3 className="font-semibold mb-2">For Backend Developers:</h3>
          <ul className="text-sm space-y-1 opacity-90">
            <li>• Priority scale: 1-10 (numeric)</li>
            <li>• 1-3: Low priority (green/primary color)</li>
            <li>• 4-6: Medium priority (blue/tertiary color)</li>
            <li>• 7-10: High priority (red/secondary color with alert icon)</li>
            <li>• undefined/null: Shows "not assigned" state</li>
            <li>• All colors meet WCAG AA contrast requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

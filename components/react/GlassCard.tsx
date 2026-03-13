/**
 * GlassCard — A ready-to-use frosted glass card component.
 *
 * Example component built with solid-glass. Use as a starting point
 * for building glass-styled UI elements in your own projects.
 *
 * @example
 * ```tsx
 * import { GlassCard } from "./components/react/GlassCard";
 *
 * <GlassCard title="Notification" subtitle="You have 3 new messages">
 *   <p>Preview of the latest message...</p>
 * </GlassCard>
 * ```
 */
import React from "react";
import { Glass } from "solid-glass/react";

export interface GlassCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  effect?: "frosted" | "crystal" | "aurora" | "thin";
  blur?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
  effect = "frosted",
  blur = 16,
}) => {
  return (
    <Glass
      effect={effect}
      options={{ blur, tintColor: "#ffffff", tintOpacity: 0.1, borderRadius: 20 } as never}
      className={`p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      )}
      {subtitle && (
        <p className="text-sm text-white/60 mb-3">{subtitle}</p>
      )}
      {children}
    </Glass>
  );
};

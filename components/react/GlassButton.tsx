/**
 * GlassButton — A glass-styled button with hover effects.
 *
 * Example component built with solid-glass. Demonstrates using the
 * useGlass hook for interactive elements.
 *
 * @example
 * ```tsx
 * import { GlassButton } from "./components/react/GlassButton";
 *
 * <GlassButton onClick={() => alert("Clicked!")}>
 *   Get Started
 * </GlassButton>
 * ```
 */
import React from "react";
import { Glass, type GlassEffectName } from "solid-glass/react";

export interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  effect?: GlassEffectName;
  className?: string;
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  effect = "frosted",
  className = "",
  disabled = false,
}) => {
  return (
    <Glass
      as="button"
      effect={effect}
      options={{ blur: 12, tintColor: "#ffffff", tintOpacity: 0.08, borderRadius: 12 } as never}
      className={`px-5 py-2.5 text-sm font-medium text-white cursor-pointer
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Glass>
  );
};

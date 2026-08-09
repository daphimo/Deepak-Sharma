import type { HTMLAttributes, ReactNode } from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

/**
 * Compatibility wrapper retained for existing call sites. The cursor-distance
 * tracking and magnetic movement were intentionally removed.
 */
export default function Magnet({
  children,
  wrapperClassName = "",
  innerClassName = "",
  padding: _padding,
  disabled: _disabled,
  magnetStrength: _magnetStrength,
  activeTransition: _activeTransition,
  inactiveTransition: _inactiveTransition,
  style,
  ...props
}: MagnetProps) {
  void _padding;
  void _disabled;
  void _magnetStrength;
  void _activeTransition;
  void _inactiveTransition;

  return (
    <div
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...props}
    >
      <div className={innerClassName}>{children}</div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: string;
}

export function Card({ glow, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-4",
        className
      )}
      style={glow ? { boxShadow: `0 0 24px ${glow}22` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

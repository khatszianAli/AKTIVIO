import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "neon";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variants = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
  ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300",
  danger: "bg-red-600/90 hover:bg-red-500 text-white",
  neon: "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

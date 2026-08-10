import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--madam-green)] text-white hover:bg-[var(--madam-green-dark)] border border-transparent",
  secondary:
    "bg-[var(--madam-coral)] text-white hover:bg-[#d44833] border border-transparent",
  outline:
    "bg-transparent text-[var(--madam-green)] border-2 border-[var(--madam-green)] hover:bg-[var(--madam-green)] hover:text-white",
} as const;

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold uppercase tracking-wide transition-[colors,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--madam-green)]",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

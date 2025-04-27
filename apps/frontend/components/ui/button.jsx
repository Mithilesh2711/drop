import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
    outline: "border-2 border-gray-300 bg-background hover:bg-gray-100 hover:border-gray-400 active:scale-95 active:bg-gray-200 transition-all duration-150",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
    ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

import * as React from "react"
import { cn } from "@/lib/utils"

const Spinner = React.forwardRef(({ className = "", size = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
      size === "sm" && "h-4 w-4",
      size === "md" && "h-6 w-6",
      size === "lg" && "h-8 w-8",
      className
    )}
    role="status"
    {...props}
  >
    <span className="sr-only">Loading...</span>
  </div>
))
Spinner.displayName = "Spinner"

export { Spinner } 
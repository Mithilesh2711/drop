import * as React from "react"
import { cn } from "../../lib/utils"
import { Spinner } from "./spinner"

const LoadingOverlay = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Spinner size="lg" className="text-primary" />
    </div>
  )
})
LoadingOverlay.displayName = "LoadingOverlay"

export { LoadingOverlay } 
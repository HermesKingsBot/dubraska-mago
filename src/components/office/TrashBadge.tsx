"use client"

import React from "react"

interface TrashBadgeProps {
  count: number
}

function TrashBadge({ count }: TrashBadgeProps): React.JSX.Element | null {
  if (count === 0) return null

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
      {count > 99 ? "99+" : count}
    </span>
  )
}

export default TrashBadge

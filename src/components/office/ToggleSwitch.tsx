import React from "react"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md"
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
}: ToggleSwitchProps): React.JSX.Element {
  const dims = size === "sm" ? "w-8 h-4" : "w-10 h-5"
  const dot = size === "sm" ? "w-3 h-3" : "w-4 h-4"
  const translate = checked
    ? size === "sm"
      ? "translate-x-4"
      : "translate-x-5"
    : "translate-x-0.5"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${dims} rounded-full relative transition-colors duration-200 flex-shrink-0 ${
        checked ? "bg-[var(--color-gold)]" : "bg-[#333]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 ${dot} rounded-full bg-white shadow transition-transform duration-200 ${translate}`}
      />
    </button>
  )
}

export default ToggleSwitch

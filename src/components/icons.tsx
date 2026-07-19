type IconProps = { className?: string }

const s = { stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function Sun({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

export function Moon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export function Play({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M5 12h14m-6-6l6 6-6 6" />
    </svg>
  )
}

export function Copy({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

export function Download({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

export function Upload({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

export function Reset({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

export function Maximize({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  )
}

export function Terminal({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export function Eye({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export function External({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function Close({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function Code({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}

export function List({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

export function Lines({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M3 7h3M3 12h3M3 17h3M10 7h11M10 12h11M10 17h11" />
    </svg>
  )
}

export function FontDecrease({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 20h16M4 20l8-16 8 16" />
    </svg>
  )
}

export function FontIncrease({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M4 20h16M12 4v16" />
    </svg>
  )
}

export function Brand({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3z" />
    </svg>
  )
}

export function Check({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function Search({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...s}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

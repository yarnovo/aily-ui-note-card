import type { NoteCardProps } from './NoteCard.types'
import './NoteCard.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong NoteCard · Web · DOM `<button>` */
export function NoteCard(props: NoteCardProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-note-card',
        `ak-note-card--${variant}`,
        `ak-note-card--${size}`,
        fullWidth && 'ak-note-card--full-width',
        loading && 'ak-note-card--loading',
      )}
    >
      {iconLeft && <span className="ak-note-card__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-note-card__icon">{iconRight}</span>}
    </button>
  )
}

export default NoteCard

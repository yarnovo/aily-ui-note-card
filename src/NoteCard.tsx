import { useState, useCallback } from 'react'
import type { MouseEvent, KeyboardEvent } from 'react'
import type { NoteCardProps } from './NoteCard.types'
import { formatLikes, optimisticLike } from './NoteCard.behavior'
import './NoteCard.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** 心形 SVG (stroke 默认 · liked 时 CSS fill) */
function HeartIcon() {
  return (
    <svg
      className="ak-note-card__like-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-testid="note-card-heart-icon"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

/** akong NoteCard · Web · 小红书风瀑布流卡片 */
export function NoteCard(props: NoteCardProps) {
  const {
    cover,
    title,
    author,
    likes: likesProp,
    liked: likedProp = false,
    ratio = 1.0,
    onLike,
    onPress,
    ariaLabel,
  } = props

  // optimistic 本地态 · 不需要等服务端回
  const [liked, setLiked] = useState(likedProp)
  const [likes, setLikes] = useState(likesProp)

  const handleCardClick = useCallback(() => {
    onPress?.()
  }, [onPress])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPress?.()
      }
    },
    [onPress],
  )

  const handleLikeClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // 阻止冒泡到卡片 · 防触发 onPress
      e.stopPropagation()
      if (!onLike) return
      const next = optimisticLike(liked, likes)
      setLiked(next.liked)
      setLikes(next.likes)
      onLike()
    },
    [liked, likes, onLike],
  )

  // 头像缺失 placeholder
  const avatarNode = author.avatar ? (
    <img
      className="ak-note-card__avatar"
      src={author.avatar}
      alt=""
      data-testid="note-card-avatar"
    />
  ) : (
    <span
      className="ak-note-card__avatar ak-note-card__avatar--placeholder"
      aria-hidden="true"
      data-testid="note-card-avatar-placeholder"
    >
      {author.name?.[0] ?? '?'}
    </span>
  )

  return (
    <div
      className="ak-note-card"
      role="link"
      tabIndex={0}
      aria-label={ariaLabel ?? title}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      data-testid="note-card"
    >
      <div
        className="ak-note-card__cover"
        style={{ aspectRatio: `1 / ${ratio}` }}
        data-testid="note-card-cover"
      >
        {cover && (
          <img
            className="ak-note-card__cover-img"
            src={cover}
            alt={title}
            loading="lazy"
            data-testid="note-card-cover-img"
          />
        )}
      </div>

      <div className="ak-note-card__body">
        <div className="ak-note-card__title" data-testid="note-card-title">
          {title}
        </div>

        <div className="ak-note-card__footer">
          <div className="ak-note-card__author" data-testid="note-card-author">
            {avatarNode}
            <span className="ak-note-card__author-name">{author.name}</span>
          </div>

          <button
            type="button"
            className={cls(
              'ak-note-card__like',
              liked && 'ak-note-card__like--liked',
            )}
            onClick={handleLikeClick}
            aria-pressed={liked}
            aria-disabled={!onLike || undefined}
            aria-label={liked ? '取消点赞' : '点赞'}
            data-testid="note-card-like"
          >
            <HeartIcon />
            <span data-testid="note-card-likes">{formatLikes(likes)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard

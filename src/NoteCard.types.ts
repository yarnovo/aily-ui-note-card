/**
 * akong NoteCard · 共享 props · Web + RN 跨端
 *
 * 小红书风瀑布流卡片 · 封面 + 标题 + 作者 + 点赞数
 */

export interface NoteCardAuthor {
  id: string
  name: string
  avatar: string
}

export interface NoteCardProps {
  /** 笔记 id (必填) */
  id: string
  /** 封面图 URL */
  cover: string
  /** 笔记标题 (line-clamp-2) */
  title: string
  /** 作者 (id / name / avatar) */
  author: NoteCardAuthor
  /** 点赞数 */
  likes: number
  /** 当前用户是否已点赞 (默认 false) */
  liked?: boolean
  /** cover 高/宽比 · 决定瀑布流卡片高度 · 默认 1.0 */
  ratio?: number
  /** 点心切换 · 卡片自己 optimistic update */
  onLike?: () => void
  /** 点卡片整体 */
  onPress?: () => void
  /** a11y */
  ariaLabel?: string
}

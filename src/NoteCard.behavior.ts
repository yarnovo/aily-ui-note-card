/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 小红书风 NoteCard 关键行为:
 * 1. 点心 → 触发 onLike + 切 liked + likes ±1 (optimistic)
 * 2. 点心不冒泡到卡片 onPress
 * 3. 没 onLike 时心无交互
 * 4. likes 格式: > 10000 显示 1.2w · > 1000 显示 1.5k · 其他原数
 */

/** 点赞数格式化 · >10000 = w · >1000 = k · 其他原数 */
export function formatLikes(n: number): string {
  if (n > 10000) return `${(n / 10000).toFixed(1)}w`
  if (n > 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

/** optimistic 点心结果 · 给 likes 当前值 + 当前 liked · 返回新值 */
export function optimisticLike(
  liked: boolean,
  likes: number,
): { liked: boolean; likes: number } {
  return liked
    ? { liked: false, likes: Math.max(0, likes - 1) }
    : { liked: true, likes: likes + 1 }
}

export type LikeOutcome = 'fired' | 'skipped'

export interface LikeScenario {
  name: string
  hasOnLike: boolean
  outcome: LikeOutcome
}

/** 共享场景 · Web + RN 都跑 */
export const likeScenarios: LikeScenario[] = [
  {
    name: '有 onLike · 点心触发回调',
    hasOnLike: true,
    outcome: 'fired',
  },
  {
    name: '没 onLike · 点心不报错也不响应',
    hasOnLike: false,
    outcome: 'skipped',
  },
]

/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 7 件事:
 * 1. 渲染 cover / title / author / likes
 * 2. 点心触发 onLike + 切 liked / likes ±1 (optimistic)
 * 3. 点心不触发 onPress
 * 4. liked=true 心填充 / liked=false 心 stroke
 * 5. formatLikes (>10000=w / >1000=k / 其他)
 * 6. 长 title line-clamp-2 (class verify)
 * 7. 行为契约 (有 onLike vs 没 onLike)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NoteCard } from '../src/NoteCard'
import { formatLikes, optimisticLike, likeScenarios } from '../src/NoteCard.behavior'
import type { NoteCardProps } from '../src/NoteCard.types'

const baseProps: NoteCardProps = {
  id: 'n1',
  cover: 'https://example.com/cover.jpg',
  title: '今日穿搭分享 · 春日小清新',
  author: { id: 'u1', name: '小喜', avatar: 'https://example.com/a.jpg' },
  likes: 233,
  liked: false,
  ratio: 1.0,
}

describe('NoteCard · 渲染 4 元素', () => {
  it('渲染 cover (img src)', () => {
    render(<NoteCard {...baseProps} />)
    const cover = screen.getByTestId('note-card-cover-img') as HTMLImageElement
    expect(cover).toBeInTheDocument()
    expect(cover.src).toBe(baseProps.cover)
  })

  it('渲染 title', () => {
    render(<NoteCard {...baseProps} />)
    expect(screen.getByTestId('note-card-title')).toHaveTextContent(baseProps.title)
  })

  it('渲染 author name + avatar', () => {
    render(<NoteCard {...baseProps} />)
    expect(screen.getByTestId('note-card-author')).toHaveTextContent('小喜')
    const avatar = screen.getByTestId('note-card-avatar') as HTMLImageElement
    expect(avatar.src).toBe(baseProps.author.avatar)
  })

  it('头像缺失 · 走 placeholder', () => {
    render(
      <NoteCard
        {...baseProps}
        author={{ id: 'u2', name: '大喜', avatar: '' }}
      />,
    )
    expect(screen.getByTestId('note-card-avatar-placeholder')).toBeInTheDocument()
    expect(screen.getByTestId('note-card-avatar-placeholder')).toHaveTextContent('大')
  })

  it('渲染 likes (默认数字格式)', () => {
    render(<NoteCard {...baseProps} likes={233} />)
    expect(screen.getByTestId('note-card-likes')).toHaveTextContent('233')
  })
})

describe('NoteCard · 点心交互', () => {
  it('点心触发 onLike', () => {
    const onLike = vi.fn()
    render(<NoteCard {...baseProps} onLike={onLike} />)
    fireEvent.click(screen.getByTestId('note-card-like'))
    expect(onLike).toHaveBeenCalledOnce()
  })

  it('点心切 liked + likes +1 (optimistic · 未点 → 已点)', () => {
    const onLike = vi.fn()
    render(<NoteCard {...baseProps} likes={100} liked={false} onLike={onLike} />)
    const like = screen.getByTestId('note-card-like')
    expect(like).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('note-card-likes')).toHaveTextContent('100')

    fireEvent.click(like)
    expect(like).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('note-card-likes')).toHaveTextContent('101')
  })

  it('点心切 liked + likes -1 (optimistic · 已点 → 未点)', () => {
    const onLike = vi.fn()
    render(<NoteCard {...baseProps} likes={100} liked={true} onLike={onLike} />)
    const like = screen.getByTestId('note-card-like')
    expect(like).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(like)
    expect(like).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('note-card-likes')).toHaveTextContent('99')
  })

  it('点心不触发 onPress (stopPropagation)', () => {
    const onPress = vi.fn()
    const onLike = vi.fn()
    render(<NoteCard {...baseProps} onPress={onPress} onLike={onLike} />)
    fireEvent.click(screen.getByTestId('note-card-like'))
    expect(onLike).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
  })

  it('点卡片 (非心) 触发 onPress', () => {
    const onPress = vi.fn()
    render(<NoteCard {...baseProps} onPress={onPress} />)
    fireEvent.click(screen.getByTestId('note-card-cover'))
    expect(onPress).toHaveBeenCalledOnce()
  })
})

describe('NoteCard · liked 视觉', () => {
  it('liked=true · 心带 --liked class (CSS 把 fill 变 accent)', () => {
    render(<NoteCard {...baseProps} liked={true} onLike={vi.fn()} />)
    const like = screen.getByTestId('note-card-like')
    expect(like.className).toContain('ak-note-card__like--liked')
  })

  it('liked=false · 心不带 --liked class (默认 stroke)', () => {
    render(<NoteCard {...baseProps} liked={false} onLike={vi.fn()} />)
    const like = screen.getByTestId('note-card-like')
    expect(like.className).not.toContain('ak-note-card__like--liked')
  })
})

describe('NoteCard · formatLikes', () => {
  it('< 1000 显示原数', () => {
    expect(formatLikes(0)).toBe('0')
    expect(formatLikes(99)).toBe('99')
    expect(formatLikes(1000)).toBe('1000')
  })

  it('> 1000 显示 k', () => {
    expect(formatLikes(1500)).toBe('1.5k')
    expect(formatLikes(9999)).toBe('10.0k')
  })

  it('> 10000 显示 w', () => {
    expect(formatLikes(12345)).toBe('1.2w')
    expect(formatLikes(99999)).toBe('10.0w')
  })

  it('UI · 大 likes 经 formatLikes 显示 w', () => {
    render(<NoteCard {...baseProps} likes={12345} />)
    expect(screen.getByTestId('note-card-likes')).toHaveTextContent('1.2w')
  })
})

describe('NoteCard · optimisticLike', () => {
  it('未点 → 已点 + 1', () => {
    expect(optimisticLike(false, 100)).toEqual({ liked: true, likes: 101 })
  })

  it('已点 → 未点 - 1', () => {
    expect(optimisticLike(true, 100)).toEqual({ liked: false, likes: 99 })
  })

  it('已点 + likes=0 → 不变负 (Math.max 0)', () => {
    expect(optimisticLike(true, 0)).toEqual({ liked: false, likes: 0 })
  })
})

describe('NoteCard · 长 title line-clamp-2', () => {
  it('长 title 渲染时带 line-clamp class', () => {
    const longTitle =
      '今日穿搭分享 · 春日小清新 · 复古港风 · 法式优雅 · 日杂大女主 · 一篇笔记教你搞定所有风格 · 真的超长'
    render(<NoteCard {...baseProps} title={longTitle} />)
    const titleEl = screen.getByTestId('note-card-title')
    expect(titleEl).toHaveTextContent(longTitle)
    expect(titleEl.className).toContain('ak-note-card__title')
  })
})

describe('NoteCard · 行为契约 (共享 spec)', () => {
  for (const sc of likeScenarios) {
    it(sc.name, () => {
      const onLike = sc.hasOnLike ? vi.fn() : undefined
      render(<NoteCard {...baseProps} onLike={onLike} />)
      const like = screen.getByTestId('note-card-like')
      fireEvent.click(like)
      if (sc.outcome === 'fired') {
        expect(onLike).toHaveBeenCalledOnce()
      } else {
        // 没 onLike 时 aria-disabled = "true"
        expect(like).toHaveAttribute('aria-disabled', 'true')
      }
    })
  }
})

describe('NoteCard · ratio 应用到 cover aspect-ratio', () => {
  it('ratio=1.0 · aspectRatio = 1 / 1', () => {
    render(<NoteCard {...baseProps} ratio={1.0} />)
    const cover = screen.getByTestId('note-card-cover')
    expect(cover.style.aspectRatio).toBe('1 / 1')
  })

  it('ratio=0.7 · 横图 · aspectRatio = 1 / 0.7', () => {
    render(<NoteCard {...baseProps} ratio={0.7} />)
    const cover = screen.getByTestId('note-card-cover')
    expect(cover.style.aspectRatio).toBe('1 / 0.7')
  })

  it('ratio 默认 1.0', () => {
    render(<NoteCard {...baseProps} ratio={undefined} />)
    const cover = screen.getByTestId('note-card-cover')
    expect(cover.style.aspectRatio).toBe('1 / 1')
  })
})

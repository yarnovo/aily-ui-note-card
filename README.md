# @akong/note-card

> ← 回 [akong design system](https://yarnovo.github.io/akong-core/) 总站

akong NoteCard · 小红书风瀑布流卡片 · 跨端 (Web + React Native)

封面 + 标题 + 作者 + 点赞数 · 一份 props 跨 Web/RN · 内置 optimistic 点赞。

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-note-card/)

## 安装

```bash
npm i github:yarnovo/akong-note-card github:yarnovo/akong-tokens
```

## Web

```tsx
import { NoteCard } from '@akong/note-card'
import '@akong/note-card/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token

<NoteCard
  id="n1"
  cover="https://example.com/cover.jpg"
  title="今日穿搭分享 · 春日小清新"
  author={{ id: 'u1', name: '小喜', avatar: 'https://example.com/a.jpg' }}
  likes={233}
  liked={false}
  ratio={1.0}
  onLike={() => fetch('/api/like', { method: 'POST' })}
  onPress={() => router.push('/note/n1')}
/>
```

## React Native

```tsx
import { NoteCard } from '@akong/note-card'

<NoteCard
  id="n1"
  cover="https://example.com/cover.jpg"
  title="今日穿搭"
  author={{ id: 'u1', name: '小喜', avatar: 'https://example.com/a.jpg' }}
  likes={233}
  ratio={1.2}
  onLike={() => {}}
  onPress={() => {}}
/>
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| id | `string` | — | 必填 · 笔记 id |
| cover | `string` | — | 封面图 URL |
| title | `string` | — | 笔记标题 (自动 line-clamp-2) |
| author | `{ id, name, avatar }` | — | 作者 (avatar 缺失走 placeholder 首字母) |
| likes | `number` | — | 点赞数 (>10000 显示 w · >1000 显示 k) |
| liked | `boolean` | `false` | 当前用户是否已赞 |
| ratio | `number` | `1.0` | cover H/W (决定瀑布流卡高度 · 0.7=横图 / 1.3=竖图) |
| onLike | `() => void` | — | 点心回调 (卡片自己 optimistic update) |
| onPress | `() => void` | — | 点卡片整体回调 |
| ariaLabel | `string` | — | a11y · 默认用 title |

## 行为契约

- **optimistic 点赞**: 点心后卡片立刻切 `liked` + `likes ±1` · 不等 `onLike` 回调返回
- **stopPropagation**: 点心不触发 `onPress` (Web 用 `e.stopPropagation()` · RN Pressable 嵌套天然隔离)
- **缺 onLike**: 心 `aria-disabled="true"` · 点击无响应 · 不报错
- **likes 格式**: `formatLikes(n)` · `> 10000 → "1.2w"` · `> 1000 → "1.5k"` · 其他原数

## 变体

demo/ 内置 6 变体:

1. 默认 (ratio 1.0)
2. 已点赞 (liked=true)
3. 极长标题 (line-clamp-2)
4. 头像缺失 (placeholder 首字母)
5. 大 likes (12345 → 1.2w)
6. 横图 (ratio 0.7)

## 设计原则

- **一份 props**: Web + RN 共享 `NoteCard.types.ts`
- **两端实现**: `NoteCard.tsx` (Web · `<div role="link">`) + `NoteCard.native.tsx` (RN · `<Pressable>`)
- **token 100% 接 @akong/tokens**: 改一处 token 自动 update
- **整卡 hover bg-subtle (Web) / press 0.7 opacity**: 极简反馈 · 不缩放
- **卡片底部 padding-x 0**: 不要 border 框 · 瀑布流自然贴

## 状态

| 状态 | Web | RN |
|---|---|---|
| default | `:not(:active)` | `pressed: false` |
| hover | `:hover bg-subtle` | — |
| active | `:active opacity 0.7` | `pressed: true opacity 0.7` |
| focus | `:focus-visible outline` | RN 默认 a11y focus |
| liked | `.ak-note-card__like--liked` 心 fill accent | `liked` state · `♥` + accent 色 |

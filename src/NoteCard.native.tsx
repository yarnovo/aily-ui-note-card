/**
 * akong NoteCard · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { NoteCard } from '@akong/note-card'` 自动取对应平台
 */

import { useState, useCallback } from 'react'
import { Pressable, Text, View, Image, useColorScheme } from 'react-native'
import { tokens } from '@akong/tokens'
import type { NoteCardProps } from './NoteCard.types'
import { formatLikes, optimisticLike } from './NoteCard.behavior'

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

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  const [liked, setLiked] = useState(likedProp)
  const [likes, setLikes] = useState(likesProp)

  const handleLikePress = useCallback(() => {
    if (!onLike) return
    const next = optimisticLike(liked, likes)
    setLiked(next.liked)
    setLikes(next.likes)
    onLike()
  }, [liked, likes, onLike])

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={ariaLabel ?? title}
      accessibilityRole="link"
      style={({ pressed }: { pressed: boolean }) => ({
        borderRadius: tokens.radius.lg,
        backgroundColor: 'transparent',
        opacity: pressed ? 0.7 : 1,
        width: '100%' as const,
      })}
    >
      {/* Cover */}
      <View
        style={{
          width: '100%',
          aspectRatio: 1 / ratio,
          backgroundColor: t.bgSubtle,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
        }}
      >
        {cover ? (
          <Image
            source={{ uri: cover }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      {/* Body */}
      <View style={{ paddingVertical: tokens.space[2], gap: tokens.space[2] }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: tokens.text.base,
            color: t.fg,
            lineHeight: tokens.text.base * tokens.leading.snug,
          }}
        >
          {title}
        </Text>

        {/* Footer · author + like */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: tokens.space[2],
          }}
        >
          {/* Author */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: tokens.space[1],
              flex: 1,
              minWidth: 0,
            }}
          >
            {author.avatar ? (
              <Image
                source={{ uri: author.avatar }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: t.bgSubtle,
                }}
              />
            ) : (
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: t.bgSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 10, color: t.fgMuted }}>
                  {author.name?.[0] ?? '?'}
                </Text>
              </View>
            )}
            <Text
              numberOfLines={1}
              style={{
                fontSize: tokens.text.xs,
                color: t.fgMuted,
                flex: 1,
              }}
            >
              {author.name}
            </Text>
          </View>

          {/* Like */}
          <Pressable
            onPress={handleLikePress}
            disabled={!onLike}
            accessibilityRole="button"
            accessibilityLabel={liked ? '取消点赞' : '点赞'}
            accessibilityState={{ selected: liked }}
            hitSlop={8}
            style={({ pressed }: { pressed: boolean }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: tokens.space[1],
              paddingHorizontal: 4,
              paddingVertical: 2,
              opacity: pressed && onLike ? 0.7 : 1,
            })}
          >
            {/* heart 用 emoji 占位 · RN 不直跑 SVG · 实际接 react-native-svg */}
            <Text style={{ fontSize: 12, color: liked ? t.accent : t.fgMuted }}>
              {liked ? '♥' : '♡'}
            </Text>
            <Text
              style={{
                fontSize: tokens.text.xs,
                color: liked ? t.accent : t.fgMuted,
              }}
            >
              {formatLikes(likes)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

export default NoteCard

/**
 * akong NoteCard · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { NoteCard } from '@akong/button'` 自动取对应平台
 */

import { Pressable, Text, View, ActivityIndicator, useColorScheme } from 'react-native'
import { tokens } from '@akong/tokens'
import type { NoteCardProps } from './NoteCard.types'

const sizes = {
  sm: { height: 32, paddingH: tokens.space[3], fontSize: tokens.text.sm },
  md: { height: 40, paddingH: tokens.space[4], fontSize: tokens.text.base },
  lg: { height: 48, paddingH: tokens.space[5], fontSize: tokens.text.md },
} as const

function variantStyles(variant: NonNullable<NoteCardProps['variant']>, scheme: 'light' | 'dark') {
  const t = scheme === 'dark' ? tokens.dark : tokens.light
  switch (variant) {
    case 'primary':
      return { bg: t.fg, fg: t.fgInverse }
    case 'secondary':
      return { bg: t.bgSubtle, fg: t.fg }
    case 'ghost':
      return { bg: 'transparent', fg: t.fg }
    case 'destructive':
      return { bg: t.accent, fg: t.accentFg }
    case 'link':
      return { bg: 'transparent', fg: t.fg }
  }
}

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
    ariaLabel,
  } = props

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const sz = sizes[size]
  const v = variantStyles(variant, scheme)

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <Pressable
      onPress={handle}
      accessibilityLabel={ariaLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      style={({ pressed }: { pressed: boolean }) => ({
        height: variant === 'link' ? undefined : sz.height,
        paddingHorizontal: variant === 'link' ? 0 : sz.paddingH,
        backgroundColor: v.bg,
        borderRadius: variant === 'link' ? 0 : tokens.radius.full,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        alignSelf: (fullWidth ? 'stretch' : 'flex-start') as 'stretch' | 'flex-start',
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        gap: tokens.space[2],
      })}
    >
      {loading ? (
        <ActivityIndicator color={v.fg as string} />
      ) : (
        <>
          {iconLeft && <View>{iconLeft}</View>}
          {children && (
            <Text
              style={{
                color: v.fg as string,
                fontSize: sz.fontSize,
                fontWeight: tokens.weight.medium,
                textDecorationLine: variant === 'link' ? 'underline' : 'none',
              }}
            >
              {children}
            </Text>
          )}
          {iconRight && <View>{iconRight}</View>}
        </>
      )}
    </Pressable>
  )
}

export default NoteCard

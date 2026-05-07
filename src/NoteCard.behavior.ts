/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 写法是"给定 props · 期望 · 该发生 / 不该发生"的纯描述
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

export type Outcome = 'callback-fired' | 'callback-skipped'

export interface Scenario {
  name: string
  props: { disabled?: boolean; loading?: boolean }
  /** 模拟一次"按下" · 期望结果 */
  onPressOutcome: Outcome
}

/** 共享场景 · Web + RN 都跑 */
export const buttonScenarios: Scenario[] = [
  {
    name: 'default · 按下触发回调',
    props: {},
    onPressOutcome: 'callback-fired',
  },
  {
    name: 'disabled · 按下不触发',
    props: { disabled: true },
    onPressOutcome: 'callback-skipped',
  },
  {
    name: 'loading · 按下不触发',
    props: { loading: true },
    onPressOutcome: 'callback-skipped',
  },
  {
    name: 'disabled + loading · 按下不触发',
    props: { disabled: true, loading: true },
    onPressOutcome: 'callback-skipped',
  },
]

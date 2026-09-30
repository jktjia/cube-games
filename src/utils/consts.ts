import { Blocks, Bomb, Grid2X2, LineSquiggle, Settings } from 'lucide-react'
import type { PageOption } from '@/types'
import { Direction } from '@/types'
import {
  MERGE_PATH,
  MINESWEEPER_PATH,
  SETTINGS_PATH,
  SNAKE_PATH,
  TETRIS_PATH,
} from '@/utils/paths'

export const moveDirs = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
}

export const gameOptions: PageOption[] = [
  { name: '2048', href: '/' + MERGE_PATH, icon: Grid2X2 },
  { name: 'Minesweeper', href: '/' + MINESWEEPER_PATH, icon: Bomb },
  { name: 'Snake', href: '/' + SNAKE_PATH, icon: LineSquiggle },
  { name: 'Tetris', href: '/' + TETRIS_PATH, icon: Blocks },
]

export const footerLinks: PageOption[] = [
  { name: 'Settings', href: '/' + SETTINGS_PATH, icon: Settings },
]

import {
  Blocks,
  Bomb,
  Eye,
  Grid2X2,
  Info,
  LineSquiggle,
  Settings,
} from 'lucide-react'
import type { GameOption, PageOption } from '@/types'
import { Direction } from '@/types'
import {
  ABOUT_PATH,
  MERGE_PATH,
  MINESWEEPER_PATH,
  MONITOR_PATH,
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

export const gameOptions: GameOption[] = [
  { id: 'merge', name: '2048', href: '/' + MERGE_PATH, icon: Grid2X2 },
  {
    id: 'mines',
    name: 'Minesweeper',
    href: '/' + MINESWEEPER_PATH,
    icon: Bomb,
    scoreMeasure: 'seconds',
  },
  {
    id: 'snake',
    name: 'Snake',
    href: '/' + SNAKE_PATH,
    icon: LineSquiggle,
    scoreMeasure: 'pellets',
  },

  { id: 'tetris', name: 'Tetris', href: '/' + TETRIS_PATH, icon: Blocks },
]

export const hiddenPages: PageOption[] = [
  {
    id: 'about',
    name: 'About',
    // altName: 'Monitoring',
    href: '/' + ABOUT_PATH,
    icon: Info,
  },
  {
    id: 'stats',
    name: 'Statistics',
    altName: 'Monitoring',
    href: '/' + MONITOR_PATH,
    icon: Eye,
  },
]

export const footerLinks: PageOption[] = [
  {
    id: 'settings',
    name: 'Settings',
    href: '/' + SETTINGS_PATH,
    icon: Settings,
  },
]

export const CAT_COUNT = 5

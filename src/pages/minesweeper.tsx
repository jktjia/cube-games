import { Bomb, FlagTriangleRight, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { MinesweeperSettings } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import useMinesweeper from '@/hooks/use-minesweeper'
import { Difficulty, MineTileState } from '@/types'
import { cn } from '@/utils'
import GameContent from '@/components/game-content'
import { gradient } from '@/utils/colors'
import { useInterfere } from '@/hooks/use-interfere'

interface ColsSettings extends MinesweeperSettings {
  gridCols: string
}

const difficultySettings: Record<Difficulty, ColsSettings> = {
  [Difficulty.BEGINNER]: {
    gridCols: 'grid-cols-9',
    width: 9,
    height: 9,
    mineCount: 10,
  },
  [Difficulty.INTERMEDIATE]: {
    gridCols: 'grid-cols-16',
    width: 16,
    height: 16,
    mineCount: 40,
  },
  [Difficulty.EXPERT]: {
    gridCols: 'grid-cols-30',
    width: 30,
    height: 16,
    mineCount: 99,
  },
}

const controls = `Flag all of the mines and reveal all empty squares.
Left-click: Reveal square
Right-click: Flag/unflag
Space bar: Flag hovered square or reveal its adjacent squares.
F2: Start a new game`

const tileBaseCN = cn(
  'rounded-none flex items-center justify-center overflow-visible',
  'max-w-full min-w-4 max-h-full min-h-4 aspect-square text-sm text-primary ',
)

const tileEmptyCN = 'bg-input'

export default function Minesweeper() {
  const { updateActivity, riceMessage } = useEmptyContext()
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EXPERT)
  const [hoverX, setHoverX] = useState<number>()
  const [hoverY, setHoverY] = useState<number>()
  const settings = useMemo(() => difficultySettings[difficulty], [difficulty])
  const {
    tiles,
    mines,
    reveal,
    flag,
    flagOrRevealNeighbors,
    isGameLost,
    isGameOver,
    restart,
    remaining,
    interfereProps,
  } = useMinesweeper(settings)
  const [paused, setPaused] = useState<boolean>(false)

  useInterfere(interfereProps)

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number,
  ) => {
    if (!isGameOver) {
      if (e.button === 0) {
        e.preventDefault()
        reveal(x, y)
      } else if (e.button === 2) {
        e.preventDefault()
        flag(x, y)
      }
    } else {
      restart()
    }
    updateActivity()
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameOver && !paused) {
        if (e.key === ' ') {
          e.preventDefault()
          if (hoverX != undefined && hoverY != undefined) {
            flagOrRevealNeighbors(hoverX, hoverY)
          }
          updateActivity()
        } else if (e.key === 'F2') {
          e.preventDefault()
          restart()
          updateActivity()
        }
      }
    },
    [isGameOver, hoverX, hoverY, restart, flagOrRevealNeighbors],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const splitMessage = useMemo(
    () => (riceMessage ? riceMessage.toUpperCase().split('') : []),
    [riceMessage],
  )

  return (
    <GameContent
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
      restart={restart}
      // gameName="Minesweeper"
      controls={controls}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      scoreText={`Mines Remaining: ${remaining}`}
      setPaused={setPaused}
    >
      <div
        className={cn(
          'grid gap-1 transition-all w-5xl',
          difficultySettings[difficulty].gridCols,
          isGameOver ? 'opacity-50' : '',
        )}
      >
        {tiles.flatMap((r, i) =>
          r.map((t, idx) => {
            let className = tileBaseCN
            let content: ReactNode = <></>
            if (t == MineTileState.NOT_SEEN || !mines) {
              className = tileEmptyCN
              if (!isGameLost) {
                className = cn(className, 'hover:cursor-pointer')
              }
              if (isGameLost && mines && mines[i][idx] == -1) {
                content = <Bomb size={16} className="text-primary" />
              } else if (riceMessage) {
                content =
                  splitMessage[(i * r.length + idx) % splitMessage.length]
              }
            } else if (t == MineTileState.FLAG) {
              className = tileEmptyCN
              if (!isGameLost) {
                className = cn(className, 'hover:cursor-pointer')
              }
              if (isGameLost && mines[i][idx] != -1) {
                content = <X size={16} className="text-primary" />
              } else {
                content = (
                  <FlagTriangleRight size={16} className="text-primary" />
                )
              }
            } else {
              className = cn(
                className,
                'text-black disabled:opacity-100',
                mines[i][idx] == 0
                  ? 'bg-background'
                  : gradient[(mines[i][idx] - 1) * 2 + 1],
              )
              if (mines[i][idx] > 0) {
                content = mines[i][idx]
              } else if (riceMessage) {
                content = splitMessage[(i * r.length + t) % splitMessage.length]
              }
            }
            return (
              <div
                className={className}
                onClick={(e) => handleClick(e, idx, i)}
                onContextMenu={(e) => handleClick(e, idx, i)}
                onMouseEnter={() => {
                  setHoverX(idx)
                  setHoverY(i)
                }}
                onMouseLeave={() => {
                  setHoverX(undefined)
                  setHoverY(undefined)
                }}
                key={'tile-' + i + '-' + idx}
              >
                {content}
              </div>
            )
          }),
        )}
      </div>
    </GameContent>
  )
}

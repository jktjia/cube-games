import { Bomb, FlagTriangleRight, MousePointerClick, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { MinesweeperSettings } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import useMinesweeper from '@/hooks/use-minesweeper'
import { Difficulty, MineTileState } from '@/types'
import { cn } from '@/utils'
import { GameCard, GameContent, GameHeader } from '@/components/game-card'
import { gradient } from '@/utils/colors'
import { useInterfere } from '@/hooks/use-interfere'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface ColsSettings extends MinesweeperSettings {
  gridCols: string
  wMax: string
}

const difficultySettings: Record<Difficulty, ColsSettings> = {
  [Difficulty.BEGINNER]: {
    gridCols: 'grid-cols-9',
    wMax: 'w-md sm:w-lg',
    width: 9,
    height: 9,
    mineCount: 10,
  },
  [Difficulty.INTERMEDIATE]: {
    gridCols: 'grid-cols-16',
    wMax: 'w-lg md:w-2xl lg:w-2xl',
    width: 16,
    height: 16,
    mineCount: 40,
  },
  [Difficulty.EXPERT]: {
    gridCols: 'grid-cols-30',
    wMax: 'w-xl md:w-3xl lg:w-4xl',
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
  'max-w-10 min-w-6 max-h-10 min-h-6 text-xs lg:text-sm text-primary aspect-square grow',
)

const tileEmptyCN = 'bg-input'

export default function Minesweeper() {
  const { updateActivity, updateHighScore, riceMessage } = useEmptyContext()
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
    isGameWon,
    isGameOver,
    startTime,
    restart,
    remaining,
    interfereProps,
  } = useMinesweeper(settings)
  const [paused, setPaused] = useState<boolean>(false)
  const [swapFlagReveal, setSwapFlagReveal] = useState<boolean>(false)

  useInterfere(interfereProps)

  useEffect(() => {
    if (isGameWon && difficulty == Difficulty.EXPERT) {
      const gameTime = (new Date().getTime() - startTime.getTime()) / 1000
      updateHighScore('mines', gameTime, true)
    }
  }, [isGameWon])

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number,
  ) => {
    if (!isGameOver) {
      if (e.button === 0) {
        e.preventDefault()
        if (swapFlagReveal) {
          flag(x, y)
        } else {
          reveal(x, y)
        }
      } else if (e.button === 2) {
        e.preventDefault()
        if (swapFlagReveal) {
          reveal(x, y)
        } else {
          flag(x, y)
        }
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
    <GameCard
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
    >
      <GameHeader
        restart={restart}
        controls={controls}
        scoreText={`Mines Remaining: ${remaining}`}
        setPaused={setPaused}
      >
        <Dialog
          onOpenChange={(open) => {
            setPaused(open)
          }}
        >
          <DialogTrigger asChild>
            <Button variant="link" className="hover:cursor-pointer">
              Difficulty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Difficulty</DialogTitle>
            </DialogHeader>
            <RadioGroup
              value={difficulty.toString()}
              onValueChange={(v) => setDifficulty(parseInt(v))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={Difficulty.BEGINNER.toString()}
                  id="beginner"
                />
                <Label htmlFor="beginner">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={Difficulty.INTERMEDIATE.toString()}
                  id="intermediate"
                />
                <Label htmlFor="intermediate">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={Difficulty.EXPERT.toString()}
                  id="expert"
                />
                <Label htmlFor="expert">Expert</Label>
              </div>
            </RadioGroup>
          </DialogContent>
        </Dialog>
        <div className="inline-flex items-center gap-2 md:hidden">
          <Switch
            id="icon-label"
            checked={swapFlagReveal}
            onCheckedChange={setSwapFlagReveal}
            aria-label="Toggle flag/reveal"
          />
          <Label htmlFor="icon-label">
            <span className="sr-only">Toggle flag/reveal</span>
            {swapFlagReveal ? (
              <FlagTriangleRight className="size-4" aria-hidden="true" />
            ) : (
              <MousePointerClick className="size-4" aria-hidden="true" />
            )}
          </Label>
        </div>
      </GameHeader>
      <GameContent>
        <div
          className={cn(
            'flex flex-col  gap-1 transition-all',
            difficultySettings[difficulty].wMax,
            difficultySettings[difficulty].gridCols,
            isGameOver ? 'opacity-50' : '',
          )}
        >
          {tiles.flatMap((r, i) => (
            <div className="flex flex-row w-full gap-1 justify-center">
              {r.map((t, idx) => {
                let className = tileBaseCN
                let content: ReactNode = <></>
                if (t == MineTileState.NOT_SEEN || !mines) {
                  className = cn(className, tileEmptyCN)
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
                  className = cn(className, tileEmptyCN)
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
                    content =
                      splitMessage[(i * r.length + t) % splitMessage.length]
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
              })}
            </div>
          ))}
        </div>
      </GameContent>
    </GameCard>
  )
}

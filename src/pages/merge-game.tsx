import { ViewTransition, startTransition, useEffect, useState } from 'react'
import useMergeGame from '@/hooks/use-merge-game'
import useEmptyContext from '@/hooks/use-empty-context'
import GameContent from '@/components/game-content'
import { gradient } from '@/utils/colors'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { useInterfere } from '@/hooks/use-interfere'

const controls = `When two tiles having the same number touch, they join into one.
Arrow keys / WASD: Tile shifting`

const tileBaseCN = cn(
  'flex items-center justify-center aspect-square p-0 m-0',
  'max-w-full text-black',
)

const tileEmptyCN = 'bg-input'

export default function MergeGame() {
  const { updateActivity } = useEmptyContext()
  const {
    tiles,
    score,
    up,
    down,
    left,
    right,
    isGameOver,
    isGameLost,
    isGameWon,
    restart,
    continueGame,
    interfereProps,
  } = useMergeGame()
  const [paused, setPaused] = useState<boolean>(false)

  useInterfere(interfereProps)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!paused) {
      startTransition(() => {
        if (e.key === 'ArrowUp' || e.key === 'w') {
          e.preventDefault()
          up()
        } else if (e.key === 'ArrowDown' || e.key === 's') {
          e.preventDefault()
          down()
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
          e.preventDefault()
          left()
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          e.preventDefault()
          right()
        }
        updateActivity()
      })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <GameContent
      gameOverMessage="Game Over!"
      isGameOver={isGameLost}
      restart={restart}
      scoreText={`Score: ${score}`}
      setPaused={setPaused}
      controls={controls}
    >
      <ViewTransition>
        <div
          className={cn(
            'grid grid-cols-4 gap-1 transition-all text-xl max-h-full max-w-full w-xl aspect-square',
            isGameOver() ? ' opacity-50' : '',
          )}
        >
          {tiles.flatMap((r, i) =>
            r.map((t, idx) =>
              t ? (
                <div
                  className={cn(
                    tileBaseCN,
                    gradient[Math.min(Math.log2(t.value), gradient.length)],
                  )}
                  key={'tile-' + i + '-' + idx}
                  style={{ viewTransitionName: 'tile-' + t.id }}
                >
                  {t.value}
                </div>
              ) : (
                <div
                  className={cn(tileBaseCN, tileEmptyCN)}
                  key={'tile-' + i + '-' + idx}
                />
              ),
            ),
          )}
        </div>
        {isGameWon && (
          <div className="absolute w-fit flex flex-col gap-2">
            <div className="bg-background/50 rounded p-2">Game Won!</div>
            <Button
              className="bg-background/50 text-primary"
              onClick={continueGame}
            >
              Continue
            </Button>
          </div>
        )}
      </ViewTransition>
    </GameContent>
  )
}

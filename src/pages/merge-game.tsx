import {
  ViewTransition,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSwipeable } from 'react-swipeable'
import useMergeGame from '@/hooks/use-merge-game'
import useEmptyContext from '@/hooks/use-empty-context'
import { GameCard, GameContent, GameHeader } from '@/components/game-card'
import { gradient } from '@/utils/colors'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { useInterfere } from '@/hooks/use-interfere'
import HiddenCat from '@/components/hidden-cat'

const controls = `When two tiles having the same number touch, they join into one.
Arrow keys / WASD: Tile shifting`

const tileBaseCN = cn(
  'flex items-center justify-center aspect-square p-0 m-0',
  'min-w-8 w-48 text-black max-w-full',
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

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => !paused && startTransition(() => left()),
    onSwipedDown: () => !paused && startTransition(() => down()),
    onSwipedRight: () => !paused && startTransition(() => right()),
    onSwipedUp: () => !paused && startTransition(() => up()),
    preventScrollOnSwipe: true,
  })

  const keyMap = useMemo(
    () =>
      new Map([
        ['ArrowUp', up],
        ['w', up],
        ['ArrowDown', down],
        ['s', down],
        ['ArrowLeft', left],
        ['a', left],
        ['ArrowRight', right],
        ['d', right],
      ]),
    [up, down, left, right],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!paused && keyMap.has(e.key)) {
        startTransition(() => {
          e.preventDefault()
          const action = keyMap.get(e.key)
          action && action()
          updateActivity()
        })
      }
    },
    [paused, keyMap, updateActivity],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <GameCard gameOverMessage="Game Over!" isGameOver={isGameLost}>
      <GameHeader
        restart={restart}
        scoreText={`Score: ${score}`}
        setPaused={setPaused}
        controls={controls}
      >
        <HiddenCat n={2} className="self-center" />
      </GameHeader>
      <GameContent>
        <ViewTransition>
          <div
            className={cn(
              'grid grid-cols-4 gap-1 transition-all text-lg sm:text-xl lg:text-2xl sm:w-md md:w-xl max-h-full aspect-square',
              isGameOver() ? ' opacity-50' : '',
            )}
            {...swipeHandler}
          >
            {tiles.flatMap((r, i) =>
              r.map((t, idx) =>
                t ? (
                  <div
                    className={cn(
                      tileBaseCN,
                      gradient[
                        Math.min(Math.log2(t.value), gradient.length - 1)
                      ],
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
    </GameCard>
  )
}

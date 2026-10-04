import { useCallback, useEffect, useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import { gradient } from '@/utils/colors'
import { SnakeTileState } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import { cn } from '@/utils'
import { GameCard, GameContent, GameHeader } from '@/components/game-card'
import useSnake from '@/hooks/use-snake'
import { useInterfere } from '@/hooks/use-interfere'
import { Button } from '@/components/ui/button'
import HiddenCat from '@/components/hidden-cat'

const tileColors = {
  [SnakeTileState.APPLE]: gradient[13],
  [SnakeTileState.HEAD]: gradient[4],
  [SnakeTileState.BODY]: gradient[3],
}

const controls = `Eat apples to grow longer, but do not hit the walls or part of the snake
Arrow keys / WASD: Change direction
Escape: Pause/unpause`

// const defaultSettings = {
//   width: 20,
//   height: 15,
// }

const tileBaseCN = cn(
  'rounded-none flex items-center justify-center overflow-hide',
  'max-w-full min-w-full aspect-square text-xs lg:text-sm text-primary',
)

const tileEmptyCN = 'bg-input'

export default function Snake() {
  const { updateActivity, updateHighScore, riceMessage } = useEmptyContext()
  const {
    tiles,
    score,
    up,
    down,
    left,
    right,
    isGameOver,
    isGameLost,
    restart,
    paused,
    setPaused,
    togglePause,
    interfereProps,
  } = useSnake()

  useInterfere(interfereProps)

  useEffect(() => {
    updateHighScore('snake', score)
  }, [updateHighScore, score])

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => !isGameOver && left(),
    onSwipedDown: () => !isGameOver && down(),
    onSwipedRight: () => !isGameOver && right(),
    onSwipedUp: () => !isGameOver && up(),
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
        ['Escape', togglePause],
      ]),
    [up, down, left, right, togglePause],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isGameOver && keyMap.has(e.key)) {
        e.preventDefault()
        const action = keyMap.get(e.key)
        action && action()
        updateActivity()
      }
    },
    [isGameOver, keyMap, updateActivity],
  )

  const splitMessage = useMemo(
    () => (riceMessage ? riceMessage.toUpperCase().split('') : []),
    [riceMessage],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <GameCard
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
      announcement={paused ? 'Paused' : undefined}
    >
      <GameHeader
        restart={restart}
        setPaused={setPaused}
        controls={controls}
        scoreText={`Score: ${score}`}
      >
        <Button onClick={togglePause} variant={'outline'} className="md:hidden">
          {paused ? 'Unpause' : 'Pause'}
        </Button>
      </GameHeader>
      <GameContent>
        <HiddenCat n={3} className="absolute bottom-0 right-0" />
        <div
          className={cn(
            'grid gap-1 transition-all w-2xl max-w-full grid-cols-20 ',
          )}
          {...swipeHandler}
        >
          {tiles.flatMap((r, i) =>
            r.map((t, idx) => {
              let className = tileBaseCN
              let content = ''
              if (t != null && !paused) {
                className = cn(className, tileColors[t])
              } else {
                className = cn(className, tileEmptyCN)
                if (riceMessage) {
                  content =
                    splitMessage[(i * r.length + idx) % splitMessage.length]
                }
              }
              return (
                <div className={className} key={'tile-' + i + '-' + idx}>
                  {content}
                </div>
              )
            }),
          )}
        </div>
      </GameContent>
    </GameCard>
  )
}

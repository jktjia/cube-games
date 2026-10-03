import { useEffect, useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import { gradient } from '@/utils/colors'
import { SnakeTileState } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import { cn } from '@/utils'
import GameContent from '@/components/game-content'
import useSnake from '@/hooks/use-snake'
import { useInterfere } from '@/hooks/use-interfere'

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
  const { updateActivity, riceMessage } = useEmptyContext()
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

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => !isGameOver && left(),
    onSwipedDown: () => !isGameOver && down(),
    onSwipedRight: () => !isGameOver && right(),
    onSwipedUp: () => !isGameOver && up(),
    preventScrollOnSwipe: true,
  })

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isGameOver) {
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
      } else if (e.key === 'Escape') {
        e.preventDefault()
        togglePause()
      }
    } else {
      restart()
    }
    updateActivity()
  }

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
    <GameContent
      gameOverMessage={isGameLost ? 'You Lost!' : 'You Won!'}
      isGameOver={isGameOver}
      restart={restart}
      setPaused={setPaused}
      // gameName="Minesweeper"
      controls={controls}
      scoreText={`Score: ${score}`}
      announcement={paused ? 'Paused' : undefined}
    >
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
  )
}

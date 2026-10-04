import { useCallback, useEffect, useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import { gradient } from '@/utils/colors'
import { TetrisBlock } from '@/types'
import useEmptyContext from '@/hooks/use-empty-context'
import { cn } from '@/utils'
import { GameCard, GameContent, GameHeader } from '@/components/game-card'
import useTetris from '@/hooks/use-tetris'
import { blockMatrices } from '@/hooks/use-tetris/consts'
import { useInterfere } from '@/hooks/use-interfere'
import { Button } from '@/components/ui/button'
import HiddenCat from '@/components/hidden-cat'

const blockColors = {
  [TetrisBlock.T]: gradient[0],
  [TetrisBlock.S]: gradient[2],
  [TetrisBlock.J]: gradient[4],
  [TetrisBlock.I]: gradient[6],
  [TetrisBlock.O]: gradient[9],
  [TetrisBlock.L]: gradient[11],
  [TetrisBlock.Z]: gradient[13],
}

const controls = `Left and right arrow keys: Piece shifting
Up arrow key: Rotating 90 degrees clockwise
Down arrow key: Non-locking soft drop
Space bar: Locking hard drop
C key / Shift key: Hold piece
Escape: Pause/unpause`
// Z key / Left Control key: Rotating 90 degrees counterclockwise`

const defaultSettings = {
  width: 10,
  height: 20,
}

const blockBaseCN = cn(
  'flex items-center justify-center aspect-square p-0 m-0',
  'max-w-full text-primary text-xs lg:text-sm min-w-2',
)

const blockEmptyCN = 'bg-input'

function BlockMatrix({
  block,
  keyPrefix,
}: {
  keyPrefix: string
  block?: TetrisBlock
}) {
  let m = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]
  if (block != undefined) {
    m = blockMatrices[block]
  }
  const halfN = Math.ceil(m.length / 2)
  let grid = []
  const N = block == TetrisBlock.O || block == TetrisBlock.I ? 4 : m.length
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      let className = cn(blockBaseCN, 'w-5')
      const mJ = j - 2 + halfN
      const mI = i - 2 + halfN
      if (
        block != undefined &&
        mI >= 0 &&
        mI < m.length &&
        mJ >= 0 &&
        mJ < m[mI].length &&
        m[mI][mJ]
      ) {
        className = cn(className, blockColors[block])
      }
      grid.push(<div className={className} key={`${keyPrefix}-${i}-${j}`} />)
    }
  }

  if (block == TetrisBlock.O) {
    grid = [...grid.slice(12), ...grid.slice(0, 12)]
  }

  if (block == TetrisBlock.I) {
    grid = grid.slice(0, 12)
  }

  return (
    <div
      className={
        block != undefined && block != TetrisBlock.O
          ? ' grid grid-cols-8 grid-rows-8'
          : ''
      }
    >
      <div className={'col-span-8 ' + (N == 3 ? ' row-span-2' : '')} />
      <div className={N != 3 ? 'hidden' : ''} />
      <div
        className={cn(
          'grid gap-1 transition-all max-h-full min-h-max row-span-6',
          N == 4 ? ' col-span-8 grid-cols-4' : ' col-span-6 grid-cols-3',
        )}
      >
        {grid.map((t) => t)}
      </div>
    </div>
  )
}

export default function Tetris() {
  const { updateActivity, updateHighScore, riceMessage } = useEmptyContext()
  const {
    visibleTiles,
    held,
    next,
    ghost,
    level,
    score,
    isGameOver,
    left,
    right,
    hold,
    rotate,
    hardDown,
    setSoftDown,
    restart,
    paused,
    setPaused,
    togglePause,
    annoucement,
    interfereProps,
  } = useTetris(defaultSettings)

  useInterfere(interfereProps)

  useEffect(() => {
    updateHighScore('tetris', score)
  }, [updateHighScore, score])

  const splitMessage = useMemo(
    () => (riceMessage ? riceMessage.toUpperCase().split('') : []),
    [riceMessage],
  )

  const swipeHandler = useSwipeable({
    onSwipedLeft: left,
    onSwipedDown: hardDown,
    onSwipedRight: right,
    onSwipedUp: hold,
    onTap: rotate,
    preventScrollOnSwipe: true,
  })

  const keyMap = useMemo(
    () =>
      new Map([
        ['ArrowUp', rotate],
        ['ArrowDown', () => setSoftDown(true)],
        ['ArrowLeft', left],
        ['ArrowRight', right],
        ['c', hold],
        ['Shift', hold],
        ['Escape', togglePause],
        [' ', hardDown],
      ]),
    [rotate, setSoftDown, left, right, hold, togglePause, hardDown],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (keyMap.has(e.key)) {
        e.preventDefault()
        const action = keyMap.get(e.key)
        action && action()
        updateActivity()
      }
    },
    [isGameOver, keyMap, updateActivity],
  )

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSoftDown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown])

  return (
    <GameCard
      gameOverMessage={'You Lost!'}
      isGameOver={isGameOver}
      announcement={paused ? 'Paused' : annoucement}
    >
      <GameHeader
        restart={restart}
        controls={controls}
        scoreText={`Score: ${score.toLocaleString('en-US')}`}
        setPaused={setPaused}
      >
        <Button onClick={togglePause} variant={'outline'} className="md:hidden">
          {paused ? 'Unpause' : 'Pause'}
        </Button>
      </GameHeader>
      <GameContent>
        <div className="flex flex-row items-start gap-4 text-xl sm:w-md">
          <div className="flex flex-col max-w-1/7">
            Hold
            <BlockMatrix block={held} keyPrefix="held" />{' '}
            <div className="font-semibold text-base my-2">{`Level: ${level}`}</div>
            <HiddenCat n={4} className="self-center my-2" />
          </div>
          <div
            className={cn('grid gap-1 transition-all grow', 'grid-cols-10')}
            {...swipeHandler}
          >
            {visibleTiles.flatMap((r, i) =>
              r.map((t, idx) => {
                let className = blockBaseCN
                let content = ''
                if (t != null && !paused) {
                  className = cn(className, blockColors[t])
                } else if (
                  ghost.some(({ x, y }) => y == i && x == idx) &&
                  !paused
                ) {
                  className = cn(className, 'bg-accent')
                  if (riceMessage) {
                    content =
                      splitMessage[(i * r.length + idx) % splitMessage.length]
                  }
                } else {
                  className = cn(className, blockEmptyCN)
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
          <div className="flex flex-col max-w-1/7">
            Next
            <div>
              {next.slice(0, 3).map((n, idx) => (
                <BlockMatrix block={n} keyPrefix={`next-${idx}`} key={idx} />
              ))}
            </div>
          </div>
        </div>
      </GameContent>
    </GameCard>
  )
}

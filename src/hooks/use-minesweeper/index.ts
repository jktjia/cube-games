import { useCallback, useEffect, useMemo, useState } from 'react'
import { initMines, initTiles, revealNeighbors, revealTile } from './helpers'
import { useMinesweeperInterfere } from './interfere'
import type { MinesweeperSettings } from '@/types'
import { MineTileState } from '@/types'
import { decrypt, encrypt } from '@/utils'

interface MinesweeperState {
  mines?: number[][]
  tiles: MineTileState[][]
  width: number
  height: number
  mineCount: number
}

export default function useMinesweeper(
  { width, height, mineCount }: MinesweeperSettings = {
    width: 30,
    height: 16,
    mineCount: 99,
  },
) {
  const [gameState, setGameState] = useState<MinesweeperState>(() => {
    const localMines = localStorage.getItem('minesweeper')
    if (localMines) {
      const localState: MinesweeperState = JSON.parse(decrypt(localMines))
      if (
        localState.width == width &&
        localState.height == height &&
        localState.mineCount == mineCount
      ) {
        return localState
      }
    }
    return {
      tiles: initTiles(width, height),
      width,
      height,
      mineCount,
    }
  })

  const [_, setTurns] = useState<number>(0)

  useEffect(() => {
    const { tiles, mines } = gameState
    const invalidTiles =
      tiles.length != height || tiles.some((r) => r.length != width)
    const invalidMines =
      mines &&
      (mines.length != height ||
        mines.some((r) => r.length != width) ||
        mines.flatMap((m) => m).filter((t) => t == -1).length != mineCount)
    if (invalidTiles || invalidMines) {
      const newTiles = initTiles(width, height)
      setGameState({
        tiles: newTiles,
        width,
        height,
        mineCount,
      })
    }
  })

  useEffect(() => {
    const strState = encrypt(JSON.stringify(gameState))
    localStorage.setItem('minesweeper', strState)
  }, [gameState])

  // const updateLocal = (state: MinesweeperState) => {
  //   const strState = encrypt(JSON.stringify(state))
  //   localStorage.setItem('minesweeper', strState)
  // }

  // const restart = useCallback(() => {
  //   setMines(undefined)
  //   const newTiles = initTiles(width, height)
  //   setTiles(newTiles)
  //   updateLocal({ mines: undefined, tiles: newTiles, width, height, mineCount })
  // }, [width, height, mineCount, setMines, setTiles, updateLocal, turns])

  const restart = useCallback(() => {
    setGameState({
      tiles: initTiles(width, height),
      width,
      height,
      mineCount,
    })
  }, [setGameState])

  const flag = useCallback(
    (x: number, y: number) => {
      if (gameState.mines) {
        const dup = JSON.parse(JSON.stringify(gameState.tiles))
        const current = dup[y][x]
        if (current == MineTileState.FLAG) {
          dup[y][x] = MineTileState.NOT_SEEN
          setGameState((s) => ({ ...s, tiles: dup }))
          setTurns((t) => t + 1)
        } else if (current == MineTileState.NOT_SEEN) {
          dup[y][x] = MineTileState.FLAG
          setGameState((s) => ({ ...s, tiles: dup }))
          setTurns((t) => t + 1)
        }
        // updateLocal({ mines: mines, tiles: tiles, width, height, mineCount })
      }
    },
    [gameState, setTurns],
  )

  const flagOrRevealNeighbors = useCallback(
    (x: number, y: number) => {
      if (gameState.mines) {
        const current = gameState.tiles[y][x]
        if (current == MineTileState.SEEN) {
          const newTiles = revealNeighbors(
            x,
            y,
            height,
            width,
            gameState.mines,
            gameState.tiles,
          )
          setGameState((s) => ({ ...s, tiles: newTiles }))
          setTurns((t) => t + 1)
        } else {
          flag(x, y)
        }
      }
    },
    [gameState, setTurns, flag],
  )

  const reveal = useCallback(
    (x: number, y: number) => {
      if (!gameState.mines) {
        const newMines = initMines(x, y, width, height, mineCount)
        // setMines(newMines)
        const newTiles = revealTile(
          x,
          y,
          height,
          width,
          newMines,
          gameState.tiles,
        )
        setGameState((s) => ({ ...s, mines: newMines, tiles: newTiles }))
        setTurns((t) => t + 1)
        // updateLocal({
        //   mines: newMines,
        //   tiles: newTiles,
        //   width,
        //   height,
        //   mineCount,
        // })
      } else {
        const newTiles = revealTile(
          x,
          y,
          height,
          width,
          gameState.mines,
          gameState.tiles,
        )
        setGameState((s) => ({ ...s, tiles: newTiles }))
        // setTiles(newTiles)
        setTurns((t) => t + 1)
        // updateLocal({ mines: mines, tiles: newTiles, width, height, mineCount })
      }
    },
    [gameState, setTurns],
  )

  const remaining = useMemo(() => {
    return (
      mineCount -
      gameState.tiles.flatMap((t) => t).filter((t) => t == MineTileState.FLAG)
        .length
    )
  }, [gameState])

  const isGameLost = useMemo(() => {
    const mines = gameState.mines
    return (
      mines &&
      gameState.tiles.some((r, i) =>
        r.some((t, idx) => t == MineTileState.SEEN && mines[i][idx] == -1),
      )
    )
  }, [gameState])

  const isGameWon = useMemo(() => {
    let gameWon = remaining == 0
    gameWon =
      gameWon &&
      gameState.tiles
        .flatMap((t) => t)
        .filter((t) => t == MineTileState.NOT_SEEN).length == 0
    return gameWon
  }, [remaining, gameState])

  const isGameOver = useMemo(
    () => isGameLost || isGameWon,
    [isGameLost, isGameWon],
  )

  useMinesweeperInterfere({
    reveal,
    tiles: gameState.tiles,
    mines: gameState.mines,
    restart,
    isGameOver,
  })

  return {
    mines: gameState.mines,
    tiles: gameState.tiles,
    flag,
    reveal,
    flagOrRevealNeighbors,
    restart,
    remaining,
    isGameLost,
    isGameWon,
    isGameOver,
  }
}

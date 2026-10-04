import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import type { ReactNode } from 'react'

export function GameCard({
  isGameOver,
  gameOverMessage,
  announcement,
  children,
}: {
  isGameOver?: boolean
  gameOverMessage?: string
  announcement?: string
  children?: ReactNode
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted max-w-full max-h-full flex flex-col justify-center">
      {children}
      {(isGameOver || announcement) && (
        <div className="self-center text-3xl font-semibold absolute w-max h-max bg-background/70 rounded p-2">
          {isGameOver ? gameOverMessage : announcement}
        </div>
      )}
    </Card>
  )
}

export function GameHeader({
  gameName,
  controls,
  scoreText,
  restart,
  setPaused,
  children,
}: {
  gameName?: string
  controls?: string
  scoreText?: string
  restart: () => void
  setPaused?: React.Dispatch<React.SetStateAction<boolean>>
  children?: ReactNode
}) {
  return (
    <CardHeader className="text-lg font-semibold flex flex-col sm:flex-row gap-1 w-full">
      <div className="flex flex-row gap-1">
        <Button
          variant="secondary"
          onClick={() => {
            restart()
          }}
          className="hover:cursor-pointer"
        >
          Restart
        </Button>
        {controls && (
          <Dialog
            onOpenChange={(open) => {
              setPaused && setPaused(open)
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="hover:cursor-pointer hidden md:inline"
              >
                Controls
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Controls</DialogTitle>
                {gameName && <DialogDescription>{gameName}</DialogDescription>}
              </DialogHeader>
              {controls.split('\n').map((str, idx) => (
                <p key={idx}>{str}</p>
              ))}
            </DialogContent>
          </Dialog>
        )}

        {children}
      </div>
      <div className="text-end grow">{scoreText}</div>
    </CardHeader>
  )
}

export function GameContent({ children }: { children?: ReactNode }) {
  return <CardContent className="grow overflow-auto">{children}</CardContent>
}

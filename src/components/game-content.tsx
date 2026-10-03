import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import type { ReactNode } from 'react'
import { Difficulty } from '@/types'

export default function GameContent({
  gameName,
  controls,
  scoreText,
  restart,
  setPaused,
  isGameOver,
  difficulty,
  setDifficulty,
  gameOverMessage,
  announcement,
  children,
}: {
  gameName?: string
  controls?: string
  scoreText?: string
  restart: () => void
  setPaused?: (b: boolean) => void
  isGameOver?: boolean
  difficulty?: Difficulty
  setDifficulty?: (d: Difficulty) => void
  gameOverMessage?: string
  announcement?: string
  children?: ReactNode
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted max-w-full max-h-full flex flex-col items-center justify-center">
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
          {setDifficulty && difficulty != undefined && (
            <Dialog
              onOpenChange={(open) => {
                setPaused && setPaused(open)
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
          )}
          {controls && (
            <Dialog
              onOpenChange={(open) => {
                setPaused && setPaused(open)
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="hover:cursor-pointer hidden sm:inline"
                >
                  Controls
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Controls</DialogTitle>
                  {gameName && (
                    <DialogDescription>{gameName}</DialogDescription>
                  )}
                </DialogHeader>
                {controls.split('\n').map((str, idx) => (
                  <p key={idx}>{str}</p>
                ))}
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="text-end grow">{scoreText}</div>
      </CardHeader>
      <CardContent className="grow overflow-auto">{children}</CardContent>{' '}
      {(isGameOver || announcement) && (
        <div className="text-3xl font-semibold absolute w-max h-max bg-background/70 rounded p-2">
          {isGameOver ? gameOverMessage : announcement}
        </div>
      )}
    </Card>
  )
}

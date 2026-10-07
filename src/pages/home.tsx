import { Link } from '@tanstack/react-router'
import type {InterfereAction} from '@/types';
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useEmptyContext from '@/hooks/use-empty-context'
import { gameOptions } from '@/utils'
import { useInterfere } from '@/hooks/use-interfere'
import HiddenCat from '@/components/hidden-cat'
import {  ToastVariant } from '@/types'

export default function Home() {
  const { title, getHighScore } = useEmptyContext()
  const actions: InterfereAction[] = gameOptions.map((g) => ({
    actionPossible: true,
    afterToast: {
      message: `${g.name} high score: ${getHighScore(g.id) + (g.scoreMeasure ? ' ' + g.scoreMeasure : '')}`,
      desc: 'Check your high scores on at /statistics',
      variant: ToastVariant.INFO,
    },
  }))

  useInterfere({ setNotifyTime: console.log, actions })

  return (
    <div className="flex flex-col justify-center items-start gap-5 h-full p-2 w-full lg:w-2xl">
      <div className="flex flex-row w-full items-center">
        <h1 className="text-5xl font-bold grow text-start">{title}</h1>
        <HiddenCat n={0} />
      </div>
      {/* <p>
        {riceMessage
          ? riceMessage
          : 'Ever notice how many basic games are based on boards made up of squares?'}
      </p> */}
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {gameOptions.map((g) => (
          <Link to={g.href} key={g.href}>
            <Card className="w-full flex flex-row p-5 min-w-fit">
              <g.icon size={20} />
              {g.name}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

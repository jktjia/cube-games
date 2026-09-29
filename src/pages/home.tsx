import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useEmptyContext from '@/hooks/use-empty-context'
import { gameOptions } from '@/utils'

export default function Home() {
  const { title, riceMessage } = useEmptyContext()

  return (
    <div className="w-2xl flex flex-col justify-center items-start gap-5 h-full p-2">
      <h1 className="text-5xl font-bold">{title}</h1>
      {/* <p>
        {riceMessage
          ? riceMessage
          : 'Ever notice how many basic games are based on boards made up of squares?'}
      </p> */}
      <Separator />
      <div className="grid grid-cols-2 gap-5 w-full">
        {gameOptions.map((g) => (
          <Link to={g.href}>
            <Card className="w-full flex flex-row p-5">
              <g.icon size={20} />
              {g.name}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

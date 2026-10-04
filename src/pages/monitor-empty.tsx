import { Cat, MessageSquareX } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { useCats } from '@/hooks/use-cats'
import useEmptyContext, { timeoutModifier } from '@/hooks/use-empty-context'
import { CAT_COUNT, gameOptions } from '@/utils'

export default function MonitorEmpty() {
  const { ignoreCount, findPage, lastActivity, getHighScore } =
    useEmptyContext()
  const { catsRemaining } = useCats()
  const [time] = useState(new Date())

  useEffect(() => {
    findPage('stats')
  }, [])

  return (
    <div className="w-full flex flex-col items-start gap-4 h-full">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <Separator />
      <h2 className="text-xl font-bold">High Scores</h2>
      <div className="grid w-full gap-4 md:grid-cols-2">
        {gameOptions.map((g) => (
          <Item key={g.id} variant={'outline'}>
            <ItemMedia variant="icon">
              <g.icon />
            </ItemMedia>
            <ItemContent className="text-start">
              <ItemTitle>{g.name}</ItemTitle>
              <ItemDescription>
                {getHighScore(g.id).toLocaleString('en-US') +
                  (g.scoreMeasure ? ` ${g.scoreMeasure}` : '')}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
      <Separator />
      <h2 className="text-xl font-bold">Other</h2>
      <Item variant={'outline'} className="w-full text-start">
        <ItemMedia variant="icon">
          <MessageSquareX />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{`Last activity: ${lastActivity.toLocaleString('en-US')}`}</ItemTitle>
          <ItemDescription>
            {time.getTime() - lastActivity.getTime() <
            5 * 60 * 1000 * timeoutModifier
              ? 'Get a life'
              : time.getTime() - lastActivity.getTime() >
                  30 * 60 * 1000 * timeoutModifier
                ? 'She misses you'
                : '...'}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant={'outline'} className="w-full text-start">
        <ItemMedia variant="icon">
          <MessageSquareX />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{`Ignore count: ${ignoreCount}`}</ItemTitle>
          <ItemDescription>
            {ignoreCount
              ? 'Stop sending her away'
              : 'You have never turned her off'}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant={'outline'} className="w-full text-start">
        <ItemMedia variant="icon">
          <Cat />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{`Cats found: ${CAT_COUNT - catsRemaining}`}</ItemTitle>
          <ItemDescription>
            {CAT_COUNT == catsRemaining
              ? 'She hid cats all over the website for you to find'
              : catsRemaining == 0
                ? 'You actually went and found all of her little stamps'
                : "She thought you'd like having cats to find"}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

import { Cat } from 'lucide-react'
import { toast } from 'sonner'
import { useCats } from '@/hooks/use-cats'
import { cn } from '@/utils'

export default function HiddenCat({
  n,
  size,
  className,
  visible,
}: {
  n: number
  size?: string | number
  className?: string
  visible?: boolean
}) {
  const { catsRemaining, isCatFound, findCat } = useCats()
  const classNameFull = cn(
    `text-primary`,
    isCatFound(n) || visible
      ? 'opacity-100 '
      : 'opacity-0 hover:opacity-50 hover:cursor-pointer',
    className,
  )

  const clickCatAndAlert = () => {
    if (!isCatFound(n)) {
      findCat(n)
      const newRemaining = catsRemaining - 1
      if (newRemaining) {
        toast.info('You found a cat!', {
          description: `${newRemaining} ${newRemaining == 1 ? 'cat' : 'cats'} remaining.`,
        })
      } else {
        toast.info('You found all of the cats!', {
          description: '',
        })
      }
    }
  }

  return (
    <Cat className={classNameFull} onClick={clickCatAndAlert} size={size} />
  )
}

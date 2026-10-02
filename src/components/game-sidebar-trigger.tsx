import { Box } from 'lucide-react'
import { Button } from './ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import useEmptyContext from '@/hooks/use-empty-context'

export function GameSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar()
  const { title } = useEmptyContext()

  return (
    <div className={className}>
      <Button size={'lg'} onClick={toggleSidebar} variant={'ghost'}>
        <Box />
        {title}
      </Button>
    </div>
  )
}

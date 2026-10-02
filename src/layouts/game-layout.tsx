import { Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

export default function GameLayout() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted max-w-full w-full max-h-full h-full min-w-fit min-h-fit">
      <Outlet />
    </Card>
  )
}

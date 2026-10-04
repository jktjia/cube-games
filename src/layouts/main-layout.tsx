import { Outlet } from '@tanstack/react-router'
import { Title } from 'react-head'
import { GameSidebar, GameSidebarTrigger } from '@/components/game-sidebar'
import useEmptyContext from '@/hooks/use-empty-context'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/utils'

export default function MainLayout() {
  const { title } = useEmptyContext()
  const { open } = useSidebar()
  return (
    <>
      <Title>{title}</Title>
      <GameSidebar />
      <div className="max-w-full max-h-full flex flex-col h-full">
        <GameSidebarTrigger
          className={cn('p-2 md:fixed z-10', open && 'hidden')}
        />
        <div className="container grow mx-auto p-4 sm:p-8 text-center relative justify-center items-center flex">
          <Outlet />
        </div>
      </div>
    </>
  )
}

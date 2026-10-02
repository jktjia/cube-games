import { Outlet } from '@tanstack/react-router'
import { Title } from 'react-head'
import { GameSidebar } from '@/components/game-sidebar'
import { GameSidebarTrigger } from '@/components/game-sidebar-trigger'
import useEmptyContext from '@/hooks/use-empty-context'

export default function MainLayout() {
  const { title } = useEmptyContext()
  return (
    <>
      <Title>{title}</Title>
      <GameSidebarTrigger className="p-2 md:fixed z-10" />
      <GameSidebar />
      <div className="container mx-auto p-4 sm:p-8 text-center relative max-w-full max-h-full justify-center items-center flex h-full w-full">
        <Outlet />
      </div>
    </>
  )
}

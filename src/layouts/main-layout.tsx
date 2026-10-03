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
      <GameSidebar />
      <div className="max-w-full max-h-full flex flex-col h-full">
        <GameSidebarTrigger className="p-2 md:fixed z-10" />
        <div className="container grow mx-auto p-4 sm:p-8 text-center relative justify-center items-center flex">
          <Outlet />
        </div>
      </div>
    </>
  )
}

import { Outlet, useNavigate } from '@tanstack/react-router'
import EmptyProvider from '@/components/providers/empty-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function BaseLayout() {
  const navigate = useNavigate()

  return (
    <EmptyProvider navigate={navigate}>
      <SidebarProvider defaultOpen={false}>
        <div className="text-center max-w-screen w-screen max-h-screen h-screen">
          <Outlet />
        </div>
      </SidebarProvider>
    </EmptyProvider>
  )
}

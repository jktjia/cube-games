import { Link } from '@tanstack/react-router'
import { Box } from 'lucide-react'
import HiddenCat from './hidden-cat'
import type { PageOption } from '@/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn, footerLinks, gameOptions } from '@/utils'
import useEmptyContext from '@/hooks/use-empty-context'

function PageLink({
  page,
  size,
  className,
}: {
  page: PageOption
  size?: 'default' | 'sm' | 'lg' | null
  className?: string
}) {
  const { toggleSidebar } = useSidebar()
  return (
    <Link to={page.href}>
      <SidebarMenuButton
        key={page.name}
        onClick={toggleSidebar}
        size={size}
        className={cn('flex flex-row gap-2 items-center w-full', className)}
      >
        <page.icon size={20} />
        {page.name}
      </SidebarMenuButton>
    </Link>
  )
}

export function GameSidebar() {
  const { title } = useEmptyContext()

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-start">
        <PageLink
          page={{ name: title, href: '/', icon: Box }}
          className="px-4 h-9"
        />
        <div className="grow" />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Games</SidebarGroupLabel>
          <SidebarMenu>
            {gameOptions.map((g) => (
              <PageLink key={g.name} page={g} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <HiddenCat n={1} size={20} className="m-2" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerLinks.map((p) => (
            <PageLink key={p.name} page={p} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

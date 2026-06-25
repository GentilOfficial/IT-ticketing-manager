import NavUser from '@/components/sidebar/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/providers/AuthProvider'
import { Headset, StickyNotePlus, Ticket, Users } from 'lucide-react'
import { Link, useLocation } from 'react-router'

const userNavItems = [{ label: 'My Tickets', icon: Ticket, to: '/tickets' }]

const adminNavItems = [
  { label: 'Tickets', icon: Ticket, to: '/admin/tickets' },
  { label: 'Users', icon: Users, to: '#' },
]

const bottomNavItems = [{ label: 'Open Ticket', icon: StickyNotePlus, to: '#' }]

const AppSidebar = () => {
  const { isAdmin } = useAuth()
  const { pathname } = useLocation()

  const navItems = isAdmin ? adminNavItems : userNavItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex justify-center border-b h-12">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-2">
                <Headset className="size-5 text-primary" />
                <span className="font-semibold text-sm">HelpDesk</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? 'Administration' : 'Menu'}</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ label, icon: Icon, to }, i) => (
              <SidebarMenuItem key={`${label}-${to}-${i}`}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(to)} tooltip={label}>
                  <Link to={to}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            {bottomNavItems.map(({ label, icon: Icon, to }, i) => (
              <SidebarMenuItem key={`${label}-${to}-${i}`}>
                <SidebarMenuButton asChild isActive={pathname === to} tooltip={label}>
                  <Link to={to}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

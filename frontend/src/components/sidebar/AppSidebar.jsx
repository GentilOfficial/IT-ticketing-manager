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
import { Headset, Ticket, TicketPlus } from 'lucide-react'
import { Link, useLocation } from 'react-router'

const userNavItems = [
  { label: 'My Tickets', icon: Ticket, to: '/tickets' },
  { label: 'New Ticket', icon: TicketPlus, to: '/new/ticket' },
]

const adminNavItems = [{ label: 'Tickets', icon: Ticket, to: '/admin/tickets' }]

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
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

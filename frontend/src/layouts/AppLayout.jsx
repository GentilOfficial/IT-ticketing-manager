import AppSidebar from '@/components/sidebar/AppSidebar'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const AppLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-4">
          <Button asChild variant="outline" size="icon">
            <SidebarTrigger />
          </Button>
          <ThemeSwitcher />
        </header>
        <div className="flex-1 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout

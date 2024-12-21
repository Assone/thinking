import { Link } from '@tanstack/react-router'
import { ChevronLeft, Cog, Home, LucideIcon, Star } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { memo } from 'react'
import { Button } from './ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar'

const items: { title: string; url: string; icon: LucideIcon }[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Favorites', url: '/favorites', icon: Star },
  { title: 'Settings', url: '/settings', icon: Cog },
]

export const AppSidebar = memo(() => {
  const { open, toggleSidebar } = useSidebar()

  return (
    <>
      <AnimatePresence>
        {!open && (
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-50 h-12 w-3 rounded-r-lg border-l-0 bg-background shadow-md hover:w-4 transition-all"
            >
              <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              <span className="sr-only">Open Sidebar</span>
            </Button>
          </m.div>
        )}
      </AnimatePresence>

      <Sidebar>
        <SidebarHeader className="border-b px-6 py-4">
          <m.div layout className="flex items-center justify-between">
            <m.h1
              layout="position"
              className="text-xl font-semibold tracking-tight"
            >
              Thinking
            </m.h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="relative z-10 h-7 w-7 rounded-full border bg-background shadow-xs"
            >
              <m.div
                animate={{ rotate: open ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </m.div>
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </m.div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="select-none">
                {items.map((item, index) => (
                  <SidebarMenuItem
                    key={item.title}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <SidebarMenuButton asChild className="w-full">
                      <Link
                        to={item.url}
                        className="group flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <m.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </m.div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t px-6 py-4">
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-muted-foreground"
          >
            Version 0.0.1
          </m.p>
        </SidebarFooter>
      </Sidebar>
    </>
  )
})

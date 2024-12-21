import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/use-toast'
import { db } from '@/services/db'
import { useSettingsStore } from '@/services/stores/settings'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useCallback } from 'react'

export const Route = createLazyFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { toast } = useToast()
  const { setTheme: setSystemTheme } = useTheme()
  const { reading, theme, setReading, setTheme } = useSettingsStore()

  const handleClearCache = useCallback(async () => {
    try {
      await db.delete()
      await db.open()
      toast({
        title: 'Cache cleared',
        description: 'All cached data has been cleared successfully.',
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to clear cache. Please try again.',
        variant: 'destructive',
      })
    }
  }, [toast])

  const handleResetApp = useCallback(async () => {
    try {
      await db.delete()
      localStorage.clear()
      window.location.reload()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to reset application. Please try again.',
        variant: 'destructive',
      })
    }
  }, [toast])

  return (
    <PageTransition>
      <div className="p-6 w-full">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your application preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Preferences</CardTitle>
              <CardDescription>
                Customize your reading experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Double Page View</Label>
                  <p className="text-sm text-muted-foreground">
                    Display two pages side by side
                  </p>
                </div>
                <Switch
                  checked={reading.doublePage}
                  onCheckedChange={(checked) =>
                    setReading({ doublePage: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Page Turn</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically turn pages while scrolling
                  </p>
                </div>
                <Switch
                  checked={reading.autoPageTurn}
                  onCheckedChange={(checked) =>
                    setReading({ autoPageTurn: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Default Scale</Label>
                  <p className="text-sm text-muted-foreground">
                    Set the default zoom level for documents
                  </p>
                </div>
                <Select
                  value={reading.defaultScale.toString()}
                  onValueChange={(value) =>
                    setReading({ defaultScale: parseFloat(value) })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select scale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">50%</SelectItem>
                    <SelectItem value="0.75">75%</SelectItem>
                    <SelectItem value="1">100%</SelectItem>
                    <SelectItem value="1.25">125%</SelectItem>
                    <SelectItem value="1.5">150%</SelectItem>
                    <SelectItem value="2">200%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the application theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Color Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color theme
                  </p>
                </div>
                <Select
                  value={theme.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') => {
                    setTheme({ theme: value })
                    setSystemTheme(value)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Font Size</Label>
                  <p className="text-sm text-muted-foreground">
                    Set the application font size
                  </p>
                </div>
                <Select
                  value={theme.fontSize}
                  onValueChange={(value: 'sm' | 'md' | 'lg') =>
                    setTheme({ fontSize: value })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your library data and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Library Storage</Label>
                  <p className="text-sm text-muted-foreground">
                    Manage your local storage and cached data
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleClearCache}>
                    Clear Cache
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-destructive">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all books and settings
                  </p>
                </div>
                <Button variant="destructive" onClick={handleResetApp}>
                  Reset Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}

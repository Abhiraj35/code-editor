"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Code2,
    Compass,
    FolderPlus,
    History,
    Home,
    LayoutDashboard,
    Lightbulb,
    type LucideIcon,
    Plus,
    Settings,
    Star,
    Terminal,
    Zap,
    Database,
    FlameIcon,
    ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
    id: string
    name: string
    icon: string
    starred: boolean
}

// Map icon names (strings) to their corresponding LucideIcon components
const lucideIconMap: Record<string, LucideIcon> = {
    Zap: Zap,
    Lightbulb: Lightbulb,
    Database: Database,
    Compass: Compass,
    FlameIcon: FlameIcon,
    Terminal: Terminal,
    Code2: Code2,
}

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
    const pathname = usePathname()
    const starredPlaygrounds = useMemo(() => initialPlaygroundData.filter((p) => p.starred), [initialPlaygroundData])
    const recentPlaygrounds = initialPlaygroundData

    return (
        <Sidebar variant="inset" collapsible="icon" className="border-r border-border bg-muted/30">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-3 justify-between group-data-[collapsible=icon]:justify-center">
                    <Image src={"/logo.svg"} alt="logo" height={60} width={60} className="group-data-[collapsible=icon]:hidden" />
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* Primary navigation */}
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/"}
                                className={cn(
                                    "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium",
                                    "[&[data-active=true]_svg]:text-primary"
                                )}
                                tooltip="Home"
                            >
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === "/dashboard"}
                                className={cn(
                                    "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium",
                                    "[&[data-active=true]_svg]:text-primary"
                                )}
                                tooltip="Dashboard"
                            >
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Collapsible sections for Starred and Recent */}
                <SidebarGroup className="flex-1 overflow-auto">
                    {/* Starred Section */}
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer py-1.5 px-2 uppercase text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground">
                            <CollapsibleTrigger className="flex flex-1 items-center gap-2 outline-none">
                                <Star className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">Starred</span>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                title="Add starred playground"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0 ? null : (
                                        <SidebarMenuSub>
                                            {starredPlaygrounds.map((playground) => {
                                                const IconComponent = lucideIconMap[playground.icon] || Code2
                                                return (
                                                    <SidebarMenuSubItem key={playground.id}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === `/playground/${playground.id}`}
                                                        >
                                                            <Link href={`/playground/${playground.id}`}>
                                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                                <span>{playground.name}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Recent Section */}
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroupLabel className="flex items-center gap-2 cursor-pointer py-1.5 px-2 uppercase text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground">
                            <CollapsibleTrigger className="flex flex-1 items-center gap-2 outline-none">
                                <History className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">Recent</span>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                title="Create new playground"
                            >
                                <FolderPlus className="h-4 w-4" />
                            </Button>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0 ? null : (
                                        <SidebarMenuSub>
                                            {recentPlaygrounds.map((playground) => {
                                                const IconComponent = lucideIconMap[playground.icon] || Code2
                                                return (
                                                    <SidebarMenuSubItem key={playground.id}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === `/playground/${playground.id}`}
                                                        >
                                                            <Link href={`/playground/${playground.id}`}>
                                                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                                                <span>{playground.name}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/playgrounds">
                                                        <span className="text-sm text-muted-foreground">View all playgrounds</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={pathname === "/settings"}
                            className={cn(
                                "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium",
                                "[&[data-active=true]_svg]:text-primary"
                            )}
                            tooltip="Settings"
                        >
                            <Link href="/settings">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
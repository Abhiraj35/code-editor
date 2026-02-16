import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions/index";
import { CommandPalette } from "@/modules/dashboard/components/command-palette";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { Project } from "@/modules/dashboard/types";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const playgroundData = await getAllPlaygroundForUser();

    const technologyIconMap: Record<string, string> = {
        REACT: "Zap",
        NEXTJS: "Lightbulb",
        EXPRESS: "Database",
        VUE: "Compass",
        HONO: "FlameIcon",
        ANGULAR: "Terminal",
    }

    const formattedPlaygroundData = playgroundData?.map((item: Project) => ({
        id: item.id,
        name: item.title,
        starred: item.Starmark?.[0]?.isMarked || false,
        icon: technologyIconMap[item.template] || "Code2"
    }))


    return (

        <SidebarProvider>

            <div className="flex min-h-screen w-full overflow-x-hidden">
                {/* Dashboard Sidebar */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData ?? []} />
                <main className="flex-1">
                    <CommandPalette projects={formattedPlaygroundData ?? []} />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )

}

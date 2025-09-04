import { ControlPanel } from "@/components/ControlPanel";
import { Room3DViewer } from "@/components/Room3DViewer";
import { useIsMobile } from "@/hooks/use-mobile";

export function RoomGenLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs sm:text-sm">R</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">RoomGen</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Floor Plan → Magic Prompt → 3D Room</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">MVP</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Floor Plan → Top View → 3D</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`container mx-auto px-4 sm:px-6 py-4 sm:py-6 ${
        isMobile 
          ? "space-y-4" 
          : "h-[calc(100vh-5rem)] flex gap-6"
      }`}>
        {/* Control Panel */}
        <div className={isMobile ? "w-full" : "w-1/2 h-full"}>
          <ControlPanel />
        </div>

        {/* 3D Viewer */}
        <div className={isMobile ? "w-full h-[400px]" : "w-1/2 h-full"}>
          <Room3DViewer />
        </div>
      </div>
    </div>
  );
}
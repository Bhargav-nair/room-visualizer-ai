import { ControlPanel } from "@/components/ControlPanel";
import { Room3DViewer } from "@/components/Room3DViewer";

export function RoomGenLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">RoomGen</h1>
                <p className="text-xs text-muted-foreground">Floor Plan → Magic Prompt → 3D Room</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">MVP Version</p>
              <p className="text-xs text-muted-foreground">Floor Plan → Top View → 3D</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto h-[calc(100vh-5rem)] flex gap-6 p-6">
        {/* Left Panel - Control Panel */}
        <div className="w-1/2 h-full">
          <ControlPanel />
        </div>

        {/* Right Panel - 3D Viewer */}
        <div className="w-1/2 h-full">
          <Room3DViewer />
        </div>
      </div>
    </div>
  );
}
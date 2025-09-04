import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";

interface FloorPlanData {
  units: string;
  rooms: Array<{
    id: string;
    name: string;
    polygon: number[][];
    height: number;
  }>;
  openings: any[];
  furniture: any[];
}

function Room3D({ roomData }: { roomData: FloorPlanData['rooms'][0] }) {
  // Convert polygon points to 3D room walls
  const wallHeight = roomData.height / 100; // Convert cm to meters for better scale
  const walls = roomData.polygon.map((point, index) => {
    const nextPoint = roomData.polygon[(index + 1) % roomData.polygon.length];
    const x1 = point[0] / 100; // Convert cm to meters
    const z1 = point[1] / 100;
    const x2 = nextPoint[0] / 100;
    const z2 = nextPoint[1] / 100;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    const centerX = (x1 + x2) / 2;
    const centerZ = (z1 + z2) / 2;
    const angle = Math.atan2(z2 - z1, x2 - x1);
    
    return {
      position: [centerX, wallHeight / 2, centerZ] as [number, number, number],
      rotation: [0, angle, 0] as [number, number, number],
      scale: [length, wallHeight, 0.1] as [number, number, number],
    };
  });

  // Calculate floor dimensions
  const minX = Math.min(...roomData.polygon.map(p => p[0])) / 100;
  const maxX = Math.max(...roomData.polygon.map(p => p[0])) / 100;
  const minZ = Math.min(...roomData.polygon.map(p => p[1])) / 100;
  const maxZ = Math.max(...roomData.polygon.map(p => p[1])) / 100;
  const floorWidth = maxX - minX;
  const floorDepth = maxZ - minZ;
  const floorCenterX = (minX + maxX) / 2;
  const floorCenterZ = (minZ + maxZ) / 2;

  return (
    <group>
      {/* Floor */}
      <mesh position={[floorCenterX, 0, floorCenterZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[floorWidth, floorDepth]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      
      {/* Walls */}
      {walls.map((wall, index) => (
        <mesh key={index} position={wall.position} rotation={wall.rotation} scale={wall.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e9ecef" />
        </mesh>
      ))}
      
      {/* Sample furniture - can be expanded based on furniture data */}
      <mesh position={[floorCenterX, 0.25, floorCenterZ - 1]}>
        <boxGeometry args={[1.5, 0.5, 0.8]} />
        <meshStandardMaterial color="#6c757d" />
      </mesh>
    </group>
  );
}

function Scene() {
  // Sample floor plan data - this would come from props or state
  const sampleFloorPlan: FloorPlanData = {
    units: "cm",
    rooms: [
      {
        id: "room-1",
        name: "Living Room",
        polygon: [[0, 0], [500, 0], [500, 400], [0, 400]],
        height: 300
      }
    ],
    openings: [],
    furniture: []
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      
      {sampleFloorPlan.rooms.map((room) => (
        <Room3D key={room.id} roomData={room} />
      ))}
      
      <Grid 
        position={[0, 0, 0]} 
        args={[10, 10]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#e9ecef"
        sectionSize={2.5} 
        sectionThickness={1} 
        sectionColor="#adb5bd"
        fadeDistance={20}
        fadeStrength={1}
      />
      
      <Environment preset="city" />
    </>
  );
}

export function Room3DViewer() {
  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1 shadow-soft border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            3D Room Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-4rem)]">
          <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted">
            <Canvas
              camera={{ 
                position: [5, 4, 5], 
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              shadows
              className="w-full h-full"
            >
              <Scene />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={15}
                maxPolarAngle={Math.PI / 2.2}
                autoRotate={false}
                autoRotateSpeed={0.5}
                dampingFactor={0.05}
                enableDamping={true}
                zoomSpeed={0.5}
                rotateSpeed={0.5}
                panSpeed={0.5}
              />
            </Canvas>
          </div>
        </CardContent>
      </Card>
      
      {/* 3D Controls Info */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          🖱️ Click & drag to rotate • 🔍 Scroll to zoom • ⚡ Right-click & drag to pan
        </p>
      </div>
    </div>
  );
}
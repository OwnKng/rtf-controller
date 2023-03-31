import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import { Suspense } from "react"
import Player from "./Player"
import { KeyboardControls } from "@react-three/drei"

function App() {
  return (
    <Canvas>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Suspense fallback={null}>
          <Physics>
            <Player />
            <RigidBody position={[0, 0, 10]}>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color='red' />
              </mesh>
            </RigidBody>
            <RigidBody type='fixed'>
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[100, 0.1, 100]} />
                <meshBasicMaterial />
              </mesh>
            </RigidBody>
          </Physics>
        </Suspense>
        <OrbitControls />
      </KeyboardControls>
    </Canvas>
  )
}

export default App

import { useFrame } from "@react-three/fiber"
import {
  RigidBody,
  RapierRigidBody,
  vec3,
  CapsuleCollider,
} from "@react-three/rapier"
import { useRef } from "react"
import { useController } from "./hooks/useController"
import * as THREE from "three"

export default function Player() {
  const ref = useRef<RapierRigidBody>(null!)
  const pointer = useRef<THREE.Object3D>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const [characterState] = useController(ref)

  useFrame((_, delta) => {
    if (characterState.velocity.length() > 0.01) {
      pointer.current.lookAt(
        pointer.current.getWorldPosition(vec3()).add(characterState.velocity)
      )
    }

    const mult = delta / (1 / 60)
    meshRef.current!.quaternion.slerp(pointer.current?.quaternion, 0.1 * mult)
  })

  return (
    <>
      <RigidBody
        ref={ref}
        type='dynamic'
        enabledRotations={[false, false, false]}
      >
        <object3D name='player' ref={pointer} />
        <CapsuleCollider args={[0.2, 0.4]}>
          <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color='teal' />
          </mesh>
        </CapsuleCollider>
      </RigidBody>
    </>
  )
}

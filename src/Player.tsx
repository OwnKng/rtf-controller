import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import { useRef } from "react"
import { useController } from "./hooks/useController"

export default function Player() {
  const ref = useRef<RapierRigidBody>(null!)

  useController(ref)

  return (
    <RigidBody ref={ref}>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color='teal' />
      </mesh>
    </RigidBody>
  )
}

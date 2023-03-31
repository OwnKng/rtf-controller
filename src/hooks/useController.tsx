import { useFrame, useThree, Vector3 } from "@react-three/fiber"
import { RapierRigidBody, useRapier, vec3 } from "@react-three/rapier"
import { RefObject, useEffect, useRef } from "react"
import { useKeyboardControls } from "@react-three/drei"

const maxSpeed = 0.1

export function useController(bodyRef: RefObject<RapierRigidBody>) {
  const [, get] = useKeyboardControls()

  const refState = useRef({
    grounded: false,
    velocity: vec3(),
    moving: false,
  })

  useFrame((_, delta) => {
    const body = bodyRef.current

    const { forward, backward, left, right } = get()

    if (body) {
      const linvel = vec3(body.linvel())
      const movement = vec3()
      const translation = vec3(body.translation())

      if (forward && linvel.z > -maxSpeed) {
        movement.z = Math.max(-maxSpeed - linvel.z, -maxSpeed)
      }

      if (backward && linvel.z < maxSpeed) {
        movement.z = Math.min(maxSpeed - linvel.z, maxSpeed)
      }
      if (left && linvel.x > -maxSpeed) {
        movement.x = Math.max(-maxSpeed - linvel.x, -maxSpeed)
      }
      if (right && linvel.x < maxSpeed) {
        movement.x = Math.min(maxSpeed - linvel.x, maxSpeed)
      }

      const mult = delta / (1 / 60)
      movement.multiply({ x: mult, y: mult, z: mult })

      body.setTranslation(translation.add(movement), true)

      refState.current.velocity = movement
      refState.current.moving = refState.current.velocity.length() > 0.01
    }
  })
}

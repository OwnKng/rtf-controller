import { useFrame, useThree, Vector3 } from "@react-three/fiber"
import { RapierRigidBody, useRapier, vec3 } from "@react-three/rapier"
import { RefObject, useRef } from "react"
import { useKeyboardControls } from "@react-three/drei"
import { Ray } from "@dimforge/rapier3d-compat"

const maxSpeed = 0.1
const jumpSpeed = 8

export function useController(bodyRef: RefObject<RapierRigidBody>) {
  const [, get] = useKeyboardControls()

  const rapier = useRapier()

  const refState = useRef({
    grounded: false,
    velocity: vec3(),
    moving: false,
  })

  useFrame((_, delta) => {
    const body = bodyRef.current

    const { forward, backward, left, right, jump } = get()

    if (body) {
      const linvel = vec3(body.linvel())
      const movement = vec3()
      const translation = vec3(body.translation())
      const rayOrigin = translation.clone()

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
      movement.multiply(vec3({ x: mult, y: mult, z: mult }))

      // jumping
      const world = rapier.world.raw()
      const ray = world.castRay(
        new Ray(rayOrigin, {
          x: 0,
          y: -1,
          z: 0,
        }),
        10,
        false
      )

      const grounded = ray && ray.collider && Math.abs(ray.toi) <= 0.6

      if (grounded && jump) {
        body.setLinvel(linvel.add(vec3({ x: 0, y: jumpSpeed, z: 0 })), true)
      }

      body.setTranslation(translation.add(movement), true)

      refState.current.velocity = movement
      refState.current.moving = refState.current.velocity.length() > 0.01
    }
  })

  return [refState.current]
}

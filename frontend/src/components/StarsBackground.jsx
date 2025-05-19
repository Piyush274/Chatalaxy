import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

export default function StarsBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -10,
      backgroundColor: 'black'
    }}>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: false }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <Stars />
      </Canvas>
    </div>
  )
}

function Stars(props) {
  const ref = useRef()
  const mouseX = useRef(0)
  const targetRotation = useRef(0)
  const [sphere] = useState(() => random.inSphere(new Float32Array(8000), { radius: 1.5 }))

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      targetRotation.current = mouseX.current * 0.2
      ref.current.rotation.y += (targetRotation.current - ref.current.rotation.y) * 0.05
      ref.current.rotation.x -= delta / 10
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.006}
          sizeAttenuation={true}
          depthWrite={false}
          alphaTest={0.01}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}
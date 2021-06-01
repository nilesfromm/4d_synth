import React from "react"
import { Suspense } from "react"
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, softShadows } from "@react-three/drei"
import Model from './Sphere'

// softShadows()

const Rock = () => {
    return (
        <mesh
            castShadow
            position={[0, 0.5, 0]}
            scale={[2,1,1]}
            rotation={[0, 0, 0]}
        >
            <boxBufferGeometry attach="geometry" />
            <meshStandardMaterial attach="material" color="black" />
        </mesh>
    )
}
const Ground = () => {
    return (
        <mesh receiveShadow position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[100, 100, 100]} />
        <meshStandardMaterial attach="material" color="white" />
        </mesh>
    )
}
const Three = () => {
    return (
        <Canvas 
            shadows
            shadowMap
            camera={{ position: [-4, 0.5, 4], fov: 50 }}
        >
            <ambientLight intensity={0.25} />
            <pointLight intensity={0.25} position={[10, 3, 10]} />
            <spotLight
                castShadow
                position={[1, 6, 0]}
                intensity={0.5}
                penumbra={1}
            />
            <fog attach="fog" args={["white", 5, 12]} />
            
            <Suspense fallback={null}>
                <Model />
                <OrbitControls />
                <Ground />
            </Suspense>
            {/* <Rock /> */}
        </Canvas>
    )
}

export default Three
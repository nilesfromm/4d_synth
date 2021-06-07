import React, { useRef, useEffect, useLayoutEffect, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, softShadows } from "@react-three/drei"
import { getState, useStore } from "../utils/store"
import Model from './Sphere'

// softShadows()

const Rock = () => {
    const rockRef = useRef()
    // const freqX = useStore((state)=> state.freqX)

    const freqXref = useRef(useStore.getState().freqX)

    // console.log(xRef.current);

    useEffect(() => useStore.subscribe(
        (freqX) => (freqXref.current = freqX),
        state => state.freqX
      ), [])

    useFrame(() => {
        if (rockRef.current) {
        //   const { advance } = getState()
          const rotations = [freqXref.current/500, 0, 0]
          
        //   advance("rock", "rotation", state => {
        //     const [x, y, z] = state.rock.rotation
        //     return [x + 0.01, y + 0.01, z + 0.01]
        //   })
          rockRef.current.rotation.set(...rotations)
        }
    })

    return (
        <mesh
            ref={rockRef}
            castShadow
            position={[0, 0.5, 0]}
            scale={[2,1,1]}
        >
            <boxBufferGeometry attach="geometry" />
            <meshStandardMaterial attach="material" color="coral" />
        </mesh>
    )
}
const Ground = () => {
    const { setXx, setX } = useStore()
    return (
        <mesh 
            receiveShadow 
            position={[0, -2.5, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
        >
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
            camera={{ position: [-8, 0.5, 8], fov: 28 }}
        >
            <ambientLight intensity={0.5} />
            {/* <pointLight intensity={0.25} position={[10, 3, 10]} /> */}
            <spotLight
                castShadow
                position={[1, 6, 0]}
                intensity={0.5}
                penumbra={1}
                // shadow-mapSize-width={1024}
                // shadow-mapSize-height={1024}
            />
            <color attach="background" args={["white"]} />
            <fog attach="fog" args={["white", 9, 14]} />
            <Suspense fallback={null}>
                <Environment files={"SoftLightsStudio2.hdr"} opacity={0} path={"/hdri/"} />
                <Model />
                <OrbitControls />
                {/* <Ground /> */}
                {/* <Rock /> */}
            </Suspense>
        </Canvas>
    )
}

export default Three
import React, { useRef,useCallback, useEffect } from 'react'
import { useGLTF, Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { vertexShader, fragmentShader } from "./shaders";
import { getState, useStore } from "../utils/store"

const shader = { vertexShader, fragmentShader };

export default function Model(props) {
  const oscVals = useRef(useStore.getState().osc)

  useEffect(() => useStore.subscribe(
    (osc) => (oscVals.current = osc),
    state => state.osc,
  ), [])

  // const { freqX } = useStore()
  const gradient = `vec4(0.0, vUv.y, 1., 1.0)`;
  const g_uniforms = {
    u_time: {value: 0.0},
    u_scale: {value: 2.0},
    x_freq: {value: 0.0},
    y_freq: {value: 0.0},
    z_freq: {value: 0.0},
    w_freq: {value: 0.0},
    x_amp: {value: 0.0},
    y_amp: {value: 0.0},
    z_amp: {value: 0.0},
    w_amp: {value: 0.0},
  }

  // const from = `vec4 diffuseColor = vec4( diffuse, opacity );`;
  // const to = `vec4 diffuseColor = vec4(${gradient});`;
  const onBeforeCompile = shader => {
    shader.uniforms = {
      ...shader.uniforms,
      ...g_uniforms,
    };

    shader.vertexShader = [
      'uniform float u_time, u_scale;',
      'uniform float x_freq, y_freq, z_freq, w_freq;', 
      'uniform float x_amp, y_amp, z_amp, w_amp;\n',
      'uniform mat4 view_matrix;',
      'uniform mat4 model_matrix; \n',
    ].join('\n') + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [   
        '\tfloat pi = 3.14159265358979323846;',
        '\tvec3 transformed = position;',
        '\tfloat p = 1.0;',
        '\tfloat q = 1.0;',
        `\tfloat tx = u_time + u_scale * x_freq*( position.z/(2.*pi));`,
        `\tfloat ty = u_time + u_scale * y_freq*( position.x/(2.*pi));`,
        `\tfloat tz = u_time + u_scale * z_freq*( position.y/(2.*pi));`,
        `\tfloat tw = u_time + u_scale * w_freq*( position.x/(2.*pi));`,
        '\tfloat x = sin(p*tx);',
        '\tfloat y = sin(p*ty);',
        '\tfloat z = sin(p*tz);',
        '\tfloat w = sin(p*tw);',
        '\ttransformed.y += x_amp * x;',
        '\ttransformed.y += y_amp * y;',
        '\ttransformed.z += z_amp * z;',
        '\ttransformed.z += w_amp * w;',
      ].join('\n')
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`, 
      `vec4 diffuseColor = vec4(0.0, vUv.y/2., 0.5, 1.0);` //0.0125, 0.+vUv.y/20., 0.+vUv.y/10., 1.0
    );
  };

  const mat = useRef()
  const oBC = useCallback(onBeforeCompile);
  // console.log(mat);
  useFrame((state, delta) => {
    g_uniforms.u_time.value -= delta;
    g_uniforms.x_freq.value = oscVals.current[1].freq/50;
    g_uniforms.x_amp.value = 0.5+(oscVals.current[1].amp/120);
    g_uniforms.y_freq.value = oscVals.current[0].freq/50;
    g_uniforms.y_amp.value = 0.5+(oscVals.current[0].amp/120);
    g_uniforms.z_freq.value = oscVals.current[2].freq/50;
    g_uniforms.z_amp.value = 0.5+(oscVals.current[2].amp/120);
    g_uniforms.w_freq.value = oscVals.current[3].freq/50;
    g_uniforms.w_amp.value = 0.5+(oscVals.current[3].amp/120);
    // console.log(g_uniforms.y_amp.value);
  })
  console.log(g_uniforms);
    
  // }, [])
  const { nodes, materials } = useGLTF('models/sphere.gltf')
  // console.log(mat.current.material);
  return (
    <mesh 
      castShadow
      receiveShadow
      ref={mat}
      // geometry={nodes.Sphere.geometry} 
      // material={nodes.Sphere.material} 
      position={[0,0,0]}
    >
      <sphereGeometry attach="geometry" args={[1.5, 128, 128]} />
      <meshPhysicalMaterial 
        attach="material" 
        color="#444444" 
        // ref={material}
        metalness={0.15}
        roughness={0.95}
        castShadow
        defines={{ USE_UV: true }}
        onBeforeCompile={oBC}
      />
    </mesh>
  )
}

useGLTF.preload('/sphere.gltf')

import React, { useRef,useCallback, useMemo } from 'react'
import { useGLTF, Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { vertexShader, fragmentShader } from "./shaders";

const shader = { vertexShader, fragmentShader };


export default function Model(props) {

  const gradient = `vec4(0.0, vUv.y, 1., 1.0)`;

  const g_uniforms = {
    u_time: {value: 0.0},
    u_scale: {value: 2.0},
    x_freq: {value: 0.0},
    y_freq: {value: 8.0},
    z_freq: {value: 0.0},
    x_amp: {value: 0.0},
    y_amp: {value: 0.5},
    z_amp: {value: 0.0},
    x_off: {value: 0.0},
    y_off: {value: 0.0},
    z_off: {value: 0.0},
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
      'uniform float x_freq, y_freq, z_freq;', 
      'uniform float x_amp, y_amp, z_amp;',
      'uniform float x_off, y_off, z_off; \n',
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
        `\tfloat tz = u_time + u_scale * z_freq*( position.x/(2.*pi));`,
        '\tfloat r = cos(q*tx);',
        '\tfloat x = sin(p*tx);',
        '\tfloat y = sin(p*ty);',
        '\tfloat z = -sin(q*tz);',
        '\ttransformed.x += x_amp * x;',
        '\ttransformed.y += y_amp * y;',
        '\ttransformed.z += z_amp * z;',
      ].join('\n')
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`, 
      `vec4 diffuseColor = vec4(${gradient});`
    );
  };

  const mat = useRef()
  const oBC = useCallback(onBeforeCompile);
  useFrame((state, delta) => {
    g_uniforms.u_time.value += delta;
  })
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
      <sphereGeometry attach="geometry" args={[1, 64, 64]} />
      <Environment files={"SoftLightsStudio2.hdr"} path={"/hdri/"} />
      <meshPhysicalMaterial 
        attach="material" 
        color="#444444" 
        // ref={material}
        metalness={0.75}
        roughness={0.5}
        castShadow
        defines={{ USE_UV: true }}
        onBeforeCompile={oBC}
      />
    </mesh>
  )
}

useGLTF.preload('/sphere.gltf')

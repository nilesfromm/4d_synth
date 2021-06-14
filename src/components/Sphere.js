import React, { useRef,useCallback, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from "../utils/store"
import Three from './ThreeJS'

export default function Model(props) {
  const oscVals = useRef(useStore.getState().osc)

  const loaded = props.l;
  console.log("sphere loaded:",loaded);

  // useEffect(() => useStore.subscribe(
  //   (osc) => (oscVals.current = osc),
  //   state => state.osc,
  // ), [])
  const glowC = useRef(()=>new Three.Vector3( 0, 0, 1 ));
  // const { freqX } = useStore()
  const g_uniforms = {
    glowColor: {value: glowC.current},
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

    console.log("sphere loaded:",loaded);

    shader.vertexShader = [
      'float pi = 3.14159265358979323846;',
      'vec3 orthogonal(vec3 v) {',
      '\treturn normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0): vec3(0.0, -v.z, v.y));',
      '}',
      'float texelSize = 1.0 / 128.0;',
      'varying vec3 vpos;',
      'varying float intensity;',
      'varying vec3 fNormal;',
      'uniform float u_time, u_scale;',
      'uniform float x_freq, y_freq, z_freq, w_freq;', 
      'uniform float x_amp, y_amp, z_amp, w_amp;',
      'uniform mat4 view_matrix;',
      'uniform mat4 model_matrix;',
      'vec3 displace(vec3 point) {',
      // '\treturn vec3(point.x,point.y,point.z);',
      '\treturn vec3(0., (x_amp * sin(-u_time + u_scale * x_freq*( point.z/(2.*pi))))+(y_amp * sin(u_time + u_scale * y_freq*( point.x/(2.*pi)))), (z_amp * sin(u_time + u_scale * z_freq*( point.y/(2.*pi))))+(w_amp * sin(u_time + u_scale * w_freq*( point.x/(2.*pi)))));',
      '}',
      'uniform float p;\n',
    ].join('\n') + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [   
        '\tvpos = position;',
        // '\tvec3 transformed = position;',
        '\tvec3 displacedPosition = position + displace(position);',
        '\tfloat offset = 0.00585938;',

        // '\tfloat y = (x_amp * sin(-u_time + u_scale * x_freq*( position.z/(2.*pi))))+(y_amp * sin(u_time + u_scale * y_freq*( position.x/(2.*pi))));',
        // '\tfloat z = (z_amp * sin(u_time + u_scale * z_freq*( position.y/(2.*pi))))+(w_amp * sin(u_time + u_scale * w_freq*( position.x/(2.*pi))));',

        // '\ttransformed.y += y;',
        // '\ttransformed.z += z;',
        // '\ttransformed = position + displace(transformed);',
        '\tvec3 tangent = orthogonal(normal);',
        '\tvec3 bitangent = normalize(cross(normal, tangent));',
        '\tvec3 neighbour1 = position + tangent * offset;', //transformed was position???
        '\tvec3 neighbour2 = position + bitangent * offset;',
        '\tvec3 displacedNeighbour1 = neighbour1 + displace(neighbour1);',
        '\tvec3 displacedNeighbour2 = neighbour2 + displace(neighbour2);',

        '\tvec3 displacedTangent = displacedNeighbour1 - displacedPosition;',
        '\tvec3 displacedBitangent = displacedNeighbour2 - displacedPosition;',

        '\tvec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));',

        // '\tvNormal = ( normalMatrix * normal );',
        'fNormal = normalize(normalMatrix * displacedNormal);',
        'vec3 transformed = displacedPosition;',
        'vNormal = normalize(normalMatrix * displacedNormal);',
        '\tintensity = pow(1.0 - abs(dot(normalize(normalMatrix * displacedNormal), vec3(0, 0, 1))), 1.);', //normalize(normalMatrix * displacedNormal)
      ].join('\n')
    );
    shader.vertexShader = shader.vertexShader.replace(
      'vec3 transformedNormal = objectNormal;',
      'vec3 transformedNormal = displacedNormal;'
    );
    // console.log(shader.vertexShader);

    shader.fragmentShader = [
      'varying vec3 vpos;',
      'varying float intensity;',
      'varying vec3 fNormal;',
      'vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {',
      '\treturn a + b * cos(6.28318 * (c * t + d));',
      '}',
      'uniform vec3 glowColor;\n'
    ].join('\n') + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`, 
      // `vec4 diffuseColor = vec4( fNormal, opacity );`,
      `\nvec3 brightness = vec3(0.5, 0.5, 0.5);
      \nvec3 contrast = vec3(0.5, 0.5, 0.5);
      \nvec3 oscilation = vec3(1.0, 1.0, 1.0);
      \nvec3 phase = vec3(0.2, 0.1, 0.0);
      \nvec3 color = cosPalette(intensity, brightness, contrast, oscilation, phase);
      \nvec3 glow = vec3(0.25,1.0,1.0) * intensity;
      \n vec4 diffuseColor = vec4(color, 1.0);`
      // `vec4 diffuseColor = vec4(abs(vpos.x), abs(vpos.y), abs(vpos.z), 1.0);` //0.0125, 0.+vUv.y/20., 0.+vUv.y/10., 1.0
    );
  };

  // useEffect(() => {
  //   const { setInitialState } = getState()
  //   setInitialState("rock", {
  //     rotation: [0, 0, 0],
  //   })
  // }, [])

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
  // console.log(mat.current.material);
      
  return (
    <mesh 
      castShadow
      receiveShadow
      ref={mat}
      position={[0,0,0]}
    >
      <sphereGeometry attach="geometry" args={[1.5, 128, 128]} />
      <meshPhysicalMaterial 
        attach="material"
        color="#444444" 
        metalness={0.0}
        roughness={0.3}
        castShadow
        // flatShading={true}
        onBeforeCompile={oBC}
      />
    </mesh>
  )
}

// useGLTF.preload('/sphere.gltf')

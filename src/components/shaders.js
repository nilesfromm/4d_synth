export const vertexShader = `

uniform vec3 scale;
uniform float time;

// The UV mapping coordinates of a vertex
varying vec2 vUV;

void main()
{
    // The "coordinates" in UV mapping representation
    vUV = uv;

    float pi = 3.14159265358979323846;

    // vec3 newPosition = position + normal * 10.1;
    position.x = 1.0;
    // Compute the position of the vertex using a standard formula
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const gradient = `vec4(0.0, vUv.y, 0.5, vUv.y)`;

export const fragmentShader = `
varying vec2 vUV;
varying float vAmount;

void main()
{
    gl_FragColor = ${gradient};
}
`;
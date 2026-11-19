export const oceanVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorldPos;

  float wave(vec2 p, vec2 dir, float frequency, float speed) {
    return sin(dot(p, dir) * frequency + uTime * speed);
  }

  void main() {
    vec3 p = position;
    vec2 xz = p.xz;

    float height = 0.0;
    height += wave(xz, normalize(vec2(1.0, 0.35)), 0.55, 0.85) * 0.018;
    height += wave(xz, normalize(vec2(-0.3, 1.0)), 0.95, 1.2) * 0.010;
    height += wave(xz, normalize(vec2(0.7, -0.8)), 1.75, 1.55) * 0.005;

    p.y += height;

    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const oceanFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uShore;
  uniform vec4 uShoreBounds;
  uniform vec3 uSunDir;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uLagoon;
  uniform vec3 uFoam;
  uniform vec3 uSky;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec3 vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = (vWorldPos.xz - uShoreBounds.xy) * uShoreBounds.zw;
    vec2 mask = texture2D(uShore, clamp(uv, 0.001, 0.999)).rg;
    float softShore = mask.r;
    float sharpShore = mask.g;

    float t = uTime;
    float n1 = fbm(vWorldPos.xz * 0.55 + vec2(t * 0.10, t * 0.07));
    float n2 = fbm(vWorldPos.xz * 1.7 - vec2(t * 0.16, -t * 0.11));

    vec3 normal = normalize(vec3((n1 - 0.5) * 0.22, 1.0, (n2 - 0.5) * 0.22));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

    vec3 reflectDir = reflect(-uSunDir, normal);
    float specular = pow(max(dot(reflectDir, viewDir), 0.0), 90.0);

    float shallow = smoothstep(0.02, 0.9, softShore);
    vec3 color = mix(uDeep, uShallow, shallow);
    color = mix(color, uLagoon, smoothstep(0.5, 0.98, softShore) * 0.55);
    color = mix(color, uSky, fresnel * 0.4);
    color += specular * vec3(1.0, 0.93, 0.78) * 0.9;

    float foamBand =
      smoothstep(0.38, 0.5, sharpShore) *
      (1.0 - smoothstep(0.5, 0.62, sharpShore));
    float foamNoise = fbm(vWorldPos.xz * 4.5 + vec2(t * 0.55, -t * 0.35));
    float foam = foamBand * smoothstep(0.5, 0.9, foamNoise + 0.14);
    color = mix(color, uFoam, clamp(foam, 0.0, 1.0) * 0.58);

    float fog = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorldPos));
    color = mix(color, uFogColor, fog);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export const skyVertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    vec4 world = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const skyFragmentShader = /* glsl */ `
  uniform vec3 uDayTop;
  uniform vec3 uDayHorizon;
  uniform vec3 uNightTop;
  uniform vec3 uNightHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uMoonColor;
  uniform vec3 uSunDir;
  uniform vec3 uMoonDir;
  uniform float uNight;
  uniform float uTime;

  varying vec3 vDirection;

  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec3 dir = normalize(vDirection);
    float up = clamp(dir.y, 0.0, 1.0);

    vec3 top = mix(uDayTop, uNightTop, uNight);
    vec3 horizon = mix(uDayHorizon, uNightHorizon, uNight);
    vec3 color = mix(horizon, top, pow(up, 0.55));

    // Matahari siang.
    float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
    float sunDisc = smoothstep(0.9994, 0.99975, sunDot);
    vec3 sun = uSunColor * (sunDisc * 1.8 + pow(sunDot, 14.0) * 0.22);
    color += sun * (1.0 - uNight);

    // Bulan malam + halo tipis.
    float moonDot = max(dot(dir, normalize(uMoonDir)), 0.0);
    float moonDisc = smoothstep(0.9995, 0.99982, moonDot);
    color += uMoonColor * (moonDisc * 1.35 + pow(moonDot, 80.0) * 0.22) * uNight;

    // Bintang prosedural: satu bintang per sel, hanya muncul malam hari.
    vec3 p = dir * 150.0;
    vec3 cell = floor(p);
    float rnd = hash13(cell);
    vec3 jitter = vec3(
      hash13(cell + 11.0),
      hash13(cell + 23.0),
      hash13(cell + 37.0)
    );
    vec3 center = cell + 0.5 + (jitter - 0.5) * 0.62;
    float starDistance = length(p - center);
    float star = (1.0 - smoothstep(0.0, 0.48, starDistance)) * step(0.982, rnd);
    star *= 0.55 + 0.45 * sin(uTime * 1.6 + rnd * 42.0);
    float starMask = smoothstep(0.015, 0.2, dir.y) * uNight;
    color += vec3(0.86, 0.93, 1.0) * star * starMask * 1.25;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

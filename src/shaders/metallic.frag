precision mediump float;
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

varying vec2 vUv;
uniform vec3 u_color;

void main(){
  vec2 coord = vUv * 2.0 - 1.0;

  // Multi-directional anisotropic highlights
  float h1 = pow(max(0.0, 1.0 - abs(coord.x + coord.y * 0.3)), 4.0);
  float h2 = pow(max(0.0, 1.0 - abs(coord.x * 0.4 - coord.y)), 3.0) * 0.7;
  float h3 = pow(max(0.0, 1.0 - abs(coord.x * coord.y * 2.0)), 2.0) * 0.3;

  // Subtle noise for surface texture
  float noise = fract(sin(dot(vUv * 50.0, vec2(12.9898, 78.233))) * 43758.5453);

  // Fresnel-like edge brightening
  float edge = 1.0 - pow(1.0 - length(coord) * 0.5, 2.0);

  // Combine highlights with variation
  float metallic = 0.6 + (h1 + h2 + h3) * 0.4 + noise * 0.05 + edge * 0.1;

  // Base metal with subtle iridescence
  vec3 baseColor = u_color.x > 0.0 ? u_color : vec3(0.85, 0.9, 0.98);
  vec3 color = baseColor * metallic;

  // Subtle color shift for iridescence
  color.r *= 1.0 + h1 * 0.1;
  color.b *= 1.0 + h2 * 0.1;

  // Metallic curve
  color = pow(color, vec3(0.75));
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
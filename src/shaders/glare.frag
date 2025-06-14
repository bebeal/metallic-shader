precision mediump float;

varying vec2 vUv;

uniform vec2  u_mouse; // -1..1
uniform float u_time; // seconds

void main(){
  vec2 dir = normalize(u_mouse * vec2(1.0, -1.0));
  vec2 p   = vUv - 0.5;
  float d  = dot(p, dir);
  float g  = smoothstep(0.25, 0.0, abs(d));
  float flick = 0.75 + 0.25 * sin(u_time * 3.0 + d * 40.0);

  gl_FragColor = vec4(vec3(1.0) * flick, g * 0.6);
}

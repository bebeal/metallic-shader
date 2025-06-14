import React, { useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import glareFragSrc from "../../shaders/glare.frag";
import metallicFragSrc from "../../shaders/metallic.frag";
import vertSrc from "../../shaders/vertex.vert";
import type { CardProps } from "./Card";
import { Card } from "./Card";

export const CardShaders: React.FC<CardProps & { metallicColor?: string }> = (props) => {
  const { metallicColor = "#FFFFFF", ...cardProps } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl");
    if (!gl || !canvas) return;

    /* compile helper */
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    /* programs -------------------------------------------------- */
    const vert = compile(gl.VERTEX_SHADER, vertSrc);

    const makeProgram = (fragSrc: string) => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vert);
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
      gl.linkProgram(prog);
      return prog;
    };

    const progMetallic = makeProgram(metallicFragSrc);   // static metallic
    const progGlare = makeProgram(glareFragSrc);  // mouse-driven sheen

    /* shared quad ---------------------------------------------- */
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const bindAttr = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };
    bindAttr(progMetallic);
    bindAttr(progGlare);

    /* uniforms -------------------------------------------------- */
    const uMouse     = gl.getUniformLocation(progGlare, "u_mouse");
    const uTime      = gl.getUniformLocation(progGlare, "u_time");
    const uColorMetallic = gl.getUniformLocation(progMetallic,  "u_color");

    /* static uniforms ----------------------------------------- */
    if (uColorMetallic) {
      const toRGB = (hex: string) => {
        const h = hex.replace('#', '');
        const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
        const r = ((num >> 16) & 255) / 255;
        const g = ((num >> 8) & 255) / 255;
        const b = (num & 255) / 255;
        return [r, g, b] as [number, number, number];
      };
      const [r, g, b] = toRGB(metallicColor);
      gl.useProgram(progMetallic);
      gl.uniform3f(uColorMetallic, r, g, b);
    }

    /* render loop ---------------------------------------------- */
    gl.enable(gl.BLEND);

    const render = () => {
      const t  = performance.now() * 1e-3;
      const tv = tiltRef.current;               // [-1,1] per axis

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      /* metallic pass */
      gl.useProgram(progMetallic);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      /* glare pass */
      gl.useProgram(progGlare);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);       // additive
      gl.uniform2f(uMouse, tv[0], tv[1]);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    };

    render();
  }, [vertSrc, metallicFragSrc, glareFragSrc]);

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={800}
      style={{ position: "relative", width: "fit-content" }}
      onMove={(e) => {
        const { tiltAngleX, tiltAngleY } = e;
        const nx = (tiltAngleY ?? 0) / 10; // normalize using max angle
        const ny = -(tiltAngleX ?? 0) / 10;
        tiltRef.current = [nx, ny];
      }}
    >
      <Card {...cardProps}>
      <canvas
             ref={canvasRef}
             style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               pointerEvents: "none",
             }}
           />
      </Card>
    </Tilt>
  );
};

import { useEffect, useRef, type MouseEventHandler, type ReactNode } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import { useThemeFx } from "@/lib/theme-context";
import "./SpecularButton.css";

const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.35;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = clamp(gaussianLine(d, uThickness), 0.0, 1.0);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = clamp(line * rim * edgeClamp * uIntensity, 0.0, 0.85);

  vec3 col = clamp(uBaseColor * base + uLineColor * hi, 0.0, 1.0);
  float a = clamp(base + hi, 0.0, 0.9);
  fragColor = vec4(col * a, a);
}
`;

export interface SpecularButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: ReactNode;
  /** "auto" keeps whatever padding/size the className already provides. */
  size?: "auto" | "sm" | "md" | "lg";
  /** Corner radius in px. Defaults to the element's own computed radius. */
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  /** Apply the standalone glass surface instead of inheriting className styling. */
  glass?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * Specular (WebGL) button. The GL context is created lazily on hover/focus and
 * torn down when the pointer leaves, so hundreds of these can live on a grid
 * page without exhausting the browser's WebGL context budget.
 */
export default function SpecularButton({
  children = "Get Started",
  size = "auto",
  radius,
  tint,
  tintOpacity = 0,
  blur = 0,
  textColor,
  lineColor,
  baseColor,
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  glass = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
  ...rest
}: SpecularButtonProps) {
  const fx = useThemeFx();
  const btnRef = useRef<HTMLButtonElement>(null);
  const fxRef = useRef<HTMLSpanElement>(null);
  const propsRef = useRef<Record<string, unknown>>({});
  const disposeRef = useRef<(() => void) | null>(null);
  const fadeRef = useRef<(() => void) | null>(null);
  const hoverRef = useRef<(() => void) | null>(null);

  const resolvedLine = lineColor ?? fx.line;
  const resolvedBase = baseColor ?? fx.base;

  propsRef.current = {
    radius,
    lineColor: resolvedLine,
    baseColor: resolvedBase,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  };

  useEffect(() => {
    const btn = btnRef.current;
    const host = fxRef.current;
    if (!btn || !host) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let mounted = true;

    const start = () => {
      if (disposeRef.current || !mounted) return;

      let renderer: Renderer;
      try {
        renderer = new Renderer({
          alpha: true,
          premultipliedAlpha: true,
          antialias: true,
          dpr: window.devicePixelRatio || 1,
        });
      } catch {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });
      host.appendChild(gl.canvas);

      const sizeRef = { w: 1, h: 1, r: 18 };
      const resize = () => {
        const rect = btn.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        sizeRef.w = w;
        sizeRef.h = h;
        sizeRef.r = parseFloat(getComputedStyle(btn).borderTopLeftRadius) || 0;
        renderer.setSize(w + PAD * 2, h + PAD * 2);
        program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr];
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
      };
      const ro = new ResizeObserver(resize);
      ro.observe(btn);
      resize();

      let pointerAngle: number | null = null;
      let proximityT = 0;
      let hovering = false;
      const onPointerMove = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.hypot(dx, dy);
        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2);
          const ny = (cy - e.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
        }
        const p = propsRef.current as { proximity: number };
        const t = Math.max(0, 1 - dist / Math.max(p.proximity, 1));
        proximityT = t * t * (3 - 2 * t);
      };
      window.addEventListener("pointermove", onPointerMove);

      let fadingOut = false;
      let angle = 2.4;
      let idleAngle = 2.4;
      let bright = 0;
      let last = performance.now();
      let raf = 0;

      fadeRef.current = () => {
        fadingOut = true;
        proximityT = 0;
        hovering = false;
      };
      hoverRef.current = () => {
        fadingOut = false;
        hovering = true;
      };


      const lineC = new Color();
      const baseC = new Color();

      const update = (now: number) => {
        raf = requestAnimationFrame(update);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const p = propsRef.current as {
          radius?: number;
          lineColor: string;
          baseColor: string;
          intensity: number;
          shineSize: number;
          shineFade: number;
          thickness: number;
          speed: number;
          followMouse: boolean;
          autoAnimate: boolean;
        };

        idleAngle += p.speed * dt;
        const steer = p.followMouse && pointerAngle != null && (!p.autoAnimate || proximityT > 0);
        const target = steer ? (pointerAngle as number) : idleAngle;
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        angle += diff * (1 - Math.exp(-dt * 7));

        const rawTarget = fadingOut ? 0 : p.autoAnimate ? 1 : hovering ? Math.max(proximityT, 0) : 0;
        const brightTarget = Math.min(Math.max(rawTarget, 0), 1);
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));
        bright = Math.min(Math.max(bright, 0), 1);

        lineC.set(p.lineColor);
        baseC.set(p.baseColor);
        const r = p.radius ?? sizeRef.r;
        program.uniforms.uAngle.value = angle;
        program.uniforms.uRadius.value =
          Math.min(r, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
        program.uniforms.uIntensity.value = Math.min(Math.max(p.intensity * bright, 0), 1);
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = p.thickness * dpr;
        renderer.render({ scene: mesh });

        if (fadingOut && bright < 0.004) {
          // fully faded out — safe to release the GL context without a visual pop
          disposeRef.current?.();
        }
      };
      raf = requestAnimationFrame(update);

      disposeRef.current = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        disposeRef.current = null;
      };
    };

    let idle: ReturnType<typeof setTimeout> | null = null;
    const wake = () => {
      if (idle) { clearTimeout(idle); idle = null; }
      start();
    };
    const sleep = () => {
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => disposeRef.current?.(), 700);
    };

    btn.addEventListener("pointerenter", wake);
    btn.addEventListener("focus", wake);
    btn.addEventListener("pointerleave", sleep);
    btn.addEventListener("blur", sleep);

    if (autoAnimate) start();

    return () => {
      mounted = false;
      if (idle) clearTimeout(idle);
      btn.removeEventListener("pointerenter", wake);
      btn.removeEventListener("focus", wake);
      btn.removeEventListener("pointerleave", sleep);
      btn.removeEventListener("blur", sleep);
      disposeRef.current?.();
    };
  }, [autoAnimate]);

  const cls = [
    "specular-button",
    glass ? "specular-button--glass" : "",
    size !== "auto" ? `specular-button--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      ref={btnRef}
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...(rest.style ?? {}),
        ...({
          "--sb-tint": tint ?? fx.accent,
          "--sb-tint-opacity": tintOpacity,
          "--sb-blur": `${blur}px`,
          "--sb-text-color": textColor ?? "inherit",
        } as React.CSSProperties),
      }}
    >
      <span className="specular-button__fx" ref={fxRef} aria-hidden />
      {children}
    </button>
  );
}

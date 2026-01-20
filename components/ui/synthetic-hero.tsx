"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// SplitText is a premium plugin. We'll use a standard GSAP character animation as a fallback
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface ShaderPlaneProps {
    vertexShader: string;
    fragmentShader: string;
    uniforms: { [key: string]: { value: unknown } };
}

const ShaderPlane = ({
    vertexShader,
    fragmentShader,
    uniforms,
}: ShaderPlaneProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
            material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.FrontSide}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
    );
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
      float r = length(p);
      float a = atan(p.y, p.x);
      return vec2(r, a);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);

      vec2 polar = toPolar(p);
      float r = polar.x;
      float rot = r + u_time + p.x * 0.100;
      
      vec2 i = p;
      float c = 0.0;
      for (float n = 0.0; n < 4.0; n++) {
          float rr = r + 0.15 * sin(u_time*0.7 + float(n) + r*2.0);
          p *= mat2(
              cos(rot - sin(u_time / 10.0)), sin(rot),
              -sin(cos(rot) - u_time / 10.0), cos(rot)
          ) * -0.25;

          float t = r - u_time / (n + 30.0);
          i -= p + sin(t - i.y) + rr;

          c += 2.2 / length(vec2(
              (sin(i.x + t) / 0.15),
              (cos(i.y + t) / 0.15)
          ));
      }

      c /= 8.0;

      // Deep Sea / Emerald Theme
      vec3 baseColor = vec3(0.0, 0.4, 0.6); // Slightly bluer for our theme
      vec3 secondaryColor = vec3(0.2, 0.7, 0.5);
      vec3 finalColor = mix(baseColor, secondaryColor, sin(u_time * 0.2) * 0.5 + 0.5) * smoothstep(0.0, 1.0, c * 0.6);

      fragColor = vec4(finalColor, 1.0);
  }

  void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
  }
`;

interface HeroProps {
    title?: string;
    description?: string;
    badgeText?: string;
    badgeLabel?: string;
    ctaButtons?: Array<{ text: string; href?: string; primary?: boolean }>;
    microDetails?: Array<string>;
    className?: string;
}

const SyntheticHero = ({
    title = "An experiment in light, motion, and the quiet chaos between.",
    description = "Experience a new dimension of interaction — fluid, tactile, and alive. Designed for creators who see beauty in motion.",
    badgeText = "React Three Fiber",
    badgeLabel = "Experience",
    ctaButtons = [
        { text: "Explore the Canvas", href: "#explore", primary: true },
        { text: "Learn More", href: "#learn-more" },
    ],
    microDetails = [
        "Immersive shader landscapes",
        "Hand-tuned motion easing",
        "Responsive, tactile feedback",
    ],
    className
}: HeroProps) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const badgeWrapperRef = useRef<HTMLDivElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const paragraphRef = useRef<HTMLParagraphElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
    const microRef = useRef<HTMLUListElement | null>(null);
    const shaderUniforms = useMemo(
        () => ({
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector3(1, 1, 1) },
        }),
        [],
    );

    useGSAP(
        () => {
            if (!headingRef.current) return;

            // Simple reveal animation as a fallback for SplitText
            gsap.from(headingRef.current, {
                opacity: 0,
                y: 50,
                filter: "blur(10px)",
                duration: 1.2,
                ease: "power4.out"
            });

            if (badgeWrapperRef.current) {
                gsap.from(badgeWrapperRef.current, { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
            }
            if (paragraphRef.current) {
                gsap.from(paragraphRef.current, { opacity: 0, y: 20, duration: 0.8, delay: 0.4 });
            }
            if (ctaRef.current) {
                gsap.from(ctaRef.current, { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
            }

            const microItems = microRef.current ? Array.from(microRef.current.querySelectorAll("li")) : [];
            if (microItems.length > 0) {
                gsap.from(microItems, { opacity: 0, y: 10, duration: 0.5, stagger: 0.1, delay: 0.8 });
            }
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className={cn("relative flex items-center justify-center min-h-[90vh] overflow-hidden", className)}
        >
            <div className="relative z-10 flex flex-col items-center text-center px-6 py-20">
                <div ref={badgeWrapperRef}>
                    <Badge className="mb-6 bg-blue-500/10 hover:bg-blue-500/15 text-blue-300 backdrop-blur-md border border-blue-500/20 uppercase tracking-wider font-medium flex items-center gap-2 px-4 py-1.5">
                        <span className="text-[10px] font-light tracking-[0.18em] text-blue-100/80">
                            {badgeLabel}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-blue-400/60" />
                        <span className="text-xs font-light tracking-tight text-blue-200">
                            {badgeText}
                        </span>
                    </Badge>
                </div>

                <h1
                    ref={headingRef}
                    className="text-5xl md:text-8xl max-w-5xl font-black tracking-tighter text-white mb-6 uppercase leading-tight"
                >
                    {title}
                </h1>

                <p
                    ref={paragraphRef}
                    className="text-blue-50/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium tracking-tight"
                >
                    {description}
                </p>

                <div
                    ref={ctaRef}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    {ctaButtons.map((button, index) => {
                        const isPrimary = button.primary ?? index === 0;
                        const classes = isPrimary
                            ? "px-10 py-4 rounded-full text-base font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all cursor-pointer text-white"
                            : "px-10 py-4 rounded-full text-base font-black uppercase tracking-widest border-white/20 text-white hover:bg-white/5 backdrop-blur-lg transition-all cursor-pointer";

                        if (button.href) {
                            return (
                                <Button
                                    key={index}
                                    variant={isPrimary ? undefined : "outline"}
                                    className={classes}
                                    asChild
                                >
                                    <a href={button.href}>{button.text}</a>
                                </Button>
                            );
                        }

                        return (
                            <Button
                                key={index}
                                variant={isPrimary ? undefined : "outline"}
                                className={classes}
                            >
                                {button.text}
                            </Button>
                        );
                    })}
                </div>

                {microDetails.length > 0 && (
                    <ul
                        ref={microRef}
                        className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/40"
                    >
                        {microDetails.map((detail, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <span className="h-1 w-1 rounded-full bg-blue-500/40" />
                                {detail}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default SyntheticHero;

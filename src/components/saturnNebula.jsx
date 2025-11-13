import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SaturnNebula = () => {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ==================== SCENE SETUP ====================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0520, 0.00015);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 0, 100);

    // Optimized renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: window.devicePixelRatio === 1, // Only on non-retina
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Slightly brighter
    containerRef.current.appendChild(renderer.domElement);

    // ==================== MOUSE INTERACTION ====================
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    let speed = 1.0;
    let scrollSparkle = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleWheel = (e) => {
      speed += e.deltaY * -0.001;
      speed = Math.max(0.2, Math.min(speed, 3.0));
      scrollSparkle = 1.0;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('wheel', handleWheel);

    // ==================== VIBRANT NEBULA COLOR PALETTE ====================
    const nebulaColors = {
      // Electric Pinks & Magentas
      hotPink: new THREE.Color(0xff1493),         // Deep hot pink
      electricPink: new THREE.Color(0xff69b4),    // Hot pink
      neonMagenta: new THREE.Color(0xff00ff),     // Pure magenta
      rosePink: new THREE.Color(0xff1493),        // Rose pink
      lightPink: new THREE.Color(0xffb6c1),       // Light pink
      
      // Vibrant Cyans & Aquas  
      electricCyan: new THREE.Color(0x00ffff),    // Pure cyan
      neonAqua: new THREE.Color(0x00fff7),        // Aqua
      brightTurquoise: new THREE.Color(0x40e0d0), // Turquoise
      skyBlue: new THREE.Color(0x87ceeb),         // Sky blue
      
      // Mint & Green Tones
      neonMint: new THREE.Color(0x00ff9f),        // Neon mint
      electricLime: new THREE.Color(0xccff00),    // Electric lime
      mintGreen: new THREE.Color(0x98ff98),       // Mint green
      
      // Purple & Violet
      electricPurple: new THREE.Color(0x9d00ff),  // Electric purple
      neonViolet: new THREE.Color(0x8a2be2),      // Blue violet
      deepPurple: new THREE.Color(0x9400d3),      // Deep purple
      
      // Golden & Orange Accents
      neonOrange: new THREE.Color(0xff6600),      // Neon orange
      electricGold: new THREE.Color(0xffd700),    // Gold
      peach: new THREE.Color(0xffdab9),           // Peach
    };

    // ==================== OPTIMIZED COLORFUL SATURN ====================
    function createSaturn() {
      const saturnGroup = new THREE.Group();
      
      // Ultra-optimized sphere with fewer segments for performance
      const planetGeometry = new THREE.SphereGeometry(35, 32, 32);
      const planetMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec2 vUv;
          
          void main() {
            // Ultra-vibrant color palette
            vec3 hotPink = vec3(1.0, 0.08, 0.58);
            vec3 electricCyan = vec3(0.0, 1.0, 1.0);
            vec3 neonMint = vec3(0.0, 1.0, 0.62);
            vec3 electricPurple = vec3(0.62, 0.0, 1.0);
            vec3 neonOrange = vec3(1.0, 0.4, 0.0);
            vec3 electricGold = vec3(1.0, 0.84, 0.0);
            
            // Efficient band pattern using single sin wave
            float lat = vUv.y;
            float band = sin(lat * 12.0 + time * 0.15) * 0.5 + 0.5;
            float band2 = sin(lat * 8.0 - time * 0.1) * 0.5 + 0.5;
            
            // Simple noise for texture
            float noise = sin(vUv.x * 30.0 + time * 0.08) * 0.5 + 0.5;
            
            // Color mixing - optimized
            vec3 color = mix(hotPink, electricCyan, band);
            color = mix(color, neonMint, band2 * 0.7);
            color = mix(color, electricPurple, noise * 0.4);
            color = mix(color, neonOrange, band * band2 * 0.5);
            
            // Pole highlights - hot pink/gold poles
            float pole = smoothstep(0.85, 0.95, lat) + smoothstep(0.15, 0.05, lat);
            color = mix(color, mix(hotPink, electricGold, 0.5), pole * 0.8);
            
            // Edge glow for transparency
            float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 2.5);
            
            // Transparent ghostly effect
            float alpha = 0.25 + rim * 0.6;
            color += rim * 0.4;
            color *= 1.5; // Boost brightness
            
            gl_FragColor = vec4(color, alpha);
          }
        `
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      saturnGroup.add(planet);
      
      // Ultra-optimized spiky minty green fire rings with 64 segments
      const ringGeometry = new THREE.RingGeometry(40, 70, 64);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          // Noise function for fire turbulence
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }
          
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          
          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 2.0;
            
            for(int i = 0; i < 5; i++) {
              value += amplitude * noise(p * frequency);
              frequency *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          void main() {
            float dist = length(vPosition);
            float angle = atan(vPosition.y, vPosition.x);
            
            // Minty green color palette
            vec3 darkMint = vec3(0.0, 0.3, 0.2);        // Deep mint base
            vec3 mint = vec3(0.0, 0.6, 0.4);            // Dark mint
            vec3 mintGreen = vec3(0.0, 0.8, 0.5);       // Medium mint
            vec3 brightMint = vec3(0.0, 1.0, 0.62);     // Bright mint
            vec3 lightMint = vec3(0.4, 1.0, 0.75);      // Light mint
            vec3 paleMint = vec3(0.7, 1.0, 0.85);       // Pale mint
            vec3 whiteMint = vec3(0.9, 1.0, 0.95);      // White mint
            
            // SPIKY FIRE - Sharp angular patterns
            float spikeAngle = angle * 25.0; // More spikes
            float spike = abs(sin(spikeAngle + time * 2.0));
            spike = pow(spike, 0.3); // Sharpen the spikes
            
            // Secondary spike layer for more detail
            float spike2 = abs(sin(spikeAngle * 1.5 - time * 1.5));
            spike2 = pow(spike2, 0.4);
            
            // Combine spikes
            float spikePattern = spike * 0.7 + spike2 * 0.3;
            
            // Fire turbulence - rises upward with spiky motion
            vec2 fireUV = vec2(angle * 5.0, (dist - 40.0) * 0.1);
            float turbulence = fbm(fireUV + vec2(time * 0.3, -time * 1.2));
            float turbulence2 = fbm(fireUV * 2.5 + vec2(time * 0.5, -time * 1.8));
            
            // Rising spiky flames pattern
            float flameRise = fbm(vec2(angle * 15.0, dist * 0.2 - time * 2.0));
            
            // Flickering flames with spikes
            float flicker = sin(time * 10.0 + angle * 30.0) * 0.5 + 0.5;
            flicker = mix(0.6, 1.0, flicker);
            
            // Combine turbulence with spikes for jagged fire
            float firePattern = turbulence * 0.4 + turbulence2 * 0.3 + flameRise * 0.3;
            firePattern *= flicker;
            firePattern *= spikePattern; // Apply spiky pattern
            
            // Distance-based variation
            float distNorm = (dist - 40.0) / 30.0;
            
            // Create minty green fire gradient
            vec3 color;
            
            if (firePattern > 0.85) {
              // Hottest spikes - white mint
              color = mix(paleMint, whiteMint, (firePattern - 0.85) / 0.15);
            } else if (firePattern > 0.7) {
              // Very hot - pale mint
              color = mix(lightMint, paleMint, (firePattern - 0.7) / 0.15);
            } else if (firePattern > 0.55) {
              // Hot - light mint
              color = mix(brightMint, lightMint, (firePattern - 0.55) / 0.15);
            } else if (firePattern > 0.4) {
              // Medium - bright mint
              color = mix(mintGreen, brightMint, (firePattern - 0.4) / 0.15);
            } else if (firePattern > 0.25) {
              // Warm - medium mint
              color = mix(mint, mintGreen, (firePattern - 0.25) / 0.15);
            } else if (firePattern > 0.1) {
              // Cool - dark mint
              color = mix(darkMint, mint, (firePattern - 0.1) / 0.15);
            } else {
              // Embers - deep mint base
              color = mix(darkMint * 0.5, darkMint, firePattern / 0.1);
            }
            
            // Add distance-based cooling (edges are slightly darker)
            color = mix(color, darkMint, distNorm * 0.3);
            
            // Spiky ember sparkles in bright mint
            float ember = hash(vPosition.xy * 80.0 + time * 2.0);
            if (ember > 0.985 && firePattern > 0.2 && spikePattern > 0.6) {
              color += whiteMint * 0.8;
            }
            
            // Sharp spiky edges - boost transparency at spike peaks
            float spikeAlpha = smoothstep(0.4, 0.9, spikePattern);
            
            // Transparent fire with spiky edges
            float alpha = firePattern * 0.7 * spikeAlpha;
            alpha *= smoothstep(40.0, 42.0, dist); // Fade inner edge
            alpha *= smoothstep(70.0, 66.0, dist); // Fade outer edge
            
            // Add glow and intensity
            color *= 1.7;
            
            gl_FragColor = vec4(color, alpha);
          }
        `
      });
      
      // Create back half of rings
      const ringsBack = new THREE.Mesh(ringGeometry, ringMaterial);
      ringsBack.rotation.x = Math.PI / 2.5;
      ringsBack.renderOrder = 0;
      saturnGroup.add(ringsBack);
      
      saturnGroup.add(planet);
      
      // Create front half of rings
      const ringMaterialFront = ringMaterial.clone();
      const ringsFront = new THREE.Mesh(ringGeometry.clone(), ringMaterialFront);
      ringsFront.rotation.x = Math.PI / 2.5;
      ringsFront.renderOrder = 2;
      saturnGroup.add(ringsFront);
      
      saturnGroup.position.set(0, 0, -50);
      saturnGroup.renderOrder = 1; // Render before stars
      scene.add(saturnGroup);
      
      return { saturnGroup, planetMaterial, ringMaterial, ringMaterialFront };
    }

    // ==================== OPTIMIZED COLORFUL STAR SYSTEM ====================
    function createPointyStars() {
      // Reduced star count for CPU optimization
      const starCount = 8000;
      const geometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      const speeds = new Float32Array(starCount);
      const phases = new Float32Array(starCount);
      const spikes = new Float32Array(starCount);
      const animModes = new Float32Array(starCount);
      
      // Ultra-vibrant star colors
      const starColors = [
        new THREE.Color(0xff1493), // Hot pink
        new THREE.Color(0x00ffff), // Electric cyan
        new THREE.Color(0x00ff9f), // Neon mint
        new THREE.Color(0xff00ff), // Magenta
        new THREE.Color(0xffd700), // Gold
        new THREE.Color(0xff6600), // Neon orange
        new THREE.Color(0x9d00ff), // Electric purple
        new THREE.Color(0xccff00), // Electric lime
        new THREE.Color(0xffffff), // Pure white
      ];
      
      for (let i = 0; i < starCount; i++) {
        let radius = (Math.random() < 0.9) 
          ? 800 + Math.random() * 1800 
          : Math.random() * 600;
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = -Math.random() * 3000 - 500;
        
        // Random vibrant color
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];
        colors[i * 3] = starColor.r;
        colors[i * 3 + 1] = starColor.g;
        colors[i * 3 + 2] = starColor.b;
        
        sizes[i] = Math.random() * 3 + 0.8;
        speeds[i] = 50 + Math.random() * 150;
        phases[i] = Math.random() * Math.PI * 2;
        spikes[i] = 4 + Math.floor(Math.random() * 3);
        
        const modeRand = Math.random();
        if (modeRand < 0.4) {
          animModes[i] = 0.0;
        } else if (modeRand < 0.7) {
          animModes[i] = 1.0;
        } else {
          animModes[i] = 2.0;
        }
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute('spikes', new THREE.BufferAttribute(spikes, 1));
      geometry.setAttribute('animMode', new THREE.BufferAttribute(animModes, 1));
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute float speed;
          attribute float phase;
          attribute float spikes;
          attribute float animMode;
          
          varying vec3 vColor;
          varying float vPhase;
          varying float vSpikes;
          varying float vIntensity;
          
          uniform float time;
          
          void main() {
            vColor = color;
            vPhase = phase;
            vSpikes = spikes;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float depth = -mvPosition.z;
            
            float animation = 1.0;
            if (animMode < 0.5) {
              float twinkle = sin(time * 3.0 + phase) * 0.5 + 0.5;
              twinkle = pow(twinkle, 2.0);
              animation = 0.6 + twinkle * 0.4;
            } else if (animMode < 1.5) {
              float pulse = sin(time * 0.8 + phase) * 0.5 + 0.5;
              pulse = smoothstep(0.0, 1.0, pulse);
              animation = 0.7 + pulse * 0.3;
            } else {
              animation = 0.85 + sin(time * 0.2 + phase) * 0.05;
            }
            
            vIntensity = animation;
            
            float perspectiveSize = size * (1200.0 / depth);
            perspectiveSize = min(perspectiveSize, size * 3.0);
            gl_PointSize = perspectiveSize * vIntensity;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vPhase;
          varying float vSpikes;
          varying float vIntensity;
          
          float starShape(vec2 uv, float spikes) {
            float angle = atan(uv.y, uv.x);
            float radius = length(uv);
            
            float spike = abs(cos(angle * spikes * 0.5));
            spike = pow(spike, 2.0);
            
            float core = exp(-radius * 15.0);
            float rays = exp(-radius * 6.0) * spike;
            float crossSpike = max(
              exp(-abs(uv.x) * 25.0) * exp(-abs(uv.y) * 4.0),
              exp(-abs(uv.y) * 25.0) * exp(-abs(uv.x) * 4.0)
            );
            float glow = exp(-radius * 3.5) * 0.4;
            
            return core + rays * 0.8 + crossSpike * 0.5 + glow;
          }
          
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float star = starShape(center, vSpikes);
            
            if (star < 0.01) discard;
            
            vec3 finalColor = vColor * star * vIntensity;
            float coreBrightness = exp(-length(center) * 18.0);
            finalColor += vec3(1.0, 0.98, 0.95) * coreBrightness * 0.6;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending
      });
      
      const starField = new THREE.Points(geometry, material);
      starField.renderOrder = 2; // Render after planet
      scene.add(starField);
      
      return { starField, material, speeds: speeds };
    }

    // ==================== WAVY BACKGROUND ====================
    function createWavyBackground() {
      const geometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 pos = position;
            float wave1 = sin(pos.x * 0.001 + time * 0.1) * 50.0;
            float wave2 = sin(pos.y * 0.001 + time * 0.15) * 50.0;
            pos.z += wave1 + wave2;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          
          void main() {
            vec3 color = vec3(0.0, 0.0, 0.0);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.DoubleSide,
        wireframe: false
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -2000;
      mesh.renderOrder = 0;
      scene.add(mesh);
      
      return { mesh, material };
    }

    // ==================== FULLSCREEN NEBULA SHADER ====================
    function createFullscreenNebula() {
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          cycleTime: { value: 0 },
          sparkle: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec2 resolution;
          uniform float cycleTime;
          uniform float sparkle;
          varying vec2 vUv;
          
          vec3 hash3(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * vec3(443.8975, 397.2973, 491.1871));
            p3 += dot(p3, p3.yxz + 19.19);
            return fract((p3.xxy + p3.yzz) * p3.zyx);
          }
          
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            vec2 u = f * f * (3.0 - 2.0 * f);
            float a = hash3(i).x;
            float b = hash3(i + vec2(1.0, 0.0)).x;
            float c = hash3(i + vec2(0.0, 1.0)).x;
            float d = hash3(i + vec2(1.0, 1.0)).x;
            
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
          }
          
          float fbm(vec2 p, float time) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            
            for (int i = 0; i < 6; i++) {
              value += amplitude * noise(p * frequency + time * 0.05);
              frequency *= 2.0;
              amplitude *= 0.5;
            }
            return value;
          }
          
          void main() {
            vec2 uv = vUv;
            vec2 center = uv - 0.5;
            float dist = length(center);
            
            // Animated nebula clouds
            float cloudTime = cycleTime * 0.03;
            float clouds1 = fbm(uv * 3.0 + vec2(cloudTime, cloudTime * 0.5), time);
            float clouds2 = fbm(uv * 2.0 - vec2(cloudTime * 0.7, cloudTime), time);
            float combined = clouds1 * 0.6 + clouds2 * 0.4;
            
            // Color cycling through purple-blue-teal spectrum
            float colorCycle = sin(cycleTime * 0.1) * 0.5 + 0.5;
            
            vec3 color1 = vec3(0.1, 0.05, 0.15);  // Deep purple
            vec3 color2 = vec3(0.05, 0.1, 0.2);   // Deep blue
            vec3 color3 = vec3(0.05, 0.15, 0.15); // Teal
            
            vec3 baseColor;
            if (colorCycle < 0.5) {
              baseColor = mix(color1, color2, colorCycle * 2.0);
            } else {
              baseColor = mix(color2, color3, (colorCycle - 0.5) * 2.0);
            }
            
            // Apply clouds
            vec3 finalColor = baseColor * (1.0 + combined * 0.8);
            
            // Smooth vignette that fades to pure black at edges
            float vignette = smoothstep(1.2, 0.0, dist);
            finalColor *= vignette;
            
            // Overall opacity fade - make the whole overlay more subtle
            float opacity = vignette * 0.6;
            
            // Sparkle effect from scroll
            if (sparkle > 0.01) {
              float sparkleNoise = hash3(uv * 100.0 + time).x;
              if (sparkleNoise > 0.98) {
                finalColor += vec3(0.3, 0.4, 0.5) * sparkle;
              }
            }
            
            gl_FragColor = vec4(finalColor, opacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.renderOrder = -1;
      
      const nebulaScene = new THREE.Scene();
      nebulaScene.add(mesh);
      
      const nebulaCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      return { mesh, material, scene: nebulaScene, camera: nebulaCamera };
    }

    // ==================== OPTIMIZED COLORFUL NEBULA CLOUDS ====================
    function createNebulaClouds() {
      const nebulae = [];
      const colorKeys = Object.keys(nebulaColors);
      
      // Reduced count for performance
      for (let i = 0; i < 6; i++) {
        const size = 400 + Math.random() * 600;
        // Reduced segments for optimization
        const geometry = new THREE.PlaneGeometry(size, size, 16, 16);
        
        const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        const baseColor = nebulaColors[colorKey];
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            baseColor: { value: baseColor }
          },
          vertexShader: `
            uniform float time;
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              vec3 pos = position;
              
              // Simple wave for efficiency
              float wave = sin(pos.x * 0.01 + time * 0.5) * 15.0;
              pos.z += wave;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 baseColor;
            varying vec2 vUv;
            
            float noise(vec2 p) {
              return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main() {
              vec2 center = vUv - 0.5;
              float dist = length(center);
              
              // Efficient noise
              float n = noise(vUv * 8.0 + time * 0.08);
              
              // Radial gradient for cloud
              float alpha = smoothstep(0.5, 0.0, dist) * 0.25;
              alpha *= n;
              
              // Brighter, more vibrant color
              vec3 color = baseColor * (1.3 + n * 0.4);
              
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const angle = (i / 6) * Math.PI * 2;
        const radius = 500 + Math.random() * 800;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = Math.sin(angle) * radius;
        mesh.position.z = -1000 - Math.random() * 2000;
        
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.renderOrder = 0;
        
        scene.add(mesh);
        nebulae.push({ mesh, material });
      }
      
      return nebulae;
    }

    // ==================== SHOOTING STARS TOWARDS USER ====================
    const colorKeys = Object.keys(nebulaColors);
    class ShootingStarTowardsUser {
      constructor(scene, camera, nebulaColors) {
        this.scene = scene;
        this.camera = camera;
        this.active = false;
        this.position = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 20;
        this.life = 1.0;
        this.trailLength = 50;
        
        // Create trail
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.trailLength * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        this.baseColor = nebulaColors[colorKey].clone();
        
        const trailMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: this.baseColor },
            opacity: { value: 1.0 }
          },
          vertexShader: `
            varying float vAlpha;
            void main() {
              vAlpha = 1.0 - (float(gl_VertexID) / 50.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying float vAlpha;
            void main() {
              gl_FragColor = vec4(color, vAlpha * opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        
        this.trail = new THREE.Line(trailGeometry, trailMaterial);
        this.trail.visible = false;
        scene.add(this.trail);
        
        // Create optimized head with fewer segments
        const headGeometry = new THREE.SphereGeometry(2, 6, 6);
        const headMaterial = new THREE.MeshBasicMaterial({
          color: this.baseColor,
          transparent: true,
          opacity: 1.0
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.visible = false;
        scene.add(this.head);
        
        this.trailPositions = [];
      }
      
      trigger() {
        this.active = true;
        this.life = 1.0;
        this.trailPositions = [];
        this.trail.visible = true;
        this.head.visible = true;
        
        // Start from a random position in a sphere around the planet
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI * 0.5;
        const distanceFromCenter = 800 + Math.random() * 400;
        const zOffset = -1000 - Math.random() * 500;
        
        this.position = new THREE.Vector3(
          Math.cos(angle) * distanceFromCenter,
          Math.sin(angle) * distanceFromCenter,
          zOffset
        );
        
        // Direction towards camera with some randomness
        const targetX = (Math.random() - 0.5) * 300;
        const targetY = (Math.random() - 0.5) * 300;
        const targetZ = this.camera.position.z + (Math.random() - 0.5) * 200;
        
        this.direction = new THREE.Vector3(targetX, targetY, targetZ)
          .sub(this.position)
          .normalize();
        
        this.speed = 18 + Math.random() * 14;
        
        // Randomize color from nebula palette
        const newColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        this.baseColor = nebulaColors[newColorKey].clone();
        this.trail.material.uniforms.color.value = this.baseColor;
        this.head.material.color = this.baseColor;
      }
      
      update(delta) {
        if (!this.active) return;
        
        // Move towards camera
        this.position.add(this.direction.clone().multiplyScalar(this.speed * delta * 60));
        
        // Update head position
        this.head.position.copy(this.position);
        
        // Add current position to trail
        this.trailPositions.unshift(this.position.clone());
        if (this.trailPositions.length > this.trailLength) {
          this.trailPositions.pop();
        }
        
        // Update trail geometry
        const positions = this.trail.geometry.attributes.position.array;
        for (let i = 0; i < this.trailPositions.length; i++) {
          const pos = this.trailPositions[i];
          positions[i * 3] = pos.x;
          positions[i * 3 + 1] = pos.y;
          positions[i * 3 + 2] = pos.z;
        }
        
        // Fill remaining positions with last known position
        for (let i = this.trailPositions.length; i < this.trailLength; i++) {
          const lastPos = this.trailPositions[this.trailPositions.length - 1] || this.position;
          positions[i * 3] = lastPos.x;
          positions[i * 3 + 1] = lastPos.y;
          positions[i * 3 + 2] = lastPos.z;
        }
        
        this.trail.geometry.attributes.position.needsUpdate = true;
        
        // Fade out gradually
        this.life -= delta * 0.3;
        this.trail.material.uniforms.opacity.value = Math.max(0, this.life);
        this.head.material.opacity = Math.max(0, this.life);
        
        // Deactivate if too close to camera or life expired
        const distToCamera = this.position.distanceTo(this.camera.position);
        if (distToCamera < 150 || this.life <= 0 || this.position.z > 300) {
          this.active = false;
          this.trail.visible = false;
          this.head.visible = false;
        }
      }
      
      dispose() {
        this.scene.remove(this.trail);
        this.scene.remove(this.head);
        this.trail.geometry.dispose();
        this.trail.material.dispose();
        this.head.geometry.dispose();
        this.head.material.dispose();
      }
    }

    // ==================== CREATE OPTIMIZED SCENE ====================
    const { starField, material: starMaterial, speeds } = createPointyStars();
    const wavyBackground = createWavyBackground();
    const nebulae = createNebulaClouds();
    const saturn = createSaturn();
    // Reduced shooting stars for CPU optimization
    const shootingStars = Array.from({ length: 30 }, () => new ShootingStarTowardsUser(scene, camera, nebulaColors));

    // ==================== ANIMATION LOOP ====================
    let time = 0;
    let shootingStarTimer = 0;
    const clock = new THREE.Clock();

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      time += delta;
      
      starMaterial.uniforms.time.value = time;
      wavyBackground.material.uniforms.time.value = time;
      
      // Removed fullscreen nebula
      
      // Animate Saturn
      saturn.saturnGroup.rotation.y += delta * 0.15;
      saturn.planetMaterial.uniforms.time.value = time;
      saturn.ringMaterial.uniforms.time.value = time;
      saturn.ringMaterialFront.uniforms.time.value = time;
      
      scrollSparkle *= 0.92;
      if (scrollSparkle < 0.01) scrollSparkle = 0;
      
      const positions = starField.geometry.attributes.position.array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 2] += speeds[i] * delta * speed;
        
        if (positions[i * 3 + 2] > 200) {
          let radius;
          if (Math.random() < 0.9) {
            radius = 800 + Math.random() * 1800;
          } else {
            radius = Math.random() * 600;
          }
          
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = -3000 - Math.random() * 500;
        }
      }
      starField.geometry.attributes.position.needsUpdate = true;
      
      nebulae.forEach((nebula, i) => {
        nebula.material.uniforms.time.value = time;
        nebula.mesh.rotation.z += delta * 0.01;
        
        nebula.mesh.position.z += delta * speed * 20;
        
        if (nebula.mesh.position.z > 500) {
          nebula.mesh.position.z = -3000;
        }
      });
      
      shootingStarTimer += delta;
      if (shootingStarTimer > 0.8 && Math.random() < 0.08) {
        const inactive = shootingStars.find(s => !s.active);
        if (inactive) {
          inactive.trigger();
          shootingStarTimer = 0;
        }
      }
      shootingStars.forEach(star => star.update(delta));
      
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: '#000'
      }}
    />
  );
};

export default SaturnNebula;
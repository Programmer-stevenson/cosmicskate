import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NebulaBackground = () => {
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
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

    // ==================== NEBULA COLOR PALETTE ====================
    const nebulaColors = {
      deepPurple: new THREE.Color(0x1a0a2e),      // Very dark purple
      darkViolet: new THREE.Color(0x2d1b4e),      // Dark violet
      richPurple: new THREE.Color(0x3d2c5e),      // Rich purple
      deepBlue: new THREE.Color(0x1a3d5a),        // Deep blue
      tealBlue: new THREE.Color(0x1a4d5a),        // Teal blue
      darkTeal: new THREE.Color(0x0f3d4a),        // Dark teal
      blueGreen: new THREE.Color(0x0d4d4a),       // Blue-green
      darkCyan: new THREE.Color(0x0a3d3d),        // Dark cyan
    };

    // ==================== POINTY STAR SYSTEM ====================
    function createPointyStars() {
      const starCount = 12000;
      const geometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      const speeds = new Float32Array(starCount);
      const phases = new Float32Array(starCount);
      const spikes = new Float32Array(starCount);
      const animModes = new Float32Array(starCount);
      
      const starColors = [
        new THREE.Color(0.61, 0.77, 1.0),
        new THREE.Color(0.85, 0.91, 1.0),
        new THREE.Color(1.0, 0.98, 0.86),
        new THREE.Color(1.0, 0.91, 0.72),
        new THREE.Color(1.0, 0.76, 0.53),
      ];
      
      for (let i = 0; i < starCount; i++) {
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
        positions[i * 3 + 2] = -Math.random() * 3000 - 500;
        
        const colorIndex = Math.floor(Math.pow(Math.random(), 2) * starColors.length);
        const starColor = starColors[colorIndex];
        colors[i * 3] = starColor.r;
        colors[i * 3 + 1] = starColor.g;
        colors[i * 3 + 2] = starColor.b;
        
        const magnitude = Math.random();
        sizes[i] = Math.pow(magnitude, 0.5) * 3 + 0.8;
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
      const geometry = new THREE.PlaneGeometry(15000, 15000, 128, 128);
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: nebulaColors.deepPurple },
          color2: { value: nebulaColors.darkViolet },
          color3: { value: nebulaColors.deepBlue }
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float wave1 = sin(pos.x * 0.001 + time * 0.3) * cos(pos.y * 0.001 + time * 0.2) * 80.0;
            float wave2 = sin(pos.x * 0.002 - time * 0.15) * sin(pos.y * 0.002 + time * 0.25) * 60.0;
            float wave3 = cos(pos.x * 0.0015 + time * 0.1) * cos(pos.y * 0.0015 - time * 0.2) * 40.0;
            
            pos.z = wave1 + wave2 + wave3;
            vElevation = pos.z;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = (vElevation + 150.0) / 300.0;
            vec3 color = mix(color1, color2, mixFactor);
            color = mix(color, color3, sin(vUv.x * 3.0 + time * 0.2) * 0.5 + 0.5);
            
            gl_FragColor = vec4(color * 0.6, 1.0);
          }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: true,
        depthWrite: false
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -4000;
      mesh.renderOrder = -1; // Render behind everything
      scene.add(mesh);
      
      return mesh;
    }

    // ==================== FULLSCREEN NEBULA OVERLAY ====================
    function createFullscreenNebula() {
      const geometry = new THREE.PlaneGeometry(2, 2);
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          cycleTime: { value: 0 },
          sparkle: { value: 0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          color1: { value: nebulaColors.richPurple },
          color2: { value: nebulaColors.tealBlue },
          color3: { value: nebulaColors.darkTeal },
          color4: { value: nebulaColors.blueGreen }
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
          uniform float cycleTime;
          uniform float sparkle;
          uniform vec2 resolution;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 color4;
          varying vec2 vUv;
          
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
            float frequency = 1.0;
            
            for(int i = 0; i < 6; i++) {
              value += amplitude * noise(p * frequency);
              frequency *= 2.0;
              amplitude *= 0.5;
            }
            
            return value;
          }
          
          void main() {
            vec2 uv = vUv;
            vec2 p = uv * 3.0;
            
            float cycle = sin(cycleTime * 0.08) * 0.5 + 0.5;
            
            float n1 = fbm(p + time * 0.05 + vec2(cycle * 2.0, 0.0));
            float n2 = fbm(p * 1.5 - time * 0.03 + vec2(0.0, cycle * 1.5));
            float n3 = fbm(p * 2.0 + time * 0.04 + vec2(cycle, -cycle));
            
            float mixedNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
            
            vec3 color = mix(color1, color2, n1);
            color = mix(color, color3, n2);
            color = mix(color, color4, n3);
            
            float alpha = mixedNoise * 0.35;
            alpha += sparkle * 0.15;
            
            float vignette = 1.0 - length(uv - 0.5) * 0.8;
            alpha *= vignette;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.renderOrder = -1;
      scene.add(mesh);
      
      return mesh;
    }

    // ==================== NEBULA CLOUDS ====================
    function createNebulaClouds() {
      const nebulae = [];
      const colorKeys = Object.keys(nebulaColors);
      
      for (let i = 0; i < 8; i++) {
        const size = 800 + Math.random() * 1200;
        const geometry = new THREE.PlaneGeometry(size, size, 64, 64);
        
        const colorIndex = Math.floor(Math.random() * colorKeys.length);
        const baseColor = nebulaColors[colorKeys[colorIndex]];
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: baseColor },
            offset: { value: Math.random() * 100 }
          },
          vertexShader: `
            uniform float time;
            uniform float offset;
            varying vec2 vUv;
            varying float vDisplacement;
            
            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
            
            void main() {
              vUv = uv;
              vec3 pos = position;
              
              float n = noise(uv * 2.0 + time * 0.1 + offset);
              pos.z += n * 100.0;
              vDisplacement = n;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec2 vUv;
            varying float vDisplacement;
            
            void main() {
              vec2 center = vUv - 0.5;
              float dist = length(center);
              
              float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * 0.4;
              alpha *= vDisplacement;
              
              vec3 finalColor = color * (1.0 + vDisplacement * 0.5);
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 1500 + Math.random() * 1000;
        mesh.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 800,
          -1000 - Math.random() * 2000
        );
        
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.renderOrder = 0; // Render before stars but respect depth
        
        scene.add(mesh);
        nebulae.push({ mesh, material });
      }
      
      return nebulae;
    }

    // ==================== CAMERA SETUP (STATIC) ====================
    // Camera stays at starting position (0, 0, 100)

    // ==================== SHOOTING STARS TOWARDS USER ====================
    const colorKeys = Object.keys(nebulaColors);

    class ShootingStarTowardsUser {
      constructor(scene, camera, nebulaColors) {
        this.scene = scene;
        this.camera = camera;
        this.active = false;
        this.life = 1.0;
        this.trailLength = 40;
        this.trailPositions = [];
        
        // Create trail
        const trailGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.trailLength * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const trailMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0x1a4d5a) },
            opacity: { value: 1.0 }
          },
          vertexShader: `
            varying float vAlpha;
            void main() {
              vAlpha = 1.0 - (float(gl_VertexID) / 40.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = 4.0 * vAlpha;
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform float opacity;
            varying float vAlpha;
            void main() {
              float dist = length(gl_PointCoord - 0.5);
              if (dist > 0.5) discard;
              gl_FragColor = vec4(color, vAlpha * opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: true
        });
        
        this.trail = new THREE.Points(trailGeometry, trailMaterial);
        this.trail.renderOrder = 2; // Render after planet
        this.trail.visible = false;
        this.scene.add(this.trail);
        
        // Create head
        const headGeometry = new THREE.SphereGeometry(3, 8, 8);
        const headMaterial = new THREE.MeshBasicMaterial({
          color: 0x1a4d5a,
          transparent: true,
          opacity: 1.0,
          depthTest: true
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.renderOrder = 2; // Render after planet
        this.head.visible = false;
        this.scene.add(this.head);
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

    // ==================== CREATE SCENE ====================
    const { starField, material: starMaterial, speeds } = createPointyStars();
    const wavyBackground = createWavyBackground();
    const fullscreenNebula = createFullscreenNebula();
    const nebulae = createNebulaClouds();
    // Planet removed for background version
    const shootingStars = Array.from({ length: 20 }, () => new ShootingStarTowardsUser(scene, camera, nebulaColors));

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
      
      fullscreenNebula.material.uniforms.time.value = time;
      fullscreenNebula.material.uniforms.cycleTime.value = time;
      fullscreenNebula.material.uniforms.sparkle.value = scrollSparkle;
      
      // Planet removed for background version
      
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
      if (shootingStarTimer > 1.5 && Math.random() < 0.03) {
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

export default NebulaBackground;
import * as THREE from 'three';

export interface DistortionFilterOptions {
    intensity?: number;
    animationSpeed?: number;
    heatIntensity?: number;
    glitchIntensity?: number;
    glitchFrequency?: number;
}

export class DistortionFilter {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private renderTarget: THREE.WebGLRenderTarget;
    private time: number = 0;

    // Filter parameters
    public intensity: number = 0.5;
    public animationSpeed: number = 1.0;
    public heatIntensity: number = 0.5;
    public glitchIntensity: number = 0.3;
    public glitchFrequency: number = 0.1;

    constructor(renderer: THREE.WebGLRenderer, options: DistortionFilterOptions = {}) {
        // Apply options
        this.intensity = options.intensity ?? 0.5;
        this.animationSpeed = options.animationSpeed ?? 1.0;
        this.heatIntensity = options.heatIntensity ?? 0.5;
        this.glitchIntensity = options.glitchIntensity ?? 0.3;
        this.glitchFrequency = options.glitchFrequency ?? 0.1;

        // Create render target
        this.renderTarget = new THREE.WebGLRenderTarget(
            renderer.domElement.width,
            renderer.domElement.height,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );

        // Create post-processing scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Create shader material with combined heat haze and glitch effects
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                time: { value: 0 },
                intensity: { value: this.intensity },
                heatIntensity: { value: this.heatIntensity },
                glitchIntensity: { value: this.glitchIntensity },
                glitchFrequency: { value: this.glitchFrequency },
                resolution: { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float intensity;
        uniform float heatIntensity;
        uniform float glitchIntensity;
        uniform float glitchFrequency;
        uniform vec2 resolution;
        varying vec2 vUv;

        // Noise function for procedural effects
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Smooth noise for heat haze
        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        // Fractal noise for more complex heat distortion
        float fractalNoise(vec2 p) {
          float value = 0.0;
          float amplitude = 1.0;
          float frequency = 1.0;
          
          for(int i = 0; i < 4; i++) {
            value += smoothNoise(p * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }

        // Combined heat haze and glitch distortion
        vec2 DistortionDistort(vec2 uv) {
          vec2 distortedUV = uv;
          
          // Heat haze effect - organic, flowing distortion
          float timeOffset = time * 0.5;
          vec2 heatOffset1 = vec2(
            fractalNoise(uv * 8.0 + timeOffset) - 0.5,
            fractalNoise(uv * 6.0 + timeOffset * 1.3) - 0.5
          );
          vec2 heatOffset2 = vec2(
            fractalNoise(uv * 12.0 - timeOffset * 0.8) - 0.5,
            fractalNoise(uv * 10.0 + timeOffset * 1.1) - 0.5
          );
          
          vec2 heatDistortion = (heatOffset1 + heatOffset2 * 0.5) * heatIntensity * intensity * 0.02;
          distortedUV += heatDistortion;
          
          // Glitch effect - sharp, digital distortions
          float glitchTime = time * 8.0;
          float glitchLine = floor(uv.y * 200.0) / 200.0;
          
          // Random glitch triggers
          float glitchTrigger = step(1.0 - glitchFrequency, noise(vec2(glitchLine, floor(glitchTime))));
          
          // Horizontal displacement glitch
          float horizontalGlitch = (noise(vec2(glitchLine * 50.0, floor(glitchTime * 2.0))) - 0.5) * 
                                   glitchTrigger * glitchIntensity * intensity * 0.1;
          
          // Vertical glitch blocks
          float blockGlitch = step(0.95, noise(vec2(floor(uv.y * 20.0), floor(glitchTime * 3.0)))) *
                              (noise(vec2(floor(glitchTime * 5.0))) - 0.5) * 
                              glitchIntensity * intensity * 0.05;
          
          // RGB shift for glitch
          float rgbShift = glitchTrigger * glitchIntensity * intensity * 0.01;
          
          distortedUV.x += horizontalGlitch + blockGlitch;
          
          return distortedUV;
        }

        void main() {
          vec2 distortedUV = DistortionDistort(vUv);
          
          // Sample the texture with bounds checking
          vec4 color;
          if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || 
              distortedUV.y < 0.0 || distortedUV.y > 1.0) {
            color = vec4(0.0, 0.0, 0.0, 1.0);
          } else {
            color = texture2D(tDiffuse, distortedUV);
            
            // Add RGB shift for glitch effect
            float glitchTime = time * 8.0;
            float rgbShift = step(0.98, noise(vec2(floor(vUv.y * 100.0), floor(glitchTime)))) * 
                             glitchIntensity * intensity * 0.005;
            
            if (rgbShift > 0.0) {
              vec4 redShift = texture2D(tDiffuse, distortedUV - vec2(rgbShift, 0.0));
              vec4 blueShift = texture2D(tDiffuse, distortedUV + vec2(rgbShift, 0.0));
              color.r = redShift.r;
              color.b = blueShift.b;
            }
          }
          
          gl_FragColor = color;
        }
      `
        });

        // Create full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    /**
     * Apply the heat glitch filter to the rendered scene
     * @param renderer - Three.js WebGL renderer
     * @param inputScene - Scene to render and apply filter to
     * @param inputCamera - Camera to use for rendering the scene
     */
    public render(renderer: THREE.WebGLRenderer, inputScene: THREE.Scene, inputCamera: THREE.Camera): void {
        // Update time
        this.time += 0.016 * this.animationSpeed;
        this.material.uniforms.time.value = this.time;

        // Update uniforms
        this.material.uniforms.intensity.value = this.intensity;
        this.material.uniforms.heatIntensity.value = this.heatIntensity;
        this.material.uniforms.glitchIntensity.value = this.glitchIntensity;
        this.material.uniforms.glitchFrequency.value = this.glitchFrequency;

        // Render input scene to render target
        renderer.setRenderTarget(this.renderTarget);
        renderer.render(inputScene, inputCamera);

        // Apply filter
        this.material.uniforms.tDiffuse.value = this.renderTarget.texture;
        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera);
    }

    /**
     * Update filter parameters
     */
    public setParameters(options: Partial<DistortionFilterOptions>): void {
        if (options.intensity !== undefined) this.intensity = options.intensity;
        if (options.animationSpeed !== undefined) this.animationSpeed = options.animationSpeed;
        if (options.heatIntensity !== undefined) this.heatIntensity = options.heatIntensity;
        if (options.glitchIntensity !== undefined) this.glitchIntensity = options.glitchIntensity;
        if (options.glitchFrequency !== undefined) this.glitchFrequency = options.glitchFrequency;
    }

    /**
     * Resize the filter when window/canvas size changes
     */
    public setSize(width: number, height: number): void {
        this.renderTarget.setSize(width, height);
        this.material.uniforms.resolution.value.set(width, height);
    }

    /**
     * Dispose of resources
     */
    public dispose(): void {
        this.renderTarget.dispose();
        this.material.dispose();
        this.mesh.geometry.dispose();
    }

    /**
     * Get the current time value (useful for synchronizing with other effects)
     */
    public getTime(): number {
        return this.time;
    }

    /**
     * Set the time value (useful for synchronizing with other effects)
     */
    public setTime(time: number): void {
        this.time = time;
    }
}

export default DistortionFilter;
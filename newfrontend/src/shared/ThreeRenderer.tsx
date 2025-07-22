import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import DistortionFilter from './DistortionFilter';

class ThreeRenderer {
    private renderer: THREE.WebGLRenderer;
    private distortionFilter: DistortionFilter;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    // private controls: OrbitControls;
    private container: HTMLDivElement;
    private lod: THREE.LOD;

    // Mouse interactivity properties
    private baseCameraPosition = { x: 0.66, y: 0.7, z: 1.75 };
    private mouse = { x: 0, y: 0 };
    private targetCameraOffset = { x: 0, y: 0, z: 0 };
    private currentCameraOffset = { x: 0, y: 0, z: 0 };
    private targetCameraPosition = { x: 0.66, y: 0.7, z: 1.75 }; // Target position for camera
    private mouseMoveBound: (event: MouseEvent) => void;

    constructor(container: HTMLDivElement) {
        this.container = container;
        console.log("🏗️ ThreeRenderer constructor called");
        console.log("📦 Container children before:", container.children.length);
        //Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.setClearColor(0x222222); // Dark gray background to see if walls are there

        this.loadHDRIModels();
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0.66, 0.7, 1.75);
        this.camera.lookAt(0, 0, 0);
        //Controls
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enableDamping = true; // Enable smooth damping
        // this.controls.dampingFactor = 0.005; // Damping factor
        // this.controls.screenSpacePanning = true; // Disable panning
        // this.controls.minDistance = 2; // Minimum zoom distance
        // this.controls.maxDistance = 2; // Maximum zoom distance
        // this.controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation to ceiling
        // this.controls.minPolarAngle = Math.PI / 4; // Limit vertical rotation to floor
        // this.controls.target.set(0, 0, 0); // Set target to the car position
        this.lod = new THREE.LOD();
        this.enableLOD();

        // Bind mouse move handler
        this.mouseMoveBound = this.onMouseMove.bind(this);

        this.distortionFilter = new DistortionFilter(this.renderer, {
            intensity: 0.0,
            animationSpeed: 1.2,
            heatIntensity: 0.2,
            glitchIntensity: 0.2,
            glitchFrequency: 0.05
        });

        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('resize', this.adjustLODForScreenSize.bind(this));
        window.addEventListener('mousemove', this.mouseMoveBound);

    }

    public render(): Promise<void> {
        return new Promise((resolve) => {
            this.loadEnvironment();


            if (!this.container.contains(this.renderer.domElement)) {
                this.container.appendChild(this.renderer.domElement);
            }

            this.startAnimationLoop();

            // Resolve the promise when rendering is complete
            resolve();
        });
    }

    public dispose(container: HTMLDivElement | null) {
        this.renderer.setAnimationLoop(null);
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('resize', this.adjustLODForScreenSize.bind(this));
        window.removeEventListener('mousemove', this.mouseMoveBound);

        if (container && container.contains(this.renderer.domElement)) {
            container.removeChild(this.renderer.domElement);
        }

        if (this.distortionFilter) {
            this.distortionFilter.dispose();
        }
    }

    public setTargetCameraPosition(position: { x: number, y: number, z: number }) {
        this.targetCameraPosition = position;
        console.log("Setting target camera position to:", position);
    }


    private handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.distortionFilter.setSize(window.innerWidth, window.innerHeight);
    }

    private startAnimationLoop() {
        const animate = () => {

            // Smooth interpolation for camera offset
            const lerpFactor = 0.08; // Adjust for smoothness (0.01-0.1 range)
            this.currentCameraOffset.x += (this.targetCameraOffset.x - this.currentCameraOffset.x) * lerpFactor;
            this.currentCameraOffset.y += (this.targetCameraOffset.y - this.currentCameraOffset.y) * lerpFactor;
            this.currentCameraOffset.z += (this.targetCameraOffset.z - this.currentCameraOffset.z) * lerpFactor;

            // Apply offset to camera position
            this.camera.position.x = this.baseCameraPosition.x + this.currentCameraOffset.x;
            this.camera.position.y = this.baseCameraPosition.y + this.currentCameraOffset.y;
            this.camera.position.z = this.baseCameraPosition.z + this.currentCameraOffset.z;

            // Keep looking at the model
            this.camera.lookAt(0, 0, 0);

            this.renderer.render(this.scene, this.camera);
            this.distortionFilter.render(this.renderer, this.scene, this.camera);

            // Smoothly interpolate baseCameraPosition towards the target position set by setPage
            const cameraLerpFactor = 0.02; // Adjust for smoothness (higher = faster)
            this.baseCameraPosition.x += (this.targetCameraPosition.x - this.baseCameraPosition.x) * cameraLerpFactor;
            this.baseCameraPosition.y += (this.targetCameraPosition.y - this.baseCameraPosition.y) * cameraLerpFactor;
            this.baseCameraPosition.z += (this.targetCameraPosition.z - this.baseCameraPosition.z) * cameraLerpFactor;

            // this.controls.update();
            // console.log("x: " + this.controls.object.position.x);
            // console.log("y: " + this.controls.object.position.y);
            // console.log("z: " + this.controls.object.position.z);
            // console.log(this.renderer.info)
        };
        this.renderer.setAnimationLoop(animate);
    }


    private loadEnvironment() {
        // Configuration for the rectangular area light
        const width = 2;      // Width of the rectangular area
        const height = 4;     // Height of the rectangular area
        const lightHeight = 2; // Height above ground
        const gridResolution = 3; // Number of lights per axis (4x4 = 16 total lights)

        // Light properties
        const totalIntensity = 36; // Total desired intensity (will be divided among lights)
        const individualIntensity = totalIntensity / (gridResolution * gridResolution);
        const spotAngle = Math.PI / 3; // Narrow cone angle for better blending
        const penumbra = 0.8; // High penumbra for soft blending
        const distance = 6;

        // Create grid of spotlights
        for (let x = 0; x < gridResolution; x++) {
            for (let z = 0; z < gridResolution; z++) {
                // Calculate position within the rectangular area
                const xPos = (x / (gridResolution - 1) - 0.5) * width;
                const zPos = (z / (gridResolution - 1) - 0.5) * height;

                // Create spotlight
                const spotLight = new THREE.SpotLight(
                    0xffffff,           // color
                    individualIntensity, // intensity
                    distance,           // distance
                    spotAngle,          // angle
                    penumbra           // penumbra
                );

                // Position the light in the rectangle
                spotLight.position.set(xPos, lightHeight, zPos);

                // Create target - aim slightly inward for better coverage
                const target = new THREE.Object3D();
                const targetOffset = 0.1; // Small offset toward center
                target.position.set(
                    xPos * (1 - targetOffset),
                    0,
                    zPos * (1 - targetOffset)
                );
                this.scene.add(target);
                spotLight.target = target;

                // Enable shadows (optional - may impact performance with many lights)
                spotLight.castShadow = true;
                spotLight.shadow.mapSize.width = 256; // Smaller shadow maps for performance
                spotLight.shadow.mapSize.height = 256;
                spotLight.shadow.camera.near = 0.1;
                spotLight.shadow.camera.far = distance;
                spotLight.shadow.camera.fov = (spotAngle * 180) / Math.PI;

                // Add to scene
                this.scene.add(spotLight);
            }
        }
    }

    private loadHDRIModels() {
        const rgbeLoader = new RGBELoader();
        const gltfLoader = new GLTFLoader();

        // Preload HDR texture
        rgbeLoader.loadAsync('/assets/lmap.hdr').then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = texture;
        });

        // Preload GLTF car model
        gltfLoader.loadAsync('/assets/gtr.glb').then((gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 0);
            root.scale.set(50, 50, 50);
            this.scene.add(root);
        });

        // Preload GLTF scene model
        gltfLoader.loadAsync('/assets/scene.glb').then((gltf) => {
            const root = gltf.scene;
            root.position.set(0, 0, 0);
            root.scale.set(1, 1, 1);
            root.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name.includes("Plane")) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: 0xfafafa,
                            emissive: 0x000000,
                            opacity: child.material.opacity,
                            envMap: null,
                            roughness: 0.05,
                            metalness: 0.1,
                            side: THREE.DoubleSide,
                            envMapIntensity: 0
                        });
                        child.material = newMaterial;
                        child.material.needsUpdate = true;
                        console.log(child.material);
                    }
                    if (child.name.includes("Wall")) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: 0xfafafa,
                            map: child.material.map,
                            opacity: child.material.opacity,
                            transparent: child.material.transparent,
                            envMap: null,
                            roughness: 0.5,
                            side: THREE.DoubleSide
                        });
                        child.material = newMaterial;
                        child.material.needsUpdate = true;
                    }
                }
            });
            this.scene.add(root);
        });

    }

    //TODO: Implement LOD (Level of Detail) for performance optimization

    private enableLOD() {

        // High-detail geometry for larger screens
        const highDetailGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
        const highDetailMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterial);
        this.lod.addLevel(highDetailMesh, 0); // Use this level for larger screens

        // Low-detail geometry for smaller screens
        const lowDetailGeometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
        const lowDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
        this.lod.addLevel(lowDetailMesh, 1); // Use this level for smaller screens

        // Add LOD to the scene
        // this.scene.add(this.lod);
    }

    private adjustLODForScreenSize = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth > 1024) {
            this.lod.levels[0].object.visible = true; // High detail
            this.lod.levels[1].object.visible = false;
        } else {
            this.lod.levels[0].object.visible = false;
            this.lod.levels[1].object.visible = true; // Low detail
        }
    };

    private onMouseMove(event: MouseEvent): void {
        // Normalize mouse coordinates (-1 to 1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Convert 50px movement to world units
        // Assuming roughly 1000px = 1 world unit at typical camera distance
        const movementScale = 0.25; // Adjust this to get exactly 50px equivalent

        this.targetCameraOffset.x = this.mouse.x * movementScale;
        this.targetCameraOffset.y = this.mouse.y * movementScale;
        this.targetCameraOffset.z = 0; // No Z movement, or add subtle Z if desired
    }
}


export default ThreeRenderer;
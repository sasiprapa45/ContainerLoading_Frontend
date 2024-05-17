import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ContainerFormResponse, PositionCargoesFormResponse } from '../interfaces/insert-form';
import { LoadingServiceService } from '../loading-service.service'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, AfterViewInit {

  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef<HTMLDivElement>;

  receivedData: any;
  isLoading: boolean = true;
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500);
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
  controls!: OrbitControls;
  cargoes: PositionCargoesFormResponse[] = [];
  container: ContainerFormResponse[] = [];


  constructor(private route: ActivatedRoute, private loadingServiceService: LoadingServiceService) { }

  ngOnInit(): void {
    const projectId = 22; // เปลี่ยนเป็น project_id ที่คุณต้องการค้นหา
    this.loadingServiceService.getContainerByProject(projectId).subscribe(
      (data: ContainerFormResponse[]) => {
        this.container = data;
        console.log(this.container);
      },
      error => {
        console.error('Error fetching positions:', error);
      }
    );
    this.loadingServiceService.getPositionsByProject(projectId).subscribe(
      (data: PositionCargoesFormResponse[]) => {
        this.cargoes = data;
        console.log(this.cargoes);
        this.setupThreeJS();
      },
      error => {
        console.error('Error fetching positions:', error);
      }
    );


  }

  ngAfterViewInit() {


  }

  setupThreeJS(): void {
    this.scene.background = new THREE.Color(0x999999);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0.5, 1.0, 0.5).normalize();
    this.scene.add(light);

    this.camera.position.set(200, 200, 150);
    this.scene.add(this.camera);

    const grid = new THREE.GridHelper(250, 250, 0xffffff, 0x7b7b7b);
    this.scene.add(grid);

    // Add AxesHelper to display axes
    const axesHelper = new THREE.AxesHelper(50); // Size of the axes
    this.scene.add(axesHelper);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    window.addEventListener('resize', () => this.onWindowResize());

    // Plot containers and cargoes after setup
    this.plotContainersAndCargoes(this.container, this.cargoes);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.rendererContainer && this.rendererContainer.nativeElement) {
      this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;

    this.controls.addEventListener('change', () => {
      this.render();
    });

    window.addEventListener("resize", () => {
      this.onWindowResize();
    });

    this.animate();

    // Start animation loop
  }

  plotContainersAndCargoes(containers: any[], cargoes: any[]) {
    const containerSpacing = 50; // ระยะห่างระหว่าง container ในหน่วยที่เหมาะสม
    containers.forEach((container, index) => {
      // กำหนดตำแหน่งของ container แต่ละตู้
      const positionX = -100 + (index * containerSpacing);
      console.log(positionX);


      // Scale down the dimensions
      const scaledLength = container.length * 0.1;
      const scaledHeight = container.height * 0.1;
      const scaledWidth = container.width * 0.1;

      // Create container geometry and material
      const geometry = new THREE.BoxGeometry(scaledWidth, scaledHeight, scaledLength);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White color for container
        wireframe: true // Show as wireframe
      });
      const box = new THREE.Mesh(geometry, material);

      // Set container position
      box.position.set(positionX + scaledWidth / 2, 0 + scaledHeight / 2, 0 + scaledLength / 2);
      this.scene.add(box);

      // Plot cargoes in the current container
      cargoes.forEach(cargo => {
        if (cargo.container_id === container.id) {
          // Scale down the dimensions
          const scaledCargoLength = cargo.length * 0.1;
          const scaledCargoHeight = cargo.height * 0.1;
          const scaledCargoWidth = cargo.width * 0.1;

          // Adjust axes: X = width, Y = height, Z = length
          const cargoGeometry = new THREE.BoxGeometry(scaledCargoWidth, scaledCargoHeight, scaledCargoLength);
          const cargoMaterial = new THREE.MeshBasicMaterial({
            color: this.getColorByType(cargo.type_cargo_id),
            transparent: true,
            opacity: 0.5 // Set opacity to make the box look transparent
          });
          const cube = new THREE.Mesh(cargoGeometry, cargoMaterial);

          // Calculate cargo position relative to the container and scale down the position
          const cargoPositionX = (cargo.Y + cargo.width / 2) * 0.1 + positionX;
          const cargoPositionY = (cargo.Z + cargo.height / 2) * 0.1;
          const cargoPositionZ = (cargo.X + cargo.length / 2) * 0.1;
          cube.position.set(cargoPositionX, cargoPositionY, cargoPositionZ);
          this.scene.add(cube);

          // Add edges for the box
          const edges = new THREE.EdgesGeometry(cargoGeometry);
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black color for edges
          const wireframe = new THREE.LineSegments(edges, lineMaterial);
          wireframe.position.copy(cube.position);
          this.scene.add(wireframe);
        }
      });
    });
  }
  getColorByType(type: number): number {
    switch(type) {
      case 1: return 0xff0000; // Red
      case 2: return 0x00ff00; // Green
      case 3: return 0x0000ff; // Blue
      default: return 0xffffff; // White
    }
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.controls.update();
    this.render();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
// init() {
  //   const width = this.rendererContainer.nativeElement.clientWidth;
  //   const height = this.rendererContainer.nativeElement.clientHeight;

  //   // Create scene
  //   this.scene = new THREE.Scene();

  //   // Create camera
  //   this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  //   this.camera.position.Z = 5;

  //   // Create renderer
  //   this.renderer = new THREE.WebGLRenderer();
  //   this.renderer.setSize(width, height);
  //   this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

  //   // Create cube
  //   const geometry = new THREE.BoxGeometry();
  //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   const cube = new THREE.Mesh(geometry, material);
  //   this.scene.add(cube);
  // }

  // animate() {
  //   requestAnimationFrame(() => this.animate());
  //   this.renderer.render(this.scene, this.camera);
  // }

  // clickG(){
  //   this.init();
  //   this.animate();
  // }










// createThreeJsBox(): void {
  //   const canvas = document.getElementById('canvas-box');

  //   const scene = new THREE.Scene();

  //   const material = new THREE.MeshToonMaterial();

  //   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  //   scene.add(ambientLight);

  //   const pointLight = new THREE.PointLight(0xffffff, 0.5);
  //   pointLight.position.X = 2;
  //   pointLight.position.Y = 2;
  //   pointLight.position.Z = 2;
  //   scene.add(pointLight);

  //   const box = new THREE.Mesh(
  //     new THREE.BoxGeometry(1.5, 1.5, 1.5),
  //     material
  //   );

  //   const torus = new THREE.Mesh(
  //     new THREE.TorusGeometry(5, 1.5, 16, 100),
  //     material
  //   );

  //   scene.add(torus, box);

  //   const canvasSizes = {
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   };

  //   const camera = new THREE.PerspectiveCamera(
  //     75,
  //     canvasSizes.width / canvasSizes.height,
  //     0.001,
  //     1000
  //   );
  //   camera.position.Z = 30;
  //   scene.add(camera);

  //   if (!canvas) {
  //     return;
  //   }

  //   const renderer = new THREE.WebGLRenderer({
  //     canvas: canvas,
  //   });
  //   renderer.setClearColor(0xe232222, 1);
  //   renderer.setSize(canvasSizes.width, canvasSizes.height);

  //   window.addEventListener('resize', () => {
  //     canvasSizes.width = window.innerWidth;
  //     canvasSizes.height = window.innerHeight;

  //     camera.aspect = canvasSizes.width / canvasSizes.height;
  //     camera.updateProjectionMatrix();

  //     renderer.setSize(canvasSizes.width, canvasSizes.height);
  //     renderer.render(scene, camera);
  //   });

  //   const clock = new THREE.Clock();

  //   const animateGeometry = () => {
  //   const elapsedTime = clock.getElapsedTime();

  //   // Update animation objects
  //   box.rotation.X = elapsedTime;
  //   box.rotation.Y = elapsedTime;
  //   box.rotation.Z = elapsedTime;

  //   torus.rotation.X = -elapsedTime;
  //   torus.rotation.Y = -elapsedTime;
  //   torus.rotation.Z = -elapsedTime;

  //   // Render
  //   renderer.render(scene, camera);

  //   // Call animateGeometry again on the next frame
  //   window.requestAnimationFrame(animateGeometry);
  // };
  // animateGeometry();
  // }

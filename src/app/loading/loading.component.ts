import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ContainerFormResponse, PositionCargoesFormResponse, ProjectFormResponse } from '../interfaces/insert-form';
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
  visible = false;
  projectId:any;
  projectData:any;

  constructor(private route: ActivatedRoute, private loadingServiceService: LoadingServiceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
     this.projectId = params['id'];
      console.log('Project ID:',  this.projectId);
      this.loadingServiceService.getProjectByProject(this.projectId).subscribe(
        (data: ProjectFormResponse[]) => {
          this.projectData = data;
          console.log(this.projectData);
        },
        error => {
          console.error('Error fetching positions:', error);
        }
      );

      // นำ projectId ไปใช้งานต่อได้เช่นเดียวกับที่คุณต้องการ
  });
    
    // const projectId = 1; // เปลี่ยนเป็น project_id ที่คุณต้องการค้นหา

  }

  ngAfterViewInit() {
    this.loadingServiceService.getContainerByProject(this.projectId).subscribe(
      (data: ContainerFormResponse[]) => {
        this.container = data;
        console.log(this.container);
      },
      error => {
        console.error('Error fetching positions:', error);
      }
    );
    this.loadingServiceService.getPositionsByProject(this.projectId).subscribe(
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
            color: new THREE.Color(cargo.color),
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
  // getColorByType(type: number): number {
  //   switch(type) {
  //     case 1: return 0xff0000; // Red
  //     case 2: return 0x00ff00; // Green
  //     case 3: return 0x0000ff; // Blue
  //     default: return 0xffffff; // White
  //   }
  // }

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

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

}

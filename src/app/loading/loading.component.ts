import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ContainerFormResponse, PositionCargoesFormResponse, ProjectFormResponse } from '../interfaces/insert-form';
import { LoadingServiceService } from '../loading-service.service'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';



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
  projectId: any | null = null;
  projectData!: ProjectFormResponse;
  fontLoader!: FontLoader;

  constructor(private route: ActivatedRoute, private loadingServiceService: LoadingServiceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['id'] ? +params['id'] : null;
      this.loadingServiceService.getProjectByProject(this.projectId).subscribe(
        (data: ProjectFormResponse) => {
          this.projectData = data;
          console.log(this.projectData);
        },
        error => {
          console.error('Error fetching positions:', error);
        }
      );
  });
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
    this.renderer.setSize(window.innerWidth/1.2, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    window.addEventListener('resize', () => this.onWindowResize());

    // Plot containers and cargoes after setup
    this.plotContainersAndCargoes(this.container, this.cargoes);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth/1.2, window.innerHeight);

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
      this.loadFontAndCreateText(container,positionX,scaledWidth,scaledHeight,scaledLength);

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
  loadFontAndCreateText(container: any,positionX: number,scaledWidth: number,scaledHeight: number,scaledLength: number): void {
    this.fontLoader = new FontLoader();
    this.fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font: Font) => {
      const geometry_id = new TextGeometry('Container ID: '+container.id, {
        font: font,
        size: 3,
        height: 5,
        depth: 0.5,
      });
      const geometry_size = new TextGeometry('Type: '+container.type_container_name, {
        font: font,
        size: 2,
        height: 3.5,
        depth: 0.5,
      });
      const width = new TextGeometry(':'+container.width, {
        font: font,
        size: 2,
        height: 3.5,
        depth: 0.2,
      });
      const length = new TextGeometry(':'+container.length, {
        font: font,
        size: 2,
        height: 3,
        depth: 0.2,
      });
      const height = new TextGeometry(':'+container.height, {
        font: font,
        size: 2,
        height: 3.5,
        depth: 0.2,
      });


      const material_id = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
      const material_t = new THREE.MeshBasicMaterial({ color: 0x1000000 });
      const material_size = new THREE.MeshBasicMaterial({ color: 0x00FF00 });

      const textMesh = new THREE.Mesh(geometry_id, material_id);
      const textMesh1 = new THREE.Mesh(geometry_size, material_t);
      const textwidth = new THREE.Mesh(width, material_size);
      const textlength = new THREE.Mesh(length, material_size);
      const textheight = new THREE.Mesh(height, material_size);
      textMesh.position.set(positionX , 0 +scaledHeight+ 10, 0 );
      textMesh1.position.set(positionX , 0 +scaledHeight+ 6, 0 );
      textwidth.position.set(positionX +scaledWidth / 2 , 0 +scaledHeight+ 1, 0 );
      textlength.position.set(positionX , scaledHeight+ 1, 0 + scaledLength / 2 );
      textheight.position.set(positionX +scaledWidth , 0 +scaledHeight/ 2, 0 );
      this.scene.add(textMesh);
      this.scene.add(textMesh1);
      this.scene.add(textheight);
      this.scene.add(textwidth);
      this.scene.add(textlength);
    });
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
    this.renderer.setSize(window.innerWidth/1.2, window.innerHeight);
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

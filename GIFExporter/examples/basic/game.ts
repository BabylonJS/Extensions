import { GIFCreator } from '../../dist/gif.exporter.single.worker';
export class Game {
	private _canvas: HTMLCanvasElement;
	private _engine: BABYLON.Engine;
	private _scene: BABYLON.Scene;
	private _camera: BABYLON.FreeCamera;
	private _light: BABYLON.Light;
	private _gifExporter: GIFCreator;

	constructor(canvasElement: string) {
		this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this._engine = new BABYLON.Engine(this._canvas, true, {
			preserveDrawingBuffer: true,
		});
		this._gifExporter = new GIFCreator(this._engine, {
			delay: 60,
			duration: 5000,
		});
	}

	createScene(): void {
		// Create a basic BJS Scene object.
		this._scene = new BABYLON.Scene(this._engine);

		// Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
		this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this._scene);

		// Target the camera to scene origin.
		this._camera.setTarget(BABYLON.Vector3.Zero());

		// Attach the camera to the canvas.
		this._camera.attachControl(this._canvas, false);

		// Create a basic light, aiming 0,1,0 - meaning, to the sky.
		this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this._scene);

		// Create a built-in "sphere" shape; with 16 segments and diameter of 2.
		let sphere = BABYLON.MeshBuilder.CreateSphere(
			'sphere',
			{
				segments: 16,
				diameter: 2,
			},
			this._scene
		);

		// Move the sphere upward 1/2 of its height.
		sphere.position.y = 1;

		// Create a built-in "ground" shape.
		let ground = BABYLON.MeshBuilder.CreateGround(
			'ground',
			{
				width: 6,
				height: 6,
				subdivisions: 2,
			},
			this._scene
		);
	}

	doRender(): void {
		// Run the render loop.
		this._engine.runRenderLoop(() => {
			this._scene.render();
		});

		// The canvas/window resize event handler.
		window.addEventListener('resize', () => {
			this._engine.resize();
		});
	}

	downloadGIF() {
		return new Promise(async (resolve, reject) => {
			await this._gifExporter.download();
			resolve();
		});
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const recordBtn: HTMLButtonElement = document.getElementById('recordBtn') as HTMLButtonElement;
	// Setup GIF generator

	// Create the game using the 'renderCanvas'.
	let game = new Game('renderCanvas');

	// Create the scene.
	game.createScene();

	// Start render loop.
	game.doRender();

	recordBtn.addEventListener('click', async () => {
		recordBtn.disabled = true;
		await game.downloadGIF();
		recordBtn.disabled = false;
	});
});

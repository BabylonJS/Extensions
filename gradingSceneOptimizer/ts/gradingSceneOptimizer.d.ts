declare module BABYLON {
    /***********************
     * PRESET OPTIMISATION
     **********************/
    class PresetGradeOptimization {
        static minimum(): ParamsGradeOptimizationI;
        static low(): ParamsGradeOptimizationI;
        static standard(): ParamsGradeOptimizationI;
        static medium(): ParamsGradeOptimizationI;
        static high(): ParamsGradeOptimizationI;
        static ultra(): ParamsGradeOptimizationI;
    }
    /*************************
     * OPTIMISATION FUNCTION
     ************************/
    class Optimization {
        static textures(scene: Scene, params: IParamsTexturesGradeOptimization): void;
        static materials(scene: Scene, params: IParamsMaterialsGradeOptimization): void;
        static postProcesses(scene: Scene, enabled: boolean): void;
        static lensFlares(scene: Scene, enabled: boolean): void;
        static renderTargets(scene: Scene, enabled: boolean): void;
        static particules(scene: Scene, enabled: boolean, params: IParamsParticulesGradeOptimization): void;
        static shadows(scene: Scene, enabled: boolean, params: IParamsShadowsGradeOptimization): void;
        static renderSize(scene: Scene, params: IParamsMaxRenderSizeGradeOptimization): void;
        static resizeMaterialChannel(material: Material, params: IParamsTexturesGradeOptimization): void;
        static resizeTexture(texture: Texture, newWidth: number, newHeight: number): any;
    }
    /***************************
     * GRADING SCENE OPTIMIZER
     **************************/
    class GradingSceneOptimizer {
        fpsToReach: number;
        evaluationDuration: number;
        autoUpdate: boolean;
        grades: Array<Grade>;
        autoRunInterval: number;
        occlusionCullingEnabled: boolean;
        minimizeDrawCall: boolean;
        gradeOptimizations: Array<ParamsGradeOptimizationI>;
        upGradingTasks: Array<Function>;
        downGradingTasks: Array<Function>;
        private _currentGrade;
        private _currentGradePriority;
        private _isUpGradingStep;
        private _evaluationTimeOutId;
        private _autoRunIntervalId;
        /**
         * @param scene : BABYLON.Scene
         * @param fpsToReach : fps to reach
         * @param trackerDuration : duration between two fps evaluation
         * @param starterGrade : on wich grade renderGradingSceneOptimizer need to start.
         *                       It's interresting to start with the lower grade.
         *                       For exemple, configure your lower grade with only what is needed. Load only assets you need allow a best loading time performance.
         *                       You will get a better accessibility and plug and play concept. It's important for web.
         * @param autoRunInterval : run automaticaly fps evaluation every 'x' ms. 0 mean desactived
         */
        constructor(fpsToReach?: number, evaluationDuration?: number, autoUpdate?: boolean);
        run(engine: Engine, scene: Scene, starterGrade?: Grade, onReady?: Function): void;
        autoRun(engine: Engine, scene: Scene): void;
        createGrade(name: string, optimization: ParamsGradeOptimizationI, upGradingTask?: Function, downGradingTask?: Function): any;
        updateSceneByGrade(scene: Scene, grade: Grade, onSuccess?: Function): void;
        downgrade(scene: Scene, onSuccess?: Function): void;
        upgrade(scene: Scene, onSuccess?: Function): void;
        stop(): void;
        updateSceneByOptimization(scene: Scene, paramsOptimization: ParamsGradeOptimizationI): void;
        private _hardwareEvaluation(engine, scene, autoRun?, onSuccess?);
    }
    /*********
     * GRADE
     *********/
    class Grade {
        private _GSO;
        name: string;
        optimization: ParamsGradeOptimizationI;
        private _priority;
        priority: number;
        private _upGradingTask;
        upGradingTask: Function;
        private _downGradingTask;
        downGradingTask: Function;
        /**
         * @param name : name of grade
         * @param upGradingTask : task to do when this grade is enabled
         * @param downGradingTask : task to do when this grade is disabled
         * @param optimization : optimization parameters
         */
        constructor(_GSO: GradingSceneOptimizer, name: string, optimization: ParamsGradeOptimizationI, upGradingTask?: Function, downGradingTask?: Function);
    }
    /**************
     * INTERFACES
     *************/
    interface ParamsGradeOptimizationI {
        postProcessesEnabled?: boolean;
        lensFlaresEnabled?: boolean;
        renderTargetsEnabled?: boolean;
        particulesEnabled?: boolean;
        shadowsEnabled?: boolean;
        particules?: IParamsParticulesGradeOptimization;
        shadows?: IParamsShadowsGradeOptimization;
        maxRenderSize?: IParamsMaxRenderSizeGradeOptimization;
        materials?: IParamsMaterialsGradeOptimization;
        textures?: IParamsTexturesGradeOptimization;
        camera?: IParamsCameraGradeOptimization;
    }
    interface IParamsShadowsGradeOptimization {
        type?: 'usePoissonSampling' | 'useExponentialShadowMap' | 'useBlurExponentialShadowMap' | 'useCloseExponentialShadowMap' | 'useBlurCloseExponentialShadowMap';
        size?: number;
    }
    interface IParamsParticulesGradeOptimization {
        ratio: number;
        maxEmitRate?: number;
        minEmitRate?: number;
    }
    interface IParamsMaxRenderSizeGradeOptimization {
        maxWidth: number;
        maxHeight: number;
        devicePixelRatio?: number;
    }
    interface IParamsMaterialsGradeOptimization {
        bumpEnabled?: boolean;
        fresnelEnabled?: boolean;
    }
    interface IParamsTexturesGradeOptimization {
        scale: number;
        maxSize?: number;
        minSize?: number;
    }
    interface IParamsCameraGradeOptimization {
        viewDistance?: number;
    }
}

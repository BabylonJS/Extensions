module RW.TextureEditor {

    export enum BabylonTextureType {
        DYNAMIC,
        NORMAL,
        VIDEO,
        CUBE,
        MIRROR
    }

    export enum CoordinatesMode {
        //(0 = explicit, 1 spherical, 2 = planar, 3 = cubic, 4 = projection, 5 = skybox)
        EXPLICIT,
        SPHERICAL,
        PLANAR,
        CUBIC,
        PROJECTION//,
        //SKYBOX
    }
} 
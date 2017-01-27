declare module DIALOG {
    class Letter extends BasePanel {
        static LETTER_ABOVE: number;
        maxAboveY: number;
        minBelowY: number;
        private _minWorld;
        private _maxWorld;
        _consolidated: boolean;
        /**
         * Full BABYLON.Mesh parameter to support cloning.  Defaulting on BasePanel parameter additions.
         */
        constructor(name: string, scene: BABYLON.Scene, parent?: BABYLON.Node, source?: BABYLON.Mesh, doNotCloneChildren?: boolean);
        /**
         * @override
         * The letter is the geometry.
         */
        useGeometryForBorder(): boolean;
        /**
         * @override
         * No actual layout of subs.  Need to set the _actual members, as super does though.
         */
        _layout(widthConstraint: number, heightConstraint: number): void;
        /**
         * @override
         * No subs to deal with.  Use .682 for _maxAboveOrigin.y & -.23 for _minBelowOrigin.y.
         * This way all letters line up, and all lines of same scale always same height.
         */
        _calcRequiredSize(): void;
        /**
         * @override
         * No meaning for letters
         */
        addSubPanel(sub: Panel, index?: number): void;
        /** @override */ getSubPanel(): Array<Panel>;
        /** @override */ removeAt(index: number, doNotDispose?: boolean): void;
        /** @override */ removeAll(doNotDispose?: boolean): void;
    }
}

declare module DIALOG {
    interface RadioGroup {
        reportSelected(panel: BasePanel): void;
    }
    class BasePanel extends BABYLON.Mesh {
        private _layoutDir;
        private _button;
        _topLevel: boolean;
        horizontalMargin: number;
        verticalMargin: number;
        horizontalAlignment: number;
        verticalAlignment: number;
        borderInsideVert: number;
        borderDepth: number;
        stretchHorizontal: boolean;
        stretchVertical: boolean;
        private static BOLD_MULT;
        private _bold;
        placeHolderWidth: number;
        placeHolderHeight: number;
        maxViewportWidth: number;
        maxViewportHeight: number;
        private _fitToWindow;
        _originalReqdWidth: number;
        _originalReqdHeight: number;
        _maxAboveOrigin: BABYLON.Vector3;
        _minBelowOrigin: BABYLON.Vector3;
        _actualAboveOriginX: number;
        _actualAboveOriginY: number;
        _actualBelowOriginX: number;
        _actualBelowOriginY: number;
        private _nStretchers;
        _xyScale: number;
        private _dirty;
        private _visibleBorder;
        _pickFunc: () => void;
        _callback: (control: BasePanel) => void;
        _panelEnabled: boolean;
        _selected: boolean;
        modalReturnedValue: any;
        modalReturnCallBack: () => void;
        private static _NORMALS;
        private static _TOP_LEVEL_NORMALS;
        private static _INDICES;
        private static _TOP_LEVEL_INDICES;
        private _subs;
        constructor(name: string, scene: BABYLON.Scene, parent?: BABYLON.Node, source?: BABYLON.Mesh, doNotCloneChildren?: boolean, _layoutDir?: number, _button?: boolean, _topLevel?: boolean);
        private _computePositionsData(widthConstraint, heightConstraint);
        /**
        * beforeRender() registered only for toplevel Panels
        */
        private static _beforeRender(mesh);
        setBorderVisible(show: boolean): void;
        isBorderVisible(): boolean;
        /**
         *
         */
        registerPickAction(func: () => void): void;
        assignCallback(func: (control: BasePanel) => void): void;
        isSelected(): boolean;
        isPanelEnabled(): boolean;
        isButton(): boolean;
        /** for those who cannot set it in constructor, like buttons for NumberScroller */
        setButton(button: boolean): void;
        /**
         * Assign whether Top Level Panel to conform to window dimensions.
         */
        fitToWindow: boolean;
        /**
         * signal to the beforeRenderer of the top level Panel, to re-layout on next call
         */
        invalidateLayout(): void;
        layout(): void;
        /**
         * Layout the positions of this panel's sub-panels, based on this panel's layoutDir.
         * Only public for recursive calling across the instance hierarchy.
         *
         * @param {number} widthConstraint  - Will always be >= getReqdWidth ()
         * @param {number} heightConstraint - Will always be >= getReqdHeight()
         */
        _layout(widthConstraint: number, heightConstraint: number): void;
        /**
         * Layout the positions of this panel's sub-panels, based horizontal layoutDir,
         * but without regard to origin of this panel.
         *
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        private _horizontalLayout(widthConstraint, heightConstraint);
        /**
         * Layout the positions of this panel's sub-panels, based vertical layoutDir,
         * but without regard to origin of this panel.
         *
         * @param {number} widthConstraint  - Will always be >= getWidth()
         * @param {number} heightConstraint - Will always be >= getHeight()
         */
        private _verticalLayout(widthConstraint, heightConstraint);
        /**
         * Applied after all sub-panels have been placed.  Allows for easier to understand code
         *
         */
        private _adjustLayoutForOrigin();
        /**
         * @param {boolean} isHorizontal - the layout direction to check for, vertical when false
         * @return {boolean} true, when:
         *       - follows (Lefts, tops), up to 1 center, (rights, bottoms) order
         *       - has no stretchers if it also has a center
         */
        private _validateAlignmnent(isHorizontal);
        /**
         * responsible for setting a number of attributes, based on interogating its sub-panels
         *
         * _maxAboveOrigin   :  The width of the sub-panels (added together or widest), / 2 for centering / rotation
         * _minBelowOrigin   :  _maxAboveOrigin with sign flipped, for centering / rotation
         * _nStretchers      :  # of sub-panels specifying stretch,[0] & [1], (horizontal & vertical)
         */
        _calcRequiredSize(): void;
        /**
         * @return {number} - This returns the sum of the max X of a vertex, above 0, & the min X of a vertex, when less than 0
         * This handle Letter kerning, where the min X is positive.  Want to include this space as part of width.
         */
        getReqdWidth(): number;
        /**
         * @return {number} - This returns the sum of the max Y of a vertex, above 0, & the min Y of a vertex, when less than 0
         * This handle Letter baselining, though no letters start above baseline.
         */
        getReqdHeight(): number;
        /**
         * make the actual assignments out of _calcRequiredSize, so can be called from DialogSys._adjustCameraForPanel,
         * when fitToWindow.  There is no gauranttee that all width & height will be used, if the is no align_right or
         * align_bottom direct child, or a stretcher somewhere in the tree.
         */
        _assignRequirements(width: number, height: number, depth?: number): void;
        /**
         * @return {number} - This returns the sum of the max Z of a vertex, above 0, & the min Z of a vertex, when less than 0
         */
        getReqdDepth(): number;
        setLayerMask(maskId: number): void;
        /**
         * Provide the list of sub-panels.  Not getChildren(), since in use by BABYLON.Node.
         * Cannot use getChildren, since this is in order of adding only.
         */
        getSubPanels(): Array<BasePanel>;
        /**
         * Add a sub-panel to the end, or at the index passed.
         * Also sets the parent of the sub-panel to itself.
         *
         * @param {DIALOG.Panel} sub - Panel to be added.
         * @param {number} index - the position at which to add the sub-panel
         */
        addSubPanel(sub: BasePanel, index?: number): void;
        /**
         * remove a sub-panel
         * @param {number} index - the index of the panel to be removed
         */
        removeAt(index: number, doNotDispose?: boolean): void;
        /**
         * remove all sub-panels
         */
        removeAll(doNotDispose?: boolean): void;
        getRootPanel(): BasePanel;
        /**
         * Method for sub-classes to override.  Keeps the # of constructor arg down
         */
        useGeometryForBorder(): boolean;
        getFullScalePlaceholderWidth(): number;
        getFullScalePlaceholderHeight(): number;
        /** align all of the sub-panels in z dim.
         *  @param {number} z - the value each sub-panel should achieve
         */
        setUniformZ(z: number): void;
        /**
         * Change the scaling.x & scaling.y recursively of each sub-panel.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {BasePanel} For convenience of stringing methods together
         */
        setSubsFaceSize(size: number, relative?: boolean): BasePanel;
        /**
         * Change the scaling.x & scaling.y of each panel.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {BasePanel} For convenience of stringing methods together
         */
        setFaceSize(size: number, relative?: boolean): BasePanel;
        /**
         * Change the scaling.x of each letter, based on the bold setting
         * @param {boolean} bold - when true make wider in scaling.x than in scaling.y
         * @return {BasePanel} For convenience of stringing methods together
         */
        setBold(bold: boolean): BasePanel;
        /**
         * Change the scaling.x & scaling.y of each panel.
         */
        _scaleXY(): void;
        /**
         * Change the scaling.z  of each panel.
         * @param {number} z - Value for the Z dimension
         * @return {BasePanel} For convenience of stringing methods together
         */
        scaleZ(z: number): BasePanel;
        stretch(vert: boolean, horiz: boolean): BasePanel;
        vertAlign(align: number): BasePanel;
        horizontalAlign(align: number): BasePanel;
        margin(vert: number, horz: number): BasePanel;
        disolve(visibility: number, exceptionButton: BasePanel): void;
        reAppear(): void;
        /**
         * recursing disposes of letter clones & original when no more in use.  Must make MeshFactory work.
         * @param {boolean} doNotRecurse - ignored
         */
        dispose(doNotRecurse?: boolean): void;
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        freezeWorldMatrixTree(): void;
        /**
          * @override
          * Do the entire hierarchy, in addition
          */
        unfreezeWorldMatrixTree(): void;
    }
    class Panel extends BasePanel {
        static BORDER_MAT: BABYLON.StandardMaterial;
        static TOP_LEVEL_BORDER_MAT: BABYLON.MultiMaterial;
        constructor(name: string, _layoutDir?: number, topLevel?: boolean);
        /**
         * Make a Panel with a sublist & optional title
         * @param {string} title -
         */
        static makeList(title: string, labels: [string], layoutDir?: number, listFontSize?: number, titleMaterial?: Array<BABYLON.StandardMaterial>, topLevel?: boolean): BasePanel;
        static nestPanels(title: string, innerPs: [BasePanel], layoutDir?: number, showOuterBorder?: boolean, titleMaterial?: Array<BABYLON.StandardMaterial>, topLevel?: boolean): BasePanel;
        static ExtractMax(mesh: BABYLON.Mesh): BABYLON.Vector3;
        private static _LAYOUT_HORIZONTAL;
        private static _LAYOUT_VERTICAL;
        static readonly LAYOUT_HORIZONTAL: number;
        static readonly LAYOUT_VERTICAL: number;
        private static _ALIGN_LEFT;
        private static _ALIGN_HCENTER;
        private static _ALIGN_RIGHT;
        private static _ALIGN_TOP;
        private static _ALIGN_VCENTER;
        private static _ALIGN_BOTTOM;
        static readonly ALIGN_LEFT: number;
        static readonly ALIGN_HCENTER: number;
        static readonly ALIGN_RIGHT: number;
        static readonly ALIGN_TOP: number;
        static readonly ALIGN_VCENTER: number;
        static readonly ALIGN_BOTTOM: number;
    }
}

declare module DIALOG {
    class DialogSys {
        static WHITE: Array<BABYLON.StandardMaterial>;
        static BLACK: Array<BABYLON.StandardMaterial>;
        static BLUE: Array<BABYLON.StandardMaterial>;
        static GOLD: Array<BABYLON.StandardMaterial>;
        static RED: Array<BABYLON.StandardMaterial>;
        static GREY: Array<BABYLON.StandardMaterial>;
        static LT_GREY: Array<BABYLON.StandardMaterial>;
        static ORANGE: Array<BABYLON.StandardMaterial>;
        static GREEN: Array<BABYLON.StandardMaterial>;
        static ACTIVE_DIALOG_LAYER: number;
        static SUSPENDED_DIALOG_LAYER: number;
        static DEFAULT_LAYERMASK: number;
        private static _dialogStack;
        private static _camera;
        private static _light;
        static _scene: BABYLON.Scene;
        private static _onNewLightObserver;
        static CURRENT_FONT_MAT_ARRAY: Array<BABYLON.StandardMaterial>;
        static USE_CULLING_MAT_FOR_2D: boolean;
        static DEPTH_SCALING_3D: number;
        /**
         * Must be run before instancing any panels.  Stores scene, so does not have to be part of Panel constructors.
         * Also instances system camera / lights, load stock fonts in TOB runtime, & build font materials.
         * @param {BABYLON.Scene} scene - The scene to construct Panels in.
         */
        static initialize(scene: BABYLON.Scene): void;
        /**
         *
         */
        static onNewLight(newLight?: BABYLON.Light): void;
        /**
         * Remove all the things made / done in initialize().
         */
        static dispose(): void;
        /**
         * Build sets of materials for Letter generation.  Output should be to DialogSys.CURRENT_FONT_MAT_ARRAY,
         * prior to Letter creation.
         *
         * @return {Array<BABYLON.StandardMaterial>}:
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         */
        static buildFontMaterials(baseName: String, color: BABYLON.Color3, intensity?: number, alpha?: number): Array<BABYLON.StandardMaterial>;
        /**
         * Add a top level panel to the modal stack.  When first panel re-enable system camera,
         * otherwise hide the previous panel using layermask.
         * @param {BasePanel} panel - The new top of the stack panel.
         */
        static pushPanel(panel: BasePanel): void;
        static popPanel(doNotDispose?: boolean): any;
        /**
         * Adjusts camera ortho settings & viewport based on the top panel on the stack.
         * Called by pushPanel(), popPanel(), & window resize event registered for above.
         * Called externally in BasePanel._beforeRender(), for top level Panels.
         */
        static _adjustCameraForPanel(): void;
        /**
         * called internally to get the ratios of a panel relative to thecurrent window size
         */
        private static _getScalingToWindow(width, height);
        static readonly Version: string;
    }
}

declare module DIALOG {
    /**
     * class to retrieve Letters from Mesh factories.  load your own fonts to TOWER_OF_BABEL.MeshFactory.MODULES
     */
    class FontFactory {
        /**
         * Initialize the stock Typeface modules, could not do in getLetters, without passing scene everytime.
         * When both Font2D & Font3D are found, Label.DEFAULT_FONT_MODULE is set to Font2D.
         * @param {BABYLON.Scene} scene - needed to instance meshes.
         */
        static loadStockTypefaces(scene: BABYLON.Scene): void;
        /**
         * Get an array of meshes <Letter> which match match the string passed
         * @param {string} letters - list of characters
         * @param {string} typeface - the identifier of the font to retrieve
         * @param {BABYLON.Material} customMaterial - optional material to override with, stock material probably 'White'
         * @return {Array} - Same length letters arg. ' ', space chars & those not found are null.
         */
        static getLetters(letters: string, typeface: string, customMaterial?: BABYLON.Material): Array<Letter>;
    }
}

declare module DIALOG {
    class Spacer extends BasePanel {
        /**
         * Sub-class of BasePanel containing no geometry.  Used to assign blank space.  Actual space
         * that a unit occupies is relative to the total units that the top level panel requires in that
         * dimension.  Best to put in spacer with 0,0 during dev.  Once rest is settled, then tune here.
         *
         * @param {number} vertUnits       - The amount of space in the vertical   dimension.
         * @param {number} horizontalUnits - The amount of space in the horizontal dimension.
         */
        constructor(vertUnits: number, horizontalUnits: number);
        /**
         * @override
         */
        useGeometryForBorder(): boolean;
        /**
         * @override
         * No meaning for spacers
         */
        addSubPanel(sub: Panel, index?: number): void;
        /** @override */ getSubPanel(): Array<Panel>;
        /** @override */ removeAt(index: number, doNotDispose?: boolean): void;
        /** @override */ removeAll(doNotDispose?: boolean): void;
    }
}

declare module DIALOG {
    class Label extends BasePanel {
        _prohibitMerging: boolean;
        static DEFAULT_FONT_MODULE: string;
        static NO_MERGING: boolean;
        _isTypeface3D: boolean;
        private _merged;
        /**
         * Sub-class of BasePanel containing a set of Letter subPanels.
         * @param {string} letters - The list of characters to use.  Those not found in typeface & ' ' result in subPanels of null.
         * @param {string} typeFace - The module name to use for Meshes.  User modules must be loaded via:
         *                            TOWER_OF_BABEL.MeshFactory.MODULES.push(new myFont3D.MeshFactory(scene));
         * @param {BABYLON.Material} customMaterial - Optional material to use, otherwise DialogSys.CURRENT_FONT_MAT_ARRAY is used.
         * @param {boolean} _button - Indicate this is to be used as a button, so install no border material.
         * @param {boolean} _prohibitMerging - Indicate this is to be kept as separate Letter meshes
         */
        constructor(letters: string, typeFace?: string, customMaterial?: BABYLON.Material, _button?: boolean, _prohibitMerging?: boolean);
        /**
         * Change the scaling.x & scaling.y of each letter mesh.
         * @param {number} size - This is the new scaling to use.
         * @param {boolean} relative - When true, the size is multiplied by the previous value.
         * @return {Label} For convenience of stringing methods together
         */
        setFontSize(size: number, relative?: boolean): BasePanel;
        /**
         * Set the material of each letter.
         * @param {Array<BABYLON.StandardMaterial>} matArray - An array of materials to choose from based on geometry
         *    [0] - Version when building from a 3D font
         *    [1] - Version when building from a 2D font; backface culling disabled
         * @return {Label} For convenience of stringing methods together
         */
        setLetterMaterial(matArray: Array<BABYLON.StandardMaterial>, selectedText?: string): Label;
        /** @override */ getFullScalePlaceholderWidth(): number;
        /**
         * @override
         * Restrict adds of only Letters.
         */
        addSubPanel(sub: BasePanel, index?: number): void;
        /**
         * @override
         */
        _calcRequiredSize(): void;
        /**
         * called from _layout, so _calcRequiredSize already run for entire heirarchy.
         * Essentially, going to take each letter and make a big letter(s)
         */
        private _mergeMeshes();
        private _extractVertexData(letter, xOffset);
        private _bigLetter(material, vertexData);
    }
}

declare module DIALOG {
    class Button extends Label {
        _button_type: number;
        static MAT: BABYLON.MultiMaterial;
        static SELECTED_MAT: BABYLON.MultiMaterial;
        private static _DISOLVED_MAT;
        private _group;
        private _chngInProgress;
        private _sysHideButton;
        private _rootPanel;
        private _disolvedState;
        private static DISOLVE_STEP_RATE;
        /**
         * @param {string} label - The text to display on the button.
         * @param {number} _button_type - Either Button.ACTION_BUTTON or Button.RADIO_BUTTON
         * @param {string} typeFace - Optional module name of the font to use instead of default
         */
        constructor(label: string, _button_type?: number, typeFace?: string);
        /**
        * _delayedStart() registered only for Button.ACTION_BUTTON types
        */
        private static _delayedStart(mesh);
        /**
         * Indicate whether button is selected or not.  Callable in user code regardless of enabled or not.
         * Visibly changes out the material to indicate button is selected or not.
         * @param {boolean} selected - new value to set to
         * @param {boolean} noCallbacks - when true, do nothing in addition but change material.
         * Used in constructor and by after renderer to unselect after click.
         */
        setSelected(selected: boolean, noCallbacks?: boolean): void;
        /**
         * Method to indicate clicks should be proecessed. Also assigns material of the letters.
         * Sets the member _panelEnabled in BasePanel.  NOT using 'enabled', since already in use by Babylon.
         * DO NOT change to 'set Enabled' due to that.
         * @param {boolean} enabled - New value to assign
         */
        enableButton(enabled: boolean): void;
        /**
         * Setter of the member identifying the radio group the button belongs to.  Called by Menu.
         * @param
         */
        radioGroup: RadioGroup;
        hideSystemOnClick(hide: boolean): void;
        isSystemHidden(): boolean;
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        dispose(doNotRecurse?: boolean): void;
        reAppearNoCallback(): void;
        private static _ACTION_BUTTON;
        private static _RADIO_BUTTON;
        static readonly ACTION_BUTTON: number;
        static readonly RADIO_BUTTON: number;
    }
}

declare module DIALOG {
    class Menu extends BasePanel implements RadioGroup {
        private _menu;
        private _selectedIndex;
        private _callbacks;
        /**
         * @param {string} title - Optional mesh to display above the menu buttons
         * @param {[string]} labels - Each string results in a menu button created using it as the text
         * @param {number} layoutDir - Vertical for menus, but allow sub-classes like a TabbedPanel to set to horizontal
         * @param {boolean} topLevel - Give a menu the opportunity to be a top level panel
         */
        constructor(title: string, labels: [string], layoutDir?: number, topLevel?: boolean);
        assignMenuCallback(itemIdx: number, func: (button: Button) => void): void;
        /**
         * called by Buttons that have a RadioGroup (this) assigned to them
         * @param {BasePanel} reporter - This is the button report in that it has been clicked
         */
        reportSelected(reporter: BasePanel): void;
        selectedIndex: number;
        /**
         * @override
         * Add a Button to the end of the menu, or at the index passed.
         * Also make room in _callbacks.
         *
         * @param {BasePanel} sub - Button to be added.
         * @param {number} index - the position at which to add the Gutton
         */
        addSubPanel(sub: BasePanel, index?: number): void;
        /**
         * @override
         * remove a sub-panel & callback
         * @param {number} index - the index of the button to be removed
         */
        removeAt(index: number): void;
        /**
         * @override
         * remove all menu buttons  & callback
         */
        removeAll(): void;
    }
}

declare module DIALOG {
    class CheckBox extends Label {
        private static factory;
        constructor(letters: string, typeFace?: string, _prohibitMerging?: boolean);
        /**
         * all meshes within 2D & 3D consume same space, so no layout required. to switch them out.
         */
        private _assignCheckMesh();
        setSelected(selected: any): void;
        enableButton(enabled: boolean): void;
        /**
         * @override
         */
        _calcRequiredSize(): void;
    }
}

declare module Font2D {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font2D_EXT {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font3D {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}
declare module Font3D_EXT {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
}

declare module CheckBoxFont {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
    function getStats(): [number];
    function defineMaterials(scene: BABYLON.Scene, materialsRootDir?: string): void;
    class unchecked2D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: unchecked2D);
        dispose(doNotRecurse?: boolean): void;
    }
    class checked2D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: checked2D);
        dispose(doNotRecurse?: boolean): void;
    }
    class checked3D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: checked3D);
        dispose(doNotRecurse?: boolean): void;
    }
    class unchecked3D extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: unchecked3D);
        dispose(doNotRecurse?: boolean): void;
    }
}

declare module DIALOG {
    /**
     * A way to map a mesh into a panel.  Very similar to Letter, except it is an actual sub-class of BasePanel.
     */
    class MeshWrapperPanel extends BasePanel {
        _inside: BABYLON.Mesh;
        private _needBorders;
        _minWorld: BABYLON.Vector3;
        _maxWorld: BABYLON.Vector3;
        constructor(_inside: BABYLON.Mesh, _needBorders?: boolean);
        setMaterial(mat: BABYLON.StandardMaterial): void;
        /**
         * @override
         */
        useGeometryForBorder(): boolean;
        /**
         * @override
         * No actual layout of sub-panels.  Need to set the _actual members, as super does though.
         */
        _layout(widthConstraint: number, heightConstraint: number): void;
        /**
         * @override
         */
        _calcRequiredSize(): void;
        /**
         * @override
         * Change layermask of this._inside and any children
         */
        setLayerMask(maskId: number): void;
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        freezeWorldMatrixTree(): void;
        /**
         * @override
         * Do the entire hierarchy, in addition
         */
        unfreezeWorldMatrixTree(): void;
        /** @override */
        addSubPanel(sub: BasePanel, index?: number): void;
        /** @override */ getSubPanel(): Array<Panel>;
        /** @override */ removeAt(index: number, doNotDispose?: boolean): void;
        /** @override */ removeAll(doNotDispose?: boolean): void;
        /** @override */
        setSubsFaceSize(size: number, relative?: boolean): BasePanel;
    }
}

declare module DIALOG {
    class LCD extends BasePanel {
        private _nDigits;
        private _alwaysDot;
        private _fixed;
        static MAT: BABYLON.StandardMaterial;
        private _value;
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.
         */
        constructor(name: string, _nDigits: number, _alwaysDot?: boolean, _fixed?: number);
        value: number;
        static _initMaterial(): void;
    }
    class NumberScroller extends BasePanel {
        minValue: number;
        maxValue: number;
        increment: number;
        static MAT: BABYLON.MultiMaterial;
        static SELECTED_MAT: BABYLON.MultiMaterial;
        private _display;
        private _downButton;
        private _upButton;
        /**
         * Sub-class of BasePanel containing a set of DigitWtLogic subPanels.
         * @param {number} _nDigits - The # of digits to use.
         */
        constructor(label: string, _nDigits: number, minValue: number, maxValue: number, initialValue: number, increment?: number, fixed?: number);
        /**
         * @override
         * disposes of after renderer too
         * @param {boolean} doNotRecurse - ignored
         */
        dispose(doNotRecurse?: boolean): void;
        private _getButton(className, nScroller);
        /**
         * After renderer
         */
        private static _normalMaterials(mesh);
        private _increment();
        private _decrement();
        value: number;
    }
}

declare module DigitParts {
    class MeshFactory implements TOWER_OF_BABEL.FactoryModule {
        private _scene;
        constructor(_scene: BABYLON.Scene, materialsRootDir?: string);
        getModuleName(): string;
        instance(meshName: string, cloneSkeleton?: boolean): BABYLON.Mesh;
    }
    function getStats(): [number];
    function defineMaterials(scene: BABYLON.Scene, materialsRootDir?: string, neverCheckReadyOnlyOnce?: boolean): void;
    function defineMultiMaterials(scene: BABYLON.Scene): void;
    class Geometry extends BABYLON.Mesh {
        botLeft: BABYLON.Mesh;
        topLeft: BABYLON.Mesh;
        top: BABYLON.Mesh;
        topRite: BABYLON.Mesh;
        botRite: BABYLON.Mesh;
        bottom: BABYLON.Mesh;
        dot: BABYLON.Mesh;
        center: BABYLON.Mesh;
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: Geometry);
        dispose(doNotRecurse?: boolean): void;
    }
    class Down extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: Down);
        dispose(doNotRecurse?: boolean): void;
    }
    class Up extends DIALOG.Letter {
        constructor(name: string, scene: BABYLON.Scene, materialsRootDir?: string, source?: Up);
        dispose(doNotRecurse?: boolean): void;
    }
}

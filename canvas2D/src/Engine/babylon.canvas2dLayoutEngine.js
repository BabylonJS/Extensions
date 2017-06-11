var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BABYLON;
(function (BABYLON) {
    var LayoutEngineBase = (function () {
        function LayoutEngineBase() {
            this.layoutDirtyOnPropertyChangedMask = 0;
        }
        LayoutEngineBase.prototype.updateLayout = function (prim) {
        };
        Object.defineProperty(LayoutEngineBase.prototype, "isChildPositionAllowed", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        LayoutEngineBase.prototype.isLocked = function () {
            return this._isLocked;
        };
        LayoutEngineBase.prototype.lock = function () {
            if (this._isLocked) {
                return false;
            }
            this._isLocked = true;
            return true;
        };
        return LayoutEngineBase;
    }());
    LayoutEngineBase = __decorate([
        BABYLON.className("LayoutEngineBase", "BABYLON")
        /**
         * This is the base class you have to extend in order to implement your own Layout Engine.
         * Note that for performance reason, each different Layout Engine type can be exposed as one/many singleton or must be instanced each time.
         * If data has to be associated to a given primitive you can use the SmartPropertyPrim.addExternalData API to do it.
         */
    ], LayoutEngineBase);
    BABYLON.LayoutEngineBase = LayoutEngineBase;
    var CanvasLayoutEngine = CanvasLayoutEngine_1 = (function (_super) {
        __extends(CanvasLayoutEngine, _super);
        function CanvasLayoutEngine() {
            var _this = _super.call(this) || this;
            _this.layoutDirtyOnPropertyChangedMask = BABYLON.Prim2DBase.sizeProperty.flagId | BABYLON.Prim2DBase.actualSizeProperty.flagId;
            return _this;
        }
        Object.defineProperty(CanvasLayoutEngine, "Singleton", {
            get: function () {
                if (!CanvasLayoutEngine_1._singleton) {
                    CanvasLayoutEngine_1._singleton = new CanvasLayoutEngine_1();
                }
                return CanvasLayoutEngine_1._singleton;
            },
            enumerable: true,
            configurable: true
        });
        // A very simple (no) layout computing...
        // The Canvas and its direct children gets the Canvas' size as Layout Area
        // Indirect children have their Layout Area to the actualSize (margin area) of their parent
        CanvasLayoutEngine.prototype.updateLayout = function (prim) {
            // If this prim is layoutDiry we update  its layoutArea and also the one of its direct children
            if (prim._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty)) {
                prim._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
                for (var _i = 0, _a = prim.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    this._doUpdate(child);
                }
            }
        };
        CanvasLayoutEngine.prototype._doUpdate = function (prim) {
            // Canvas ?
            if (prim instanceof BABYLON.Canvas2D) {
                prim.layoutArea = prim.actualSize; //.multiplyByFloats(prim.scaleX, prim.scaleY);
            }
            else if (prim.parent instanceof BABYLON.Canvas2D) {
                prim.layoutArea = prim.owner.actualSize; //.multiplyByFloats(prim.owner.scaleX, prim.owner.scaleY);
            }
            else {
                var contentArea = prim.parent.contentArea;
                // Can be null if the parent's content area depend of its children, the computation will be done in many passes
                if (contentArea) {
                    prim.layoutArea = contentArea;
                }
            }
            BABYLON.C2DLogging.setPostMessage(function () { return "Prim: " + prim.id + " has layoutArea: " + prim.layoutArea; });
        };
        Object.defineProperty(CanvasLayoutEngine.prototype, "isChildPositionAllowed", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return CanvasLayoutEngine;
    }(LayoutEngineBase));
    CanvasLayoutEngine._singleton = null;
    __decorate([
        BABYLON.logMethod()
    ], CanvasLayoutEngine.prototype, "updateLayout", null);
    __decorate([
        BABYLON.logMethod()
    ], CanvasLayoutEngine.prototype, "_doUpdate", null);
    CanvasLayoutEngine = CanvasLayoutEngine_1 = __decorate([
        BABYLON.className("CanvasLayoutEngine", "BABYLON")
        /**
         * The default Layout Engine, primitive are positioning into a Canvas, using their x/y coordinates.
         * This layout must be used as a Singleton through the CanvasLayoutEngine.Singleton property.
         */
    ], CanvasLayoutEngine);
    BABYLON.CanvasLayoutEngine = CanvasLayoutEngine;
    var StackPanelLayoutEngine = StackPanelLayoutEngine_1 = (function (_super) {
        __extends(StackPanelLayoutEngine, _super);
        function StackPanelLayoutEngine() {
            var _this = _super.call(this) || this;
            _this._isHorizontal = true;
            _this.layoutDirtyOnPropertyChangedMask = BABYLON.Prim2DBase.sizeProperty.flagId | BABYLON.Prim2DBase.actualSizeProperty.flagId;
            return _this;
        }
        Object.defineProperty(StackPanelLayoutEngine, "Horizontal", {
            get: function () {
                if (!StackPanelLayoutEngine_1._horizontal) {
                    StackPanelLayoutEngine_1._horizontal = new StackPanelLayoutEngine_1();
                    StackPanelLayoutEngine_1._horizontal.isHorizontal = true;
                    StackPanelLayoutEngine_1._horizontal.lock();
                }
                return StackPanelLayoutEngine_1._horizontal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StackPanelLayoutEngine, "Vertical", {
            get: function () {
                if (!StackPanelLayoutEngine_1._vertical) {
                    StackPanelLayoutEngine_1._vertical = new StackPanelLayoutEngine_1();
                    StackPanelLayoutEngine_1._vertical.isHorizontal = false;
                    StackPanelLayoutEngine_1._vertical.lock();
                }
                return StackPanelLayoutEngine_1._vertical;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StackPanelLayoutEngine.prototype, "isHorizontal", {
            get: function () {
                return this._isHorizontal;
            },
            set: function (val) {
                if (this.isLocked()) {
                    return;
                }
                this._isHorizontal = val;
            },
            enumerable: true,
            configurable: true
        });
        StackPanelLayoutEngine.prototype.updateLayout = function (prim) {
            if (prim._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty)) {
                var primLayoutArea = prim.layoutArea;
                var isSizeAuto = prim.isSizeAuto;
                // If we're not in autoSize the layoutArea of the prim having the stack panel must be computed in order for us to compute the children' position.
                // If there's at least one auto size (Horizontal or Vertical) we will have to figure the layoutArea ourselves
                if (!primLayoutArea && !isSizeAuto) {
                    return;
                }
                //                console.log("Compute Stack Panel Layout " + ++StackPanelLayoutEngine.computeCounter);
                var x = 0;
                var y = 0;
                var horizonStackPanel = this.isHorizontal;
                // If the stack panel is horizontal we check if the primitive height is auto or not, if it's auto then we have to compute the required height, otherwise we just take the actualHeight. If the stack panel is vertical we do the same but with width
                var max = 0;
                var stackPanelLayoutArea = StackPanelLayoutEngine_1.stackPanelLayoutArea;
                if (horizonStackPanel) {
                    if (prim.isVerticalSizeAuto) {
                        max = 0;
                        stackPanelLayoutArea.height = 0;
                    }
                    else {
                        max = prim.layoutArea.height;
                        stackPanelLayoutArea.height = prim.layoutArea.height;
                        stackPanelLayoutArea.width = 0;
                    }
                }
                else {
                    if (prim.isHorizontalSizeAuto) {
                        max = 0;
                        stackPanelLayoutArea.width = 0;
                    }
                    else {
                        max = prim.layoutArea.width;
                        stackPanelLayoutArea.width = prim.layoutArea.width;
                        stackPanelLayoutArea.height = 0;
                    }
                }
                for (var _i = 0, _a = prim.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child._isFlagSet(BABYLON.SmartPropertyPrim.flagNoPartOfLayout)) {
                        continue;
                    }
                    if (child._hasMargin) {
                        // Calling computeWithAlignment will return us the area taken by "child" which is its layoutArea
                        // We also have the dstOffset which will give us the y position in horizontal mode or x position in vertical mode.
                        //  The alignment offset on the other axis is simply ignored as it doesn't make any sense (e.g. horizontal alignment is ignored in horizontal mode)
                        child.margin.computeWithAlignment(stackPanelLayoutArea, child.actualSize, child.marginAlignment, child.actualScale, StackPanelLayoutEngine_1.dstOffset, StackPanelLayoutEngine_1.dstArea, true);
                        child.layoutArea = StackPanelLayoutEngine_1.dstArea;
                    }
                    else {
                        child.margin.computeArea(child.actualSize, child.actualScale, StackPanelLayoutEngine_1.dstArea);
                        child.layoutArea = StackPanelLayoutEngine_1.dstArea;
                    }
                    max = Math.max(max, horizonStackPanel ? StackPanelLayoutEngine_1.dstArea.height : StackPanelLayoutEngine_1.dstArea.width);
                }
                for (var _b = 0, _c = prim.children; _b < _c.length; _b++) {
                    var child = _c[_b];
                    if (child._isFlagSet(BABYLON.SmartPropertyPrim.flagNoPartOfLayout)) {
                        continue;
                    }
                    var layoutArea = child.layoutArea;
                    if (horizonStackPanel) {
                        child.layoutAreaPos = new BABYLON.Vector2(x, 0);
                        x += layoutArea.width;
                        child.layoutArea = new BABYLON.Size(layoutArea.width, max);
                    }
                    else {
                        child.layoutAreaPos = new BABYLON.Vector2(0, y);
                        y += layoutArea.height;
                        child.layoutArea = new BABYLON.Size(max, layoutArea.height);
                    }
                }
                prim._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
            }
        };
        Object.defineProperty(StackPanelLayoutEngine.prototype, "isChildPositionAllowed", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return StackPanelLayoutEngine;
    }(LayoutEngineBase));
    StackPanelLayoutEngine._horizontal = null;
    StackPanelLayoutEngine._vertical = null;
    StackPanelLayoutEngine.stackPanelLayoutArea = BABYLON.Size.Zero();
    StackPanelLayoutEngine.dstOffset = BABYLON.Vector4.Zero();
    StackPanelLayoutEngine.dstArea = BABYLON.Size.Zero();
    StackPanelLayoutEngine.computeCounter = 0;
    StackPanelLayoutEngine = StackPanelLayoutEngine_1 = __decorate([
        BABYLON.className("StackPanelLayoutEngine", "BABYLON")
        /**
         * A stack panel layout. Primitive will be stack either horizontally or vertically.
         * This Layout type must be used as a Singleton, use the StackPanelLayoutEngine.Horizontal for an horizontal stack panel or StackPanelLayoutEngine.Vertical for a vertical one.
         */
    ], StackPanelLayoutEngine);
    BABYLON.StackPanelLayoutEngine = StackPanelLayoutEngine;
    /**
     * GridData is used specify what row(s) and column(s) a primitive is placed in when its parent is using a Grid Panel Layout.
     */
    var GridData = (function () {
        /**
         * Create a Grid Data that describes where a primitive will be placed in a Grid Panel Layout.
         * @param row the row number of the grid
         * @param column the column number of the grid
         * @param rowSpan the number of rows a primitive will occupy
         * @param columnSpan the number of columns a primitive will occupy
         **/
        function GridData(row, column, rowSpan, columnSpan) {
            this.row = row;
            this.column = column;
            this.rowSpan = (rowSpan == null) ? 1 : rowSpan;
            this.columnSpan = (columnSpan == null) ? 1 : columnSpan;
        }
        return GridData;
    }());
    BABYLON.GridData = GridData;
    var GridDimensionDefinition = (function () {
        function GridDimensionDefinition() {
        }
        GridDimensionDefinition.prototype._parse = function (value, res) {
            var v = value.toLocaleLowerCase().trim();
            if (v.indexOf("auto") === 0) {
                res(null, null, GridDimensionDefinition.Auto);
            }
            else if (v.indexOf("*") !== -1) {
                var i = v.indexOf("*");
                var w = 1;
                if (i > 0) {
                    w = parseFloat(v.substr(0, i));
                }
                res(w, null, GridDimensionDefinition.Stars);
            }
            else {
                var w = parseFloat(v);
                res(w, w, GridDimensionDefinition.Pixels);
            }
        };
        return GridDimensionDefinition;
    }());
    GridDimensionDefinition.Pixels = 1;
    GridDimensionDefinition.Stars = 2;
    GridDimensionDefinition.Auto = 3;
    var RowDefinition = (function (_super) {
        __extends(RowDefinition, _super);
        function RowDefinition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RowDefinition;
    }(GridDimensionDefinition));
    var ColumnDefinition = (function (_super) {
        __extends(ColumnDefinition, _super);
        function ColumnDefinition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ColumnDefinition;
    }(GridDimensionDefinition));
    var GridPanelLayoutEngine = GridPanelLayoutEngine_1 = (function (_super) {
        __extends(GridPanelLayoutEngine, _super);
        function GridPanelLayoutEngine(settings) {
            var _this = _super.call(this) || this;
            _this._children = [];
            _this._rowBottoms = [];
            _this._columnLefts = [];
            _this._rowHeights = [];
            _this._columnWidths = [];
            _this.layoutDirtyOnPropertyChangedMask = BABYLON.Prim2DBase.sizeProperty.flagId | BABYLON.Prim2DBase.actualSizeProperty.flagId;
            _this._rows = new Array();
            _this._columns = new Array();
            if (settings.rows) {
                var _loop_1 = function (row) {
                    var r = new RowDefinition();
                    r._parse(row.height, function (v, vp, t) {
                        r.height = v;
                        r.heightPixels = vp;
                        r.heightType = t;
                    });
                    this_1._rows.push(r);
                };
                var this_1 = this;
                for (var _i = 0, _a = settings.rows; _i < _a.length; _i++) {
                    var row = _a[_i];
                    _loop_1(row);
                }
            }
            if (settings.columns) {
                var _loop_2 = function (col) {
                    var r = new ColumnDefinition();
                    r._parse(col.width, function (v, vp, t) {
                        r.width = v;
                        r.widthPixels = vp;
                        r.widthType = t;
                    });
                    this_2._columns.push(r);
                };
                var this_2 = this;
                for (var _b = 0, _c = settings.columns; _b < _c.length; _b++) {
                    var col = _c[_b];
                    _loop_2(col);
                }
            }
            return _this;
        }
        GridPanelLayoutEngine.prototype.updateLayout = function (prim) {
            if (prim._isFlagSet(BABYLON.SmartPropertyPrim.flagLayoutDirty)) {
                if (!prim.layoutArea) {
                    return;
                }
                for (var _i = 0, _a = prim.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child._isFlagSet(BABYLON.SmartPropertyPrim.flagNoPartOfLayout)) {
                        continue;
                    }
                    if (child._hasMargin) {
                        child.margin.computeWithAlignment(prim.layoutArea, child.actualSize, child.marginAlignment, child.actualScale, GridPanelLayoutEngine_1.dstOffset, GridPanelLayoutEngine_1.dstArea, true);
                    }
                    else {
                        child.margin.computeArea(child.actualSize, child.actualScale, GridPanelLayoutEngine_1.dstArea);
                    }
                    child.layoutArea = GridPanelLayoutEngine_1.dstArea;
                }
                this._updateGrid(prim);
                var _children = this._children;
                var rl = this._rows.length;
                var cl = this._columns.length;
                var columnWidth = 0;
                var rowHeight = 0;
                var dstArea = GridPanelLayoutEngine_1.dstArea;
                var dstAreaPos = GridPanelLayoutEngine_1.dstAreaPos;
                for (var i = 0; i < _children.length; i++) {
                    var children = _children[i];
                    if (children) {
                        var bottom = this._rowBottoms[i];
                        var rowHeight_1 = this._rowHeights[i];
                        var oBottom = bottom;
                        var oRowHeight = rowHeight_1;
                        for (var j = 0; j < children.length; j++) {
                            var left = this._columnLefts[j];
                            var columnWidth_1 = this._columnWidths[j];
                            var child = children[j];
                            if (child) {
                                var gd = child.layoutData;
                                if (gd.columnSpan > 1) {
                                    for (var k = j + 1; k < gd.columnSpan + j && k < cl; k++) {
                                        columnWidth_1 += this._columnWidths[k];
                                    }
                                }
                                if (gd.rowSpan > 1) {
                                    for (var k = i + 1; k < gd.rowSpan + i && k < rl; k++) {
                                        rowHeight_1 += this._rowHeights[k];
                                        bottom = this._rowBottoms[k];
                                    }
                                }
                                dstArea.width = columnWidth_1;
                                dstArea.height = rowHeight_1;
                                child.layoutArea = dstArea;
                                dstAreaPos.x = left;
                                dstAreaPos.y = bottom;
                                child.layoutAreaPos = dstAreaPos;
                                bottom = oBottom;
                                rowHeight_1 = oRowHeight;
                            }
                        }
                    }
                }
                prim._clearFlags(BABYLON.SmartPropertyPrim.flagLayoutDirty);
            }
        };
        Object.defineProperty(GridPanelLayoutEngine.prototype, "isChildPositionAllowed", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        GridPanelLayoutEngine.prototype._getMaxChildHeightInRow = function (rowNum) {
            var rows = this._rows;
            var cl = this._columns.length;
            var rl = this._rows.length;
            var children = this._children;
            var row = rows[rowNum];
            var maxHeight = 0;
            if (children && children[rowNum]) {
                for (var i = 0; i < cl; i++) {
                    var child = children[rowNum][i];
                    if (child) {
                        var span = child.layoutData.rowSpan;
                        if (maxHeight < child.layoutArea.height / span) {
                            maxHeight = child.layoutArea.height / span;
                        }
                    }
                }
            }
            return maxHeight;
        };
        GridPanelLayoutEngine.prototype._getMaxChildWidthInColumn = function (colNum) {
            var columns = this._columns;
            var cl = this._columns.length;
            var rl = this._rows.length;
            var children = this._children;
            var column = columns[colNum];
            var maxWidth = 0;
            if (children) {
                for (var i = 0; i < rl; i++) {
                    if (children[i]) {
                        var child = children[i][colNum];
                        if (child) {
                            var span = child.layoutData.columnSpan;
                            if (maxWidth < child.layoutArea.width / span) {
                                maxWidth = child.layoutArea.width / span;
                            }
                        }
                    }
                }
            }
            return maxWidth;
        };
        GridPanelLayoutEngine.prototype._updateGrid = function (prim) {
            var _children = this._children;
            //remove prim.children from _children
            for (var i_1 = 0; i_1 < _children.length; i_1++) {
                var children = _children[i_1];
                if (children) {
                    children.length = 0;
                }
            }
            var childrenThatSpan;
            //add prim.children to _children
            for (var _i = 0, _a = prim.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (!child.layoutData) {
                    continue;
                }
                var gd = child.layoutData;
                if (!_children[gd.row]) {
                    _children[gd.row] = [];
                }
                if (gd.columnSpan == 1 && gd.rowSpan == 1) {
                    _children[gd.row][gd.column] = child;
                }
                else {
                    if (!childrenThatSpan) {
                        childrenThatSpan = [];
                    }
                    //when children span, we need to add them to _children whereever they span to so that 
                    //_getMaxChildHeightInRow and _getMaxChildWidthInColumn will work correctly.
                    childrenThatSpan.push(child);
                    for (var i_2 = gd.row; i_2 < gd.row + gd.rowSpan; i_2++) {
                        for (var j = gd.column; j < gd.column + gd.columnSpan; j++) {
                            _children[i_2][j] = child;
                        }
                    }
                }
            }
            var rows = this._rows;
            var columns = this._columns;
            var rl = this._rows.length;
            var cl = this._columns.length;
            //get fixed and auto row heights first
            var starIndexes = [];
            var totalStars = 0;
            var rowHeights = 0;
            var columnWidths = 0;
            for (var i_3 = 0; i_3 < rl; i_3++) {
                var row = this._rows[i_3];
                if (row.heightType == GridDimensionDefinition.Auto) {
                    this._rowHeights[i_3] = this._getMaxChildHeightInRow(i_3);
                    rowHeights += this._rowHeights[i_3];
                }
                else if (row.heightType == GridDimensionDefinition.Pixels) {
                    var maxChildHeight = this._getMaxChildHeightInRow(i_3);
                    this._rowHeights[i_3] = Math.max(row.heightPixels, maxChildHeight);
                    rowHeights += this._rowHeights[i_3];
                }
                else if (row.heightType == GridDimensionDefinition.Stars) {
                    starIndexes.push(i_3);
                    totalStars += row.height;
                }
            }
            //star row heights
            if (starIndexes.length > 0) {
                var remainingHeight = prim.contentArea.height - rowHeights;
                for (var i_4 = 0; i_4 < starIndexes.length; i_4++) {
                    var rowIndex = starIndexes[i_4];
                    var starHeight = (this._rows[rowIndex].height / totalStars) * remainingHeight;
                    var maxChildHeight = this._getMaxChildHeightInRow(i_4);
                    this._rowHeights[rowIndex] = Math.max(starHeight, maxChildHeight);
                }
            }
            //get fixed and auto column widths
            starIndexes.length = 0;
            totalStars = 0;
            for (var i_5 = 0; i_5 < cl; i_5++) {
                var column = this._columns[i_5];
                if (column.widthType == GridDimensionDefinition.Auto) {
                    this._columnWidths[i_5] = this._getMaxChildWidthInColumn(i_5);
                    columnWidths += this._columnWidths[i_5];
                }
                else if (column.widthType == GridDimensionDefinition.Pixels) {
                    var maxChildWidth = this._getMaxChildWidthInColumn(i_5);
                    this._columnWidths[i_5] = Math.max(column.widthPixels, maxChildWidth);
                    columnWidths += this._columnWidths[i_5];
                }
                else if (column.widthType == GridDimensionDefinition.Stars) {
                    starIndexes.push(i_5);
                    totalStars += column.width;
                }
            }
            //star column widths
            if (starIndexes.length > 0) {
                var remainingWidth = prim.contentArea.width - columnWidths;
                for (var i_6 = 0; i_6 < starIndexes.length; i_6++) {
                    var columnIndex = starIndexes[i_6];
                    var starWidth = (this._columns[columnIndex].width / totalStars) * remainingWidth;
                    var maxChildWidth = this._getMaxChildWidthInColumn(i_6);
                    this._columnWidths[columnIndex] = Math.max(starWidth, maxChildWidth);
                }
            }
            var y = 0;
            this._rowBottoms[rl - 1] = y;
            for (var i_7 = rl - 2; i_7 >= 0; i_7--) {
                y += this._rowHeights[i_7 + 1];
                this._rowBottoms[i_7] = y;
            }
            var x = 0;
            this._columnLefts[0] = x;
            for (var i_8 = 1; i_8 < cl; i_8++) {
                x += this._columnWidths[i_8 - 1];
                this._columnLefts[i_8] = x;
            }
            //remove duplicate references to children that span
            if (childrenThatSpan) {
                for (var i = 0; i < childrenThatSpan.length; i++) {
                    var child = childrenThatSpan[i];
                    var gd = child.layoutData;
                    for (var i_9 = gd.row; i_9 < gd.row + gd.rowSpan; i_9++) {
                        for (var j = gd.column; j < gd.column + gd.columnSpan; j++) {
                            if (i_9 == gd.row && j == gd.column) {
                                continue;
                            }
                            if (_children[i_9][j] == child) {
                                _children[i_9][j] = null;
                            }
                        }
                    }
                }
            }
        };
        return GridPanelLayoutEngine;
    }(LayoutEngineBase));
    GridPanelLayoutEngine.dstOffset = BABYLON.Vector4.Zero();
    GridPanelLayoutEngine.dstArea = BABYLON.Size.Zero();
    GridPanelLayoutEngine.dstAreaPos = BABYLON.Vector2.Zero();
    GridPanelLayoutEngine = GridPanelLayoutEngine_1 = __decorate([
        BABYLON.className("GridPanelLayoutEngine", "BABYLON")
        /**
         * A grid panel layout.  Grid panel is a table that has rows and columns.
         * When adding children to a primitive that is using grid panel layout, you must assign a GridData object to the child to indicate where the child will appear in the grid.
         */
    ], GridPanelLayoutEngine);
    BABYLON.GridPanelLayoutEngine = GridPanelLayoutEngine;
    var CanvasLayoutEngine_1, StackPanelLayoutEngine_1, GridPanelLayoutEngine_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.canvas2dLayoutEngine.js.map

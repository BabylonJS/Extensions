var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BABYLON;
(function (BABYLON) {
    /**
     * This class will contains information about a sub picture present in an Atlas Picture.
     */
    var AtlasSubPictureInfo = (function () {
        function AtlasSubPictureInfo() {
        }
        return AtlasSubPictureInfo;
    }());
    BABYLON.AtlasSubPictureInfo = AtlasSubPictureInfo;
    /**
     * This class represent an Atlas Picture, it contains the information of all the sub pictures and the Texture that stores the bitmap.
     * You get an instance of this class using methods of the AtlasPictureInfoFactory
     */
    var AtlasPictureInfo = (function () {
        function AtlasPictureInfo() {
        }
        /**
         * Creates many sprite from the Atlas Picture
         * @param filterCallback a predicate if true is returned then the corresponding sub picture will be used to create a sprite.
         * The Predicate has many parameters:
         *  - index: just an index incremented at each sub picture submitted for Sprite creation
         *  - name: the sub picture's name
         *  - aspi: the AtlasSubPictureInfo corresponding to the submitted sub picture
         *  - settings: the Sprite2D creation settings, you can alter this JSON object but BEWARE, the alterations will be kept for subsequent Sprite2D creations!
         * @param spriteSettings The Sprite2D settings to use for Sprite creation, this JSON object will be passed to the filterCallback for you to alter it, if needed.
         */
        AtlasPictureInfo.prototype.createSprites = function (filterCallback, spriteSettings) {
            var _this = this;
            var res = new Array();
            var index = 0;
            this.subPictures.forEach(function (k, v) {
                if (!filterCallback || filterCallback(index++, k, v, spriteSettings)) {
                    var s = _this.createSprite(k, spriteSettings);
                    if (s) {
                        res.push(s);
                    }
                }
            });
            return res;
        };
        /**
         * Create one Sprite from a sub picture
         * @param subPictureName the name of the sub picture to use
         * @param spriteSettings the Sprite2D settings to use for the Sprite instance creation
         */
        AtlasPictureInfo.prototype.createSprite = function (subPictureName, spriteSettings) {
            var spi = this.subPictures.get(subPictureName);
            if (!spi) {
                return null;
            }
            if (!spriteSettings) {
                spriteSettings = {};
            }
            var s = spriteSettings;
            s.id = subPictureName;
            s.spriteLocation = spi.location;
            s.spriteSize = spi.size;
            var sprite = new BABYLON.Sprite2D(this.texture, spriteSettings);
            return sprite;
        };
        return AtlasPictureInfo;
    }());
    BABYLON.AtlasPictureInfo = AtlasPictureInfo;
    /**
     * This if the Factory class containing static method to create Atlas Pictures Info objects or add new loaders
     */
    var AtlasPictureInfoFactory = (function () {
        function AtlasPictureInfoFactory() {
        }
        /**
         * Add a custom loader
         * @param fileExtension must be the file extension (without the dot) of the file that is loaded by this loader (e.g.: json)
         * @param plugin the instance of the loader
         */
        AtlasPictureInfoFactory.addLoader = function (fileExtension, plugin) {
            var a = AtlasPictureInfoFactory.plugins.getOrAddWithFactory(fileExtension.toLocaleLowerCase(), function () { return new Array(); });
            a.push(plugin);
        };
        /**
         * Load an Atlas Picture Info object from a data file at a given url and with a given texture
         * @param texture the texture containing the atlas bitmap
         * @param url the URL of the Atlas Info data file
         * @param onLoad a callback that will be called when the AtlasPictureInfo object will be loaded and ready
         * @param onError a callback that will be called in case of error
         */
        AtlasPictureInfoFactory.loadFromUrl = function (texture, url, onLoad, onError) {
            if (onError === void 0) { onError = null; }
            BABYLON.Tools.LoadFile(url, function (data) {
                var ext = url.split('.').pop().split(/\#|\?/)[0];
                var plugins = AtlasPictureInfoFactory.plugins.get(ext.toLocaleLowerCase());
                if (!plugins) {
                    if (onError) {
                        onError("couldn't find a plugin for this file extension", -1);
                    }
                    return;
                }
                for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
                    var p = plugins_1[_i];
                    var ret = p.loadFile(data);
                    if (ret) {
                        if (ret.api) {
                            ret.api.texture = texture;
                            if (onLoad) {
                                onLoad(ret.api);
                            }
                        }
                        else if (onError) {
                            onError(ret.errorMsg, ret.errorCode);
                        }
                        return;
                    }
                }
                if (onError) {
                    onError("No plugin to load this Atlas Data file format", -1);
                }
            }, null, null, null, function () {
                if (onError) {
                    onError("Couldn't load file", -1);
                }
            });
            return null;
        };
        return AtlasPictureInfoFactory;
    }());
    AtlasPictureInfoFactory.plugins = new BABYLON.StringDictionary();
    BABYLON.AtlasPictureInfoFactory = AtlasPictureInfoFactory;
    // Loader class for the TexturePacker's JSON Array data format
    var JSONArrayLoader = JSONArrayLoader_1 = (function () {
        function JSONArrayLoader() {
        }
        JSONArrayLoader.prototype.loadFile = function (content) {
            var errorMsg = null;
            var errorCode = 0;
            var root = null;
            var api = null;
            try {
                var frames_1;
                var meta = void 0;
                try {
                    root = JSON.parse(content);
                    frames_1 = root.frames;
                    meta = root.meta;
                    if (!frames_1 || !meta) {
                        throw Error("Not a JSON Array file format");
                    }
                }
                catch (ex1) {
                    return null;
                }
                api = new AtlasPictureInfo();
                api.atlasSize = new BABYLON.Size(meta.size.w, meta.size.h);
                api.subPictures = new BABYLON.StringDictionary();
                for (var _i = 0, frames_2 = frames_1; _i < frames_2.length; _i++) {
                    var f = frames_2[_i];
                    var aspi = new AtlasSubPictureInfo();
                    aspi.name = f.filename;
                    aspi.location = new BABYLON.Vector2(f.frame.x, api.atlasSize.height - (f.frame.y + f.frame.h));
                    aspi.size = new BABYLON.Size(f.frame.w, f.frame.h);
                    api.subPictures.add(aspi.name, aspi);
                }
            }
            catch (ex2) {
                errorMsg = "Unknown Exception: " + ex2;
                errorCode = -2;
            }
            return { api: api, errorMsg: errorMsg, errorCode: errorCode };
        };
        return JSONArrayLoader;
    }());
    JSONArrayLoader = JSONArrayLoader_1 = __decorate([
        AtlasLoaderPlugin("json", new JSONArrayLoader_1())
    ], JSONArrayLoader);
    /**
     * Use this decorator when you declare an Atlas Loader Class for the loader to register itself automatically.
     * @param fileExtension the extension of the file that the plugin is loading (there can be many plugin for the same extension)
     * @param plugin an instance of the plugin class to add to the AtlasPictureInfoFactory
     */
    function AtlasLoaderPlugin(fileExtension, plugin) {
        return function () {
            AtlasPictureInfoFactory.addLoader(fileExtension, plugin);
        };
    }
    BABYLON.AtlasLoaderPlugin = AtlasLoaderPlugin;
    var JSONArrayLoader_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.atlasPicture.js.map

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
    /**
     * This class given information about a given character.
     */
    var CharInfo = (function () {
        function CharInfo() {
        }
        return CharInfo;
    }());
    BABYLON.CharInfo = CharInfo;
    /**
     * This is an abstract base class to hold a Texture that will contain a FontMap
     */
    var BaseFontTexture = (function (_super) {
        __extends(BaseFontTexture, _super);
        function BaseFontTexture(url, scene, noMipmap, invertY, samplingMode, premultipliedAlpha) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (invertY === void 0) { invertY = true; }
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (premultipliedAlpha === void 0) { premultipliedAlpha = false; }
            var _this = _super.call(this, url, scene, noMipmap, invertY, samplingMode) || this;
            _this._cachedFontId = null;
            _this._charInfos = new BABYLON.StringDictionary();
            _this._isPremultipliedAlpha = premultipliedAlpha;
            return _this;
        }
        Object.defineProperty(BaseFontTexture.prototype, "isSuperSampled", {
            /**
             * Is the Font is using Super Sampling (each font texel is doubled).
             */
            get: function () {
                return this._superSample;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFontTexture.prototype, "isSignedDistanceField", {
            /**
             * Is the Font was rendered using the Signed Distance Field algorithm
             * @returns {}
             */
            get: function () {
                return this._signedDistanceField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFontTexture.prototype, "isPremultipliedAlpha", {
            /**
             * True if the font was drawn using multiplied alpha
             */
            get: function () {
                return this._isPremultipliedAlpha;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFontTexture.prototype, "spaceWidth", {
            /**
             * Get the Width (in pixel) of the Space character
             */
            get: function () {
                return this._spaceWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFontTexture.prototype, "lineHeight", {
            /**
             * Get the Line height (in pixel)
             */
            get: function () {
                return this._lineHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Measure the width/height that will take a given text
         * @param text the text to measure
         * @param tabulationSize the size (in space character) of the tabulation character, default value must be 4
         */
        BaseFontTexture.prototype.measureText = function (text, tabulationSize) {
            var maxWidth = 0;
            var curWidth = 0;
            var lineCount = 1;
            var charxpos = 0;
            // Parse each char of the string
            for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
                var char = text_1[_i];
                // Next line feed?
                if (char === "\n") {
                    maxWidth = Math.max(maxWidth, curWidth);
                    charxpos = 0;
                    curWidth = 0;
                    ++lineCount;
                    continue;
                }
                // Tabulation ?
                if (char === "\t") {
                    var nextPos = charxpos + tabulationSize;
                    nextPos = nextPos - (nextPos % tabulationSize);
                    curWidth += (nextPos - charxpos) * this.spaceWidth;
                    charxpos = nextPos;
                    continue;
                }
                if (char < " ") {
                    continue;
                }
                var ci = this.getChar(char);
                if (!ci) {
                    throw new Error("Character " + char + " is not supported by FontTexture " + this.name);
                }
                curWidth += ci.charWidth;
                ++charxpos;
            }
            maxWidth = Math.max(maxWidth, curWidth);
            return new BABYLON.Size(maxWidth, lineCount * this.lineHeight);
        };
        return BaseFontTexture;
    }(BABYLON.Texture));
    BABYLON.BaseFontTexture = BaseFontTexture;
    var BitmapFontInfo = (function () {
        function BitmapFontInfo() {
            this.kerningDic = new BABYLON.StringDictionary();
            this.charDic = new BABYLON.StringDictionary();
        }
        return BitmapFontInfo;
    }());
    BABYLON.BitmapFontInfo = BitmapFontInfo;
    var BitmapFontTexture = (function (_super) {
        __extends(BitmapFontTexture, _super);
        function BitmapFontTexture(scene, bmFontUrl, textureUrl, noMipmap, invertY, samplingMode, premultipliedAlpha, onLoad, onError) {
            if (textureUrl === void 0) { textureUrl = null; }
            if (noMipmap === void 0) { noMipmap = false; }
            if (invertY === void 0) { invertY = true; }
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (premultipliedAlpha === void 0) { premultipliedAlpha = false; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            var _this = _super.call(this, null, scene, noMipmap, invertY, samplingMode, premultipliedAlpha) || this;
            _this._usedCounter = 1;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var ext = bmFontUrl.split('.').pop().split(/\#|\?/)[0];
                        var plugins = BitmapFontTexture.plugins.get(ext.toLocaleLowerCase());
                        if (!plugins) {
                            if (onError) {
                                onError("couldn't find a plugin for this file extension", -1);
                            }
                            return;
                        }
                        var _loop_1 = function (p) {
                            var ret = p.loadFont(xhr.response, scene, invertY);
                            if (ret) {
                                var bfi = ret.bfi;
                                if (textureUrl != null) {
                                    bfi.textureUrl = textureUrl;
                                }
                                else {
                                    var baseUrl = bmFontUrl.substr(0, bmFontUrl.lastIndexOf("/") + 1);
                                    bfi.textureUrl = baseUrl + bfi.textureFile;
                                }
                                _this._texture = scene.getEngine().createTexture(bfi.textureUrl, noMipmap, invertY, scene, samplingMode, function () {
                                    if (ret.bfi && onLoad) {
                                        onLoad();
                                    }
                                });
                                _this._lineHeight = bfi.lineHeight;
                                _this._charInfos.copyFrom(bfi.charDic);
                                var ci = _this.getChar(" ");
                                if (ci) {
                                    _this._spaceWidth = ci.charWidth;
                                }
                                else {
                                    _this._charInfos.first(function (k, v) { return _this._spaceWidth = v.charWidth; });
                                }
                                if (!ret.bfi && onError) {
                                    onError(ret.errorMsg, ret.errorCode);
                                }
                                return { value: void 0 };
                            }
                        };
                        for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
                            var p = plugins_1[_i];
                            var state_1 = _loop_1(p);
                            if (typeof state_1 === "object")
                                return state_1.value;
                        }
                        if (onError) {
                            onError("No plugin to load this BMFont file format", -1);
                        }
                    }
                    else {
                        if (onError) {
                            onError("Couldn't load file through HTTP Request, HTTP Status " + xhr.status, xhr.status);
                        }
                    }
                }
            };
            xhr.open("GET", bmFontUrl, true);
            xhr.send();
            return _this;
        }
        BitmapFontTexture.GetCachedFontTexture = function (scene, fontTexture) {
            var dic = scene.getOrAddExternalDataWithFactory("BitmapFontTextureCache", function () { return new BABYLON.StringDictionary(); });
            var ft = dic.get(fontTexture.uid);
            if (ft) {
                ++ft._usedCounter;
                return ft;
            }
            dic.add(fontTexture.uid, fontTexture);
            return ft;
        };
        BitmapFontTexture.ReleaseCachedFontTexture = function (scene, fontTexture) {
            var dic = scene.getExternalData("BitmapFontTextureCache");
            if (!dic) {
                return;
            }
            var font = dic.get(fontTexture.uid);
            if (--font._usedCounter === 0) {
                dic.remove(fontTexture.uid);
                font.dispose();
            }
        };
        Object.defineProperty(BitmapFontTexture.prototype, "isDynamicFontTexture", {
            /**
             * Is the font dynamically updated, if true is returned then you have to call the update() before using the font in rendering if new character were adding using getChar()
             */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * This method does nothing for a BitmapFontTexture object as it's a static texture
         */
        BitmapFontTexture.prototype.update = function () {
        };
        /**
         * Retrieve the CharInfo object for a given character
         * @param char the character to retrieve the CharInfo object from (e.g.: "A", "a", etc.)
         */
        BitmapFontTexture.prototype.getChar = function (char) {
            return this._charInfos.get(char);
        };
        /**
         * For FontTexture retrieved using GetCachedFontTexture, use this method when you transfer this object's lifetime to another party in order to share this resource.
         * When the other party is done with this object, decCachedFontTextureCounter must be called.
         */
        BitmapFontTexture.prototype.incCachedFontTextureCounter = function () {
            ++this._usedCounter;
        };
        /**
         * Use this method only in conjunction with incCachedFontTextureCounter, call it when you no longer need to use this shared resource.
         */
        BitmapFontTexture.prototype.decCachedFontTextureCounter = function () {
            var dic = this.getScene().getExternalData("BitmapFontTextureCache");
            if (!dic) {
                return;
            }
            if (--this._usedCounter === 0) {
                dic.remove(this._cachedFontId);
                this.dispose();
            }
        };
        BitmapFontTexture.addLoader = function (fileExtension, plugin) {
            var a = BitmapFontTexture.plugins.getOrAddWithFactory(fileExtension.toLocaleLowerCase(), function () { return new Array(); });
            a.push(plugin);
        };
        return BitmapFontTexture;
    }(BaseFontTexture));
    BitmapFontTexture.plugins = new BABYLON.StringDictionary();
    BABYLON.BitmapFontTexture = BitmapFontTexture;
    /**
     * This class is a special kind of texture which generates on the fly characters of a given css style "fontName".
     * The generated texture will be updated when new characters will be retrieved using the getChar() method, but you have
     *  to call the update() method for the texture to fetch these changes, you can harmlessly call update any time you want, if no
     *  change were made, nothing will happen.
     * The Font Texture can be rendered in three modes: normal size, super sampled size (x2) or using Signed Distance Field rendering.
     * Signed Distance Field should be prefered because the texture can be rendered using AlphaTest instead of Transparency, which is way more faster. More about SDF here (http://www.valvesoftware.com/publications/2007/SIGGRAPH2007_AlphaTestedMagnification.pdf).
     * The only flaw of SDF is that the rendering quality may not be the best or the edges too sharp is the font thickness is too thin.
     */
    var FontTexture = (function (_super) {
        __extends(FontTexture, _super);
        /**
         * Create a new instance of the FontTexture class
         * @param name the name of the texture
         * @param font the font to use, use the W3C CSS notation
         * @param scene the scene that owns the texture
         * @param maxCharCount the approximative maximum count of characters that could fit in the texture. This is an approximation because most of the fonts are proportional (each char has its own Width). The 'W' character's width is used to compute the size of the texture based on the given maxCharCount
         * @param samplingMode the texture sampling mode
         * @param superSample if true the FontTexture will be created with a font of a size twice bigger than the given one but all properties (lineHeight, charWidth, etc.) will be according to the original size. This is made to improve the text quality.
         */
        function FontTexture(name, font, scene, maxCharCount, samplingMode, superSample, signedDistanceField) {
            if (maxCharCount === void 0) { maxCharCount = 200; }
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (superSample === void 0) { superSample = false; }
            if (signedDistanceField === void 0) { signedDistanceField = false; }
            var _this = _super.call(this, null, scene, true, false, samplingMode) || this;
            _this._curCharCount = 0;
            _this._lastUpdateCharCount = -1;
            _this._usedCounter = 1;
            _this.name = name;
            _this.debugMode = false;
            _this.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            _this.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            _this._sdfScale = 8;
            _this._signedDistanceField = signedDistanceField;
            _this._superSample = false;
            _this._isPremultipliedAlpha = !signedDistanceField;
            _this.name = "FontTexture " + font;
            // SDF will use super sample no matter what, the resolution is otherwise too poor to produce correct result
            if (superSample || signedDistanceField) {
                var sfont = _this.getSuperSampleFont(font);
                if (sfont) {
                    _this._superSample = true;
                    font = sfont;
                }
            }
            // First canvas creation to determine the size of the texture to create
            _this._canvas = document.createElement("canvas");
            _this._context = _this._canvas.getContext("2d");
            _this._context.font = font;
            _this._context.fillStyle = "white";
            _this._context.textBaseline = "top";
            var res = _this.getFontHeight(font, "j$|");
            _this._lineHeightSuper = res.height; //+4;
            _this._lineHeight = _this._superSample ? (Math.ceil(_this._lineHeightSuper / 2)) : _this._lineHeightSuper;
            _this._offset = res.offset;
            res = _this.getFontHeight(font, "f");
            _this._baseLine = res.height + res.offset - _this._offset;
            var maxCharWidth = Math.max(_this._context.measureText("W").width, _this._context.measureText("_").width);
            _this._spaceWidthSuper = _this._context.measureText(" ").width;
            _this._spaceWidth = _this._superSample ? (_this._spaceWidthSuper / 2) : _this._spaceWidthSuper;
            _this._xMargin = Math.ceil(maxCharWidth / 32);
            _this._yMargin = _this._xMargin;
            // This is an approximate size, but should always be able to fit at least the maxCharCount
            var totalEstSurface = (Math.ceil(_this._lineHeightSuper) + (_this._yMargin * 2)) * (Math.ceil(maxCharWidth) + (_this._xMargin * 2)) * maxCharCount;
            var edge = Math.sqrt(totalEstSurface);
            var textSize = Math.pow(2, Math.ceil(Math.log(edge) / Math.log(2)));
            // Create the texture that will store the font characters
            _this._texture = scene.getEngine().createDynamicTexture(textSize, textSize, false, samplingMode);
            var textureSize = _this.getSize();
            _this.hasAlpha = _this._signedDistanceField === false;
            // Recreate a new canvas with the final size: the one matching the texture (resizing the previous one doesn't work as one would expect...)
            _this._canvas = document.createElement("canvas");
            _this._canvas.width = textureSize.width;
            _this._canvas.height = textureSize.height;
            _this._context = _this._canvas.getContext("2d");
            _this._context.textBaseline = "top";
            _this._context.font = font;
            _this._context.fillStyle = "white";
            _this._context.imageSmoothingEnabled = false;
            _this._context.clearRect(0, 0, textureSize.width, textureSize.height);
            // Create a canvas for the signed distance field mode, we only have to store one char, the purpose is to render a char scaled _sdfScale times
            //  into this 2D context, then get the bitmap data, create the SDF char and push the result in the _context (which hold the whole Font Texture content)
            // So you can see this context as an intermediate one, because it is.
            if (_this._signedDistanceField) {
                var sdfC = document.createElement("canvas");
                var s = _this._sdfScale;
                sdfC.width = (Math.ceil(maxCharWidth) + _this._xMargin * 2) * s;
                sdfC.height = (Math.ceil(_this._lineHeightSuper) + _this._yMargin * 2) * s;
                var sdfCtx = sdfC.getContext("2d");
                sdfCtx.scale(s, s);
                sdfCtx.textBaseline = "top";
                sdfCtx.font = font;
                sdfCtx.fillStyle = "white";
                sdfCtx.imageSmoothingEnabled = false;
                _this._sdfCanvas = sdfC;
                _this._sdfContext = sdfCtx;
            }
            _this._currentFreePosition = BABYLON.Vector2.Zero();
            // Add the basic ASCII based characters                                                               
            for (var i = 0x20; i < 0x7F; i++) {
                var c = String.fromCharCode(i);
                _this.getChar(c);
            }
            _this.update();
            return _this;
            //this._saveToImage("");
        }
        Object.defineProperty(FontTexture.prototype, "isDynamicFontTexture", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        FontTexture.GetCachedFontTexture = function (scene, fontName, supersample, signedDistanceField, bilinearFiltering) {
            if (supersample === void 0) { supersample = false; }
            if (signedDistanceField === void 0) { signedDistanceField = false; }
            if (bilinearFiltering === void 0) { bilinearFiltering = false; }
            var dic = scene.getOrAddExternalDataWithFactory("FontTextureCache", function () { return new BABYLON.StringDictionary(); });
            var lfn = fontName.toLocaleLowerCase() + (supersample ? "_+SS" : "_-SS") + (signedDistanceField ? "_+SDF" : "_-SDF") + (bilinearFiltering ? "_+BF" : "_-BF");
            var ft = dic.get(lfn);
            if (ft) {
                ++ft._usedCounter;
                return ft;
            }
            ft = new FontTexture(null, fontName, scene, supersample ? 100 : 200, (signedDistanceField || bilinearFiltering) ? BABYLON.Texture.BILINEAR_SAMPLINGMODE : BABYLON.Texture.NEAREST_SAMPLINGMODE, supersample, signedDistanceField);
            ft._cachedFontId = lfn;
            dic.add(lfn, ft);
            return ft;
        };
        FontTexture.ReleaseCachedFontTexture = function (scene, fontName, supersample, signedDistanceField, bilinearFiltering) {
            if (supersample === void 0) { supersample = false; }
            if (signedDistanceField === void 0) { signedDistanceField = false; }
            if (bilinearFiltering === void 0) { bilinearFiltering = false; }
            var dic = scene.getExternalData("FontTextureCache");
            if (!dic) {
                return;
            }
            var lfn = fontName.toLocaleLowerCase() + (supersample ? "_+SS" : "_-SS") + (signedDistanceField ? "_+SDF" : "_-SDF") + (bilinearFiltering ? "_+BF" : "_-BF");
            var font = dic.get(lfn);
            if (--font._usedCounter === 0) {
                dic.remove(lfn);
                font.dispose();
            }
        };
        FontTexture.prototype._saveToImage = function (url) {
            var base64Image = this._canvas.toDataURL("image/png");
            //Creating a link if the browser have the download attribute on the a tag, to automatically start download generated image.
            if (("download" in document.createElement("a"))) {
                var a = window.document.createElement("a");
                a.href = base64Image;
                var date = new Date();
                var stringDate = (date.getFullYear() + "-" + (date.getMonth() + 1)).slice(-2) +
                    "-" +
                    date.getDate() +
                    "_" +
                    date.getHours() +
                    "-" +
                    ('0' + date.getMinutes()).slice(-2);
                a.setAttribute("download", "screenshot_" + stringDate + ".png");
                window.document.body.appendChild(a);
                a.addEventListener("click", function () {
                    a.parentElement.removeChild(a);
                });
                a.click();
                //Or opening a new tab with the image if it is not possible to automatically start download.
            }
            else {
                var newWindow = window.open("");
                var img = newWindow.document.createElement("img");
                img.src = base64Image;
                newWindow.document.body.appendChild(img);
            }
        };
        /**
         * Make sure the given char is present in the font map.
         * @param char the character to get or add
         * @return the CharInfo instance corresponding to the given character
         */
        FontTexture.prototype.getChar = function (char) {
            var _this = this;
            if (char.length !== 1) {
                return null;
            }
            var info = this._charInfos.get(char);
            if (info) {
                return info;
            }
            info = new CharInfo();
            var measure = this._context.measureText(char);
            var textureSize = this.getSize();
            // we reached the end of the current line?
            var width = Math.ceil(measure.width + 0.5);
            if (this._currentFreePosition.x + width + this._xMargin > textureSize.width) {
                this._currentFreePosition.x = 0;
                this._currentFreePosition.y += Math.ceil(this._lineHeightSuper + this._yMargin * 2);
                // No more room?
                if (this._currentFreePosition.y > textureSize.height) {
                    return this.getChar("!");
                }
            }
            var curPosX = this._currentFreePosition.x + 0.5;
            var curPosY = this._currentFreePosition.y + 0.5;
            var curPosXMargin = curPosX + this._xMargin;
            var curPosYMargin = curPosY + this._yMargin;
            var drawDebug = function (ctx) {
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.rect(curPosXMargin, curPosYMargin, width, _this._lineHeightSuper);
                ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = "blue";
                ctx.beginPath();
                ctx.moveTo(curPosXMargin, curPosYMargin + Math.round(_this._baseLine));
                ctx.lineTo(curPosXMargin + width, curPosYMargin + Math.round(_this._baseLine));
                ctx.closePath();
                ctx.stroke();
            };
            // In SDF mode we render the character in an intermediate 2D context which scale the character this._sdfScale times (which is required to compute the SDF map accurately)
            if (this._signedDistanceField) {
                var s = this._sdfScale;
                this._sdfContext.clearRect(0, 0, this._sdfCanvas.width, this._sdfCanvas.height);
                // Coordinates are subject to the context's scale
                this._sdfContext.fillText(char, this._xMargin + 0.5, this._yMargin + 0.5 - this._offset);
                // Canvas Pixel Coordinates, no scale
                var data = this._sdfContext.getImageData(0, 0, (width + (this._xMargin * 2)) * s, this._sdfCanvas.height);
                var res = this._computeSDFChar(data);
                this._context.putImageData(res, curPosX, curPosY);
                if (this.debugMode) {
                    drawDebug(this._context);
                }
            }
            else {
                if (this.debugMode) {
                    drawDebug(this._context);
                }
                // Draw the character in the HTML canvas
                this._context.fillText(char, curPosXMargin, curPosYMargin - this._offset);
                // Premul Alpha manually
                var id = this._context.getImageData(curPosXMargin, curPosYMargin, width, this._lineHeightSuper);
                for (var i = 0; i < id.data.length; i += 4) {
                    var v = id.data[i + 3];
                    if (v > 0 && v < 255) {
                        id.data[i + 0] = v;
                        id.data[i + 1] = v;
                        id.data[i + 2] = v;
                        id.data[i + 3] = v;
                    }
                }
                this._context.putImageData(id, curPosXMargin, curPosYMargin);
            }
            // Fill the CharInfo object
            info.topLeftUV = new BABYLON.Vector2((curPosXMargin - 0.5) / textureSize.width, (this._currentFreePosition.y - 0.5 + this._yMargin) / textureSize.height);
            info.bottomRightUV = new BABYLON.Vector2((curPosXMargin - 0.5 + width) / textureSize.width, info.topLeftUV.y + (this._lineHeightSuper / textureSize.height));
            info.yOffset = info.xOffset = 0;
            //console.log(`Char: ${char}, Offset: ${curPosX}, ${this._currentFreePosition.y + this._yMargin}, Size: ${width}, ${this._lineHeightSuper}, UV: ${info.topLeftUV}, ${info.bottomRightUV}`);
            if (this._signedDistanceField) {
                var off = 1 / textureSize.width;
                info.topLeftUV.addInPlace(new BABYLON.Vector2(off, off));
                info.bottomRightUV.addInPlace(new BABYLON.Vector2(off, off));
            }
            info.charWidth = this._superSample ? (width / 2) : width;
            info.xAdvance = info.charWidth;
            // Add the info structure
            this._charInfos.add(char, info);
            this._curCharCount++;
            // Set the next position
            this._currentFreePosition.x += Math.ceil(width + this._xMargin * 2);
            return info;
        };
        FontTexture.prototype._computeSDFChar = function (source) {
            var scl = this._sdfScale;
            var sw = source.width;
            var sh = source.height;
            var dw = sw / scl;
            var dh = sh / scl;
            var roffx = 0;
            var roffy = 0;
            // We shouldn't look beyond half of the biggest between width and height
            var radius = scl;
            var br = radius - 1;
            var lookupSrc = function (dx, dy, offX, offY, lookVis) {
                var sx = dx * scl;
                var sy = dy * scl;
                // Looking out of the area? return true to make the test going on
                if (((sx + offX) < 0) || ((sx + offX) >= sw) || ((sy + offY) < 0) || ((sy + offY) >= sh)) {
                    return true;
                }
                // Get the pixel we want
                var val = source.data[(((sy + offY) * sw) + (sx + offX)) * 4];
                var res = (val > 0) === lookVis;
                if (!res) {
                    roffx = offX;
                    roffy = offY;
                }
                return res;
            };
            var lookupArea = function (dx, dy, lookVis) {
                // Fast rejection test, if we have the same result in N, S, W, E at a distance which is the radius-1 then it means the data will be consistent in this area. That's because we've scale the rendering of the letter "radius" times, so a letter's pixel will be at least radius wide
                if (lookupSrc(dx, dy, 0, br, lookVis) &&
                    lookupSrc(dx, dy, 0, -br, lookVis) &&
                    lookupSrc(dx, dy, -br, 0, lookVis) &&
                    lookupSrc(dx, dy, br, 0, lookVis)) {
                    return 0;
                }
                for (var i = 1; i <= radius; i++) {
                    // Quick test N, S, W, E
                    if (!lookupSrc(dx, dy, 0, i, lookVis) || !lookupSrc(dx, dy, 0, -i, lookVis) || !lookupSrc(dx, dy, -i, 0, lookVis) || !lookupSrc(dx, dy, i, 0, lookVis)) {
                        return i * i; // Squared Distance is simple to compute in this case
                    }
                    // Test the frame area (except the N, S, W, E spots) from the nearest point from the center to the further one
                    for (var j = 1; j <= i; j++) {
                        if (!lookupSrc(dx, dy, -j, i, lookVis) || !lookupSrc(dx, dy, j, i, lookVis) ||
                            !lookupSrc(dx, dy, i, -j, lookVis) || !lookupSrc(dx, dy, i, j, lookVis) ||
                            !lookupSrc(dx, dy, -j, -i, lookVis) || !lookupSrc(dx, dy, j, -i, lookVis) ||
                            !lookupSrc(dx, dy, -i, -j, lookVis) || !lookupSrc(dx, dy, -i, j, lookVis)) {
                            // We found the nearest texel having and opposite state, store the squared length
                            var res_1 = (i * i) + (j * j);
                            var count = 1;
                            // To improve quality we will  sample the texels around this one, so it's 8 samples, we consider only the one having an opposite state, add them to the current res and will will compute the average at the end
                            if (!lookupSrc(dx, dy, roffx - 1, roffy, lookVis)) {
                                res_1 += (roffx - 1) * (roffx - 1) + roffy * roffy;
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx + 1, roffy, lookVis)) {
                                res_1 += (roffx + 1) * (roffx + 1) + roffy * roffy;
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx, roffy - 1, lookVis)) {
                                res_1 += roffx * roffx + (roffy - 1) * (roffy - 1);
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx, roffy + 1, lookVis)) {
                                res_1 += roffx * roffx + (roffy + 1) * (roffy + 1);
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx - 1, roffy - 1, lookVis)) {
                                res_1 += (roffx - 1) * (roffx - 1) + (roffy - 1) * (roffy - 1);
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx + 1, roffy + 1, lookVis)) {
                                res_1 += (roffx + 1) * (roffx + 1) + (roffy + 1) * (roffy + 1);
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx + 1, roffy - 1, lookVis)) {
                                res_1 += (roffx + 1) * (roffx + 1) + (roffy - 1) * (roffy - 1);
                                ++count;
                            }
                            if (!lookupSrc(dx, dy, roffx - 1, roffy + 1, lookVis)) {
                                res_1 += (roffx - 1) * (roffx - 1) + (roffy + 1) * (roffy + 1);
                                ++count;
                            }
                            // Compute the average based on the accumulated distance
                            return res_1 / count;
                        }
                    }
                }
                return 0;
            };
            var tmp = new Array(dw * dh);
            for (var y = 0; y < dh; y++) {
                for (var x = 0; x < dw; x++) {
                    var curState = lookupSrc(x, y, 0, 0, true);
                    var d = lookupArea(x, y, curState);
                    if (d === 0) {
                        d = radius * radius * 2;
                    }
                    tmp[(y * dw) + x] = curState ? d : -d;
                }
            }
            var res = this._context.createImageData(dw, dh);
            var size = dw * dh;
            for (var j = 0; j < size; j++) {
                var d = tmp[j];
                var sign = (d < 0) ? -1 : 1;
                d = Math.sqrt(Math.abs(d)) * sign;
                d *= 127.5 / radius;
                d += 127.5;
                if (d < 0) {
                    d = 0;
                }
                else if (d > 255) {
                    d = 255;
                }
                d += 0.5;
                res.data[j * 4 + 0] = d;
                res.data[j * 4 + 1] = d;
                res.data[j * 4 + 2] = d;
                res.data[j * 4 + 3] = 255;
            }
            return res;
        };
        FontTexture.prototype.getSuperSampleFont = function (font) {
            // Eternal thank to http://stackoverflow.com/a/10136041/802124
            var regex = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\sa-z]+?)\s*$/;
            var res = font.toLocaleLowerCase().match(regex);
            if (res == null) {
                return null;
            }
            var size = parseInt(res[4]);
            res[4] = (size * 2).toString() + (res[4].match(/\D+/) || []).pop();
            var newFont = "";
            for (var j = 1; j < res.length; j++) {
                if (res[j] != null) {
                    newFont += res[j] + " ";
                }
            }
            return newFont;
        };
        // More info here: https://videlais.com/2014/03/16/the-many-and-varied-problems-with-measuring-font-height-for-html5-canvas/
        FontTexture.prototype.getFontHeight = function (font, chars) {
            var fontDraw = document.createElement("canvas");
            fontDraw.width = 600;
            fontDraw.height = 600;
            var ctx = fontDraw.getContext('2d');
            ctx.fillRect(0, 0, fontDraw.width, fontDraw.height);
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'white';
            ctx.font = font;
            ctx.fillText(chars, 0, 0);
            var pixels = ctx.getImageData(0, 0, fontDraw.width, fontDraw.height).data;
            var start = -1;
            var end = -1;
            for (var row = 0; row < fontDraw.height; row++) {
                for (var column = 0; column < fontDraw.width; column++) {
                    var index = (row * fontDraw.width + column) * 4;
                    var pix = pixels[index];
                    if (pix === 0) {
                        if (column === fontDraw.width - 1 && start !== -1) {
                            end = row;
                            row = fontDraw.height;
                            break;
                        }
                        continue;
                    }
                    else {
                        if (start === -1) {
                            start = row;
                        }
                        break;
                    }
                }
            }
            return { height: (end - start) + 1, offset: start };
        };
        Object.defineProperty(FontTexture.prototype, "canRescale", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        FontTexture.prototype.getContext = function () {
            return this._context;
        };
        /**
         * Call this method when you've call getChar() at least one time, this will update the texture if needed.
         * Don't be afraid to call it, if no new character was added, this method simply does nothing.
         */
        FontTexture.prototype.update = function () {
            // Update only if there's new char added since the previous update
            if (this._lastUpdateCharCount < this._curCharCount) {
                this.getScene().getEngine().updateDynamicTexture(this._texture, this._canvas, false, true);
                this._lastUpdateCharCount = this._curCharCount;
            }
        };
        // cloning should be prohibited, there's no point to duplicate this texture at all
        FontTexture.prototype.clone = function () {
            return null;
        };
        /**
         * For FontTexture retrieved using GetCachedFontTexture, use this method when you transfer this object's lifetime to another party in order to share this resource.
         * When the other party is done with this object, decCachedFontTextureCounter must be called.
         */
        FontTexture.prototype.incCachedFontTextureCounter = function () {
            ++this._usedCounter;
        };
        /**
         * Use this method only in conjunction with incCachedFontTextureCounter, call it when you no longer need to use this shared resource.
         */
        FontTexture.prototype.decCachedFontTextureCounter = function () {
            var dic = this.getScene().getExternalData("FontTextureCache");
            if (!dic) {
                return;
            }
            if (--this._usedCounter === 0) {
                dic.remove(this._cachedFontId);
                this.dispose();
            }
        };
        return FontTexture;
    }(BaseFontTexture));
    BABYLON.FontTexture = FontTexture;
    /**
     * Orginial code from cocos2d-js, converted to TypeScript by Nockawa
     * Load the Text version of the BMFont format, no XML or binary supported, just plain old text
     */
    var BMFontLoaderTxt = BMFontLoaderTxt_1 = (function () {
        function BMFontLoaderTxt() {
        }
        BMFontLoaderTxt.prototype._parseStrToObj = function (str) {
            var arr = str.match(BMFontLoaderTxt_1.ITEM_EXP);
            if (!arr) {
                return null;
            }
            var obj = {};
            for (var i = 0, li = arr.length; i < li; i++) {
                var tempStr = arr[i];
                var index = tempStr.indexOf("=");
                var key = tempStr.substring(0, index);
                var value = tempStr.substring(index + 1);
                if (value.match(BMFontLoaderTxt_1.INT_EXP))
                    value = parseInt(value);
                else if (value[0] === '"')
                    value = value.substring(1, value.length - 1);
                obj[key] = value;
            }
            return obj;
        };
        BMFontLoaderTxt.prototype._buildCharInfo = function (bfi, initialLine, obj, textureSize, invertY, chars) {
            var char = null;
            var x = null;
            var y = null;
            var width = null;
            var height = null;
            var xoffset = 0;
            var yoffset = 0;
            var xadvance = 0;
            var ci = new CharInfo();
            for (var key in obj) {
                var value = obj[key];
                switch (key) {
                    case "id":
                        char = String.fromCharCode(value);
                        break;
                    case "x":
                        x = value;
                        break;
                    case "y":
                        y = value;
                        break;
                    case "width":
                        width = value;
                        break;
                    case "height":
                        height = value;
                        break;
                    case "xadvance":
                        xadvance = value;
                        break;
                    case "xoffset":
                        xoffset = value;
                        break;
                    case "yoffset":
                        yoffset = value;
                        break;
                }
            }
            if (x != null && y != null && width != null && height != null && char != null) {
                ci.xAdvance = xadvance;
                ci.xOffset = xoffset;
                ci.yOffset = bfi.lineHeight - height - yoffset;
                if (invertY) {
                    ci.topLeftUV = new BABYLON.Vector2(1 - (x / textureSize.width), 1 - (y / textureSize.height));
                    ci.bottomRightUV = new BABYLON.Vector2(1 - ((x + width) / textureSize.width), 1 - ((y + height) / textureSize.height));
                }
                else {
                    ci.topLeftUV = new BABYLON.Vector2(x / textureSize.width, y / textureSize.height);
                    ci.bottomRightUV = new BABYLON.Vector2((x + width) / textureSize.width, (y + height) / textureSize.height);
                }
                ci.charWidth = width;
                chars.add(char, ci);
            }
            else {
                console.log("Error while parsing line " + initialLine);
            }
        };
        BMFontLoaderTxt.prototype.loadFont = function (fontContent, scene, invertY) {
            var fontStr = fontContent;
            var bfi = new BitmapFontInfo();
            var errorCode = 0;
            var errorMsg = "OK";
            //padding
            var info = fontStr.match(BMFontLoaderTxt_1.INFO_EXP);
            var infoObj = this._parseStrToObj(info[0]);
            if (!infoObj) {
                return null;
            }
            var paddingArr = infoObj["padding"].split(",");
            bfi.padding = new BABYLON.Vector4(parseInt(paddingArr[0]), parseInt(paddingArr[1]), parseInt(paddingArr[2]), parseInt(paddingArr[3]));
            //common
            var commonObj = this._parseStrToObj(fontStr.match(BMFontLoaderTxt_1.COMMON_EXP)[0]);
            bfi.lineHeight = commonObj["lineHeight"];
            bfi.baseLine = commonObj["base"];
            bfi.textureSize = new BABYLON.Size(commonObj["scaleW"], commonObj["scaleH"]);
            var maxTextureSize = scene.getEngine()._gl.getParameter(0xd33);
            if (commonObj["scaleW"] > maxTextureSize.width || commonObj["scaleH"] > maxTextureSize.height) {
                errorMsg = "FontMap texture's size is bigger than what WebGL supports";
                errorCode = -1;
            }
            else {
                if (commonObj["pages"] !== 1) {
                    errorMsg = "FontMap must contain one page only.";
                    errorCode = -1;
                }
                else {
                    //page
                    var pageObj = this._parseStrToObj(fontStr.match(BMFontLoaderTxt_1.PAGE_EXP)[0]);
                    if (pageObj["id"] !== 0) {
                        errorMsg = "Only one page of ID 0 is supported";
                        errorCode = -1;
                    }
                    else {
                        bfi.textureFile = pageObj["file"];
                        //char
                        var charLines = fontStr.match(BMFontLoaderTxt_1.CHAR_EXP);
                        for (var i = 0, li = charLines.length; i < li; i++) {
                            var charObj = this._parseStrToObj(charLines[i]);
                            this._buildCharInfo(bfi, charLines[i], charObj, bfi.textureSize, invertY, bfi.charDic);
                        }
                        //kerning
                        var kerningLines = fontStr.match(BMFontLoaderTxt_1.KERNING_EXP);
                        if (kerningLines) {
                            for (var i = 0, li = kerningLines.length; i < li; i++) {
                                var kerningObj = this._parseStrToObj(kerningLines[i]);
                                bfi.kerningDic.add(((kerningObj["first"] << 16) | (kerningObj["second"] & 0xffff)).toString(), kerningObj["amount"]);
                            }
                        }
                    }
                }
            }
            return { bfi: bfi, errorCode: errorCode, errorMsg: errorMsg };
        };
        return BMFontLoaderTxt;
    }());
    BMFontLoaderTxt.INFO_EXP = /info [^\r\n]*(\r\n|$)/gi;
    BMFontLoaderTxt.COMMON_EXP = /common [^\n]*(\n|$)/gi;
    BMFontLoaderTxt.PAGE_EXP = /page [^\n]*(\n|$)/gi;
    BMFontLoaderTxt.CHAR_EXP = /char [^\n]*(\n|$)/gi;
    BMFontLoaderTxt.KERNING_EXP = /kerning [^\n]*(\n|$)/gi;
    BMFontLoaderTxt.ITEM_EXP = /\w+=[^ \r\n]+/gi;
    BMFontLoaderTxt.INT_EXP = /^[\-]?\d+$/;
    BMFontLoaderTxt = BMFontLoaderTxt_1 = __decorate([
        BitmapFontLoaderPlugin("fnt", new BMFontLoaderTxt_1())
    ], BMFontLoaderTxt);
    ;
    function BitmapFontLoaderPlugin(fileExtension, plugin) {
        return function () {
            BitmapFontTexture.addLoader(fileExtension, plugin);
        };
    }
    BABYLON.BitmapFontLoaderPlugin = BitmapFontLoaderPlugin;
    var BMFontLoaderTxt_1;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.fontTexture.js.map

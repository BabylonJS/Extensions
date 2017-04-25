var BABYLONX;
(function (BABYLONX) {
    class NoiseGen {
        constructor() {
            this._color1 = "#c0dec9";
            this._color2 = "#282226";
            this._octaves = 6;
            this._persistence = .9;
            this._scale = 36.3;
            this._seed = 1;
            this._size = 250;
            this._percentage = .6;
            this._type = 2;
        }
        rgb2hex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
        }
        hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        setPerlinNoise(ctx, options) {
            //setPerlinNoise(ctx, size, color1, color2, type, octaves, persistence, scale, seed, percentage) {
            this._ctx = ctx;
            var color1 = options.color1 || this._color1;
            var color2 = options.color2 || this._color2;
            var size = options.size || this._size;
            var octaves = options.octaves || this._octaves;
            var persistence = options.persistence || this._persistence;
            var scale = options.scale || this.scale;
            var seed = options.seed || this._seed;
            var percentage = options.percentage || this._percentage;
            var type = options.type || this._type;
            //var type = "PerlinNoise";
            //var c = canvas;
            //var ctx = c.getContext("2d");
            var max_w = size, max_h = size;
            var S = new SimplexNoise(seed);
            var imgData = ctx.getImageData(0, 0, max_w, max_h);
            var d = imgData.data;
            var col1_rgb = this.hexToRgb(color1);
            var col2_rgb = this.hexToRgb(color2);
            var scale_s = scale;
            var before = new Date().getTime();
            var noise_type;
            if (type == 0)
                noise_type = 0;
            else if (type == 1)
                noise_type = 1;
            else if (type == 2)
                noise_type = 2;
            for (var y = 0; y < max_h; y++)
                for (var x = 0; x < max_w; x++) {
                    // octaves, persistence, scale, loBound, hiBound, x, y
                    var v = S.simplexNoise(noise_type, size, octaves, persistence, percentage, scale_s, x, y);
                    //v = v * lo_hi_mul + lo_hi_add; // not sure what this does...
                    //if (type == "PerlinNoise")
                    //v = (v + 1.0) / 2.0; //interval [0,1]. 
                    var i = (x + y * max_w) * 4;
                    d[i] = v * col1_rgb.r + ((1.0 - v) * col2_rgb.r);
                    d[i + 1] = v * col1_rgb.g + ((1.0 - v) * col2_rgb.g);
                    d[i + 2] = v * col1_rgb.b + ((1.0 - v) * col2_rgb.b);
                    d[i + 3] = 255;
                }
            var after = new Date().getTime();
            //console.log("noise: " + (after-before));
            ctx.putImageData(imgData, 0, 0);
        }
        update() {
            this.setPerlinNoise(this._ctx, {});
        }
        get color1() {
            return this._color1;
        }
        set color1(c) {
            this._color1 = c;
            this.update();
        }
        get color2() {
            return this._color2;
        }
        set color2(c) {
            this._color2 = c;
            this.update();
        }
        get octaves() {
            return this._octaves;
        }
        set octaves(o) {
            this._octaves = o;
            this.update();
        }
        get persistence() {
            return this._persistence;
        }
        set persistence(o) {
            this._persistence = o;
            this.update();
        }
        get scale() {
            return this._scale;
        }
        set scale(o) {
            this._scale = o;
            this.update();
        }
        get seed() {
            return this._seed;
        }
        set seed(o) {
            this._seed = o;
            this.update();
        }
        get percentage() {
            return this._percentage;
        }
        set percentage(o) {
            this._percentage = o;
            this.update();
        }
        get type() {
            return this._type;
        }
        set type(o) {
            this._type = o;
            this.update();
        }
    }
    BABYLONX.NoiseGen = NoiseGen;
    class TexGen {
        constructor() {
            /* Original from Author: Christian Petry Homepage: www.petry-christian.de
             * Adapted by: Author: Johann Langhofer Homepage: johann.langhofer.net
            */
            this._brick_color = "#b90000";
            this._grout_color = "#e4ff66";
            this._gradient_color = "#000000";
            this._grout_space = 1;
            this._brick_gradient = 3;
            this._number = 0;
            this._width = 32;
            this._height = 32;
            this._numWidth = 8;
            this._numHeight = 8;
            this._rotation = 0;
        }
        rational_tanh(x) {
            if (x < -3)
                return -1;
            else if (x > 3)
                return 1;
            else
                return x * (27 + x * x) / (27 + 9 * x * x);
        }
        calcTextilesPattern(x, y, patterndirection, patternpart, facetlength, delta_in, smoothness, offset, steepness, depth, round) {
            var PatternPart = {
                TOP: 0,
                MIDDLE: 1,
                BOTTOM: 2,
                BLOCK: 3
            };
            var PatternDirection = {
                HORIZONTAL: 0,
                VERTICAL: 1
            };
            var delta = 1.0 / (8.0 - delta_in);
            var TwistTrajectory = ((Math.asin(2.0 * y - 1.0) / (Math.PI / 2.0) + 1.0) * facetlength) / 2.0;
            var displacement = 2.0 * ((x + TwistTrajectory) - (x + TwistTrajectory) / delta * delta) / delta - 1.0; // added an extra "/ delta " to fix sth
            var rand_value = Math.random() * delta; // [0, delta)
            var pdisplacement = smoothness * displacement + (1.0 - smoothness) * rand_value;
            //console.log(pdis_quad);
            var TwistShading = Math.exp(-Math.abs(Math.pow(pdisplacement * depth, round ? 2 : 1)));
            var YShading = offset + (1.0 - offset) * Math.sin(y * Math.PI);
            /*if (patterndirection == PatternDirection.HORIZONTAL){
                if ((patternpart == PatternPart.TOP && x < 0.5)
                    || (patternpart == PatternPart.BOTTOM && x > 0.5)
                    || (patternpart == PatternPart.BLOCK))
                    YShading = offset + (1.0 - offset) * Math.sin(y * Math.PI);
                else
                    YShading = 1;
            }*/
            var tanh_value = 0.5 * steepness;
            //var tanh = (Math.exp(tanh_value) - Math.exp(-tanh_value)) / (Math.exp(tanh_value) + Math.exp(-tanh_value));
            var shading_border = 0.5;
            if (patterndirection == PatternDirection.VERTICAL)
                if ((patternpart == PatternPart.TOP && x < shading_border)
                    || (patternpart == PatternPart.BOTTOM && x > shading_border)
                    || (patternpart == PatternPart.BLOCK)) {
                    if (x < shading_border)
                        tanh_value = x * steepness;
                    else if (x > shading_border)
                        tanh_value = (1.0 - x) * steepness;
                }
            if (patterndirection == PatternDirection.HORIZONTAL)
                if ((patternpart == PatternPart.TOP && x < shading_border)
                    || (patternpart == PatternPart.BOTTOM && x > shading_border)
                    || (patternpart == PatternPart.BLOCK))
                    if (x < shading_border)
                        tanh_value = x * steepness;
                    else if (x > shading_border)
                        tanh_value = (1.0 - x) * steepness;
            var XShading = offset + (1.0 - offset) * this.rational_tanh(tanh_value);
            //XShading = XShading * (x < 0.5 ? (1 - x) : x)
            var ThreadShading = TwistShading * XShading * YShading;
            return ThreadShading;
        }
        createTextilesPattern(canvas, patterndirection, patternpart, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col, col_bg) {
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            var imgData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data1 = imgData1.data;
            var PatternDirection = {
                HORIZONTAL: 0,
                VERTICAL: 1
            };
            for (var x = 0; x < canvas.width; x++) {
                for (var y = 0; y < canvas.height; y++) {
                    var first = (patterndirection == PatternDirection.VERTICAL ? y / canvas.height : x / canvas.width);
                    var second = (patterndirection == PatternDirection.VERTICAL ? x / canvas.height : y / canvas.width);
                    var v = this.calcTextilesPattern(first, second, patterndirection, patternpart, facetlength, delta, smoothness, offset, steepness, depth, round);
                    data1[(x + y * canvas.width) * 4 + 0] = v * col.r + ((1.0 - v) * col_bg.r);
                    data1[(x + y * canvas.width) * 4 + 1] = v * col.g + ((1.0 - v) * col_bg.g);
                    data1[(x + y * canvas.width) * 4 + 2] = v * col.b + ((1.0 - v) * col_bg.b);
                    data1[(x + y * canvas.width) * 4 + 3] = 255;
                }
            }
            ctx.putImageData(imgData1, 0, 0);
            //ctx.scale( max_w/ img.width, img.height);
            //ctx.drawImage(canvas, 0,0);
            return ctx.createPattern(canvas, "repeat");
        }
        setTextiles(ctx, img, max_w, max_h, scale, col1_rgb, col2_rgb, col_bg, facetlength, delta, smoothness, offset, steepness, depth, round) {
            var PatternPart = {
                TOP: 0,
                MIDDLE: 1,
                BOTTOM: 2,
                BLOCK: 3
            };
            var PatternDirection = {
                HORIZONTAL: 0,
                VERTICAL: 1
            };
            var width = max_w / (img.width * scale) + 0.5;
            var height = max_h / (img.height * scale) + 0.5;
            var c_p1_block = document.createElement('canvas');
            var pat1_block = this.createTextilesPattern(c_p1_block, PatternDirection.VERTICAL, PatternPart.BLOCK, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);
            var c_p1_middle = document.createElement('canvas');
            var pat1_middle = this.createTextilesPattern(c_p1_middle, PatternDirection.VERTICAL, PatternPart.MIDDLE, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);
            var c_p1_top = document.createElement('canvas');
            var pat1_top = this.createTextilesPattern(c_p1_top, PatternDirection.VERTICAL, PatternPart.TOP, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);
            var c_p1_bottom = document.createElement('canvas');
            var pat1_bottom = this.createTextilesPattern(c_p1_bottom, PatternDirection.VERTICAL, PatternPart.BOTTOM, width, height, facetlength, delta, smoothness, offset, steepness, depth, round, col1_rgb, col_bg);
            var c_p2_block = document.createElement('canvas');
            var pat2_block = this.createTextilesPattern(c_p2_block, PatternDirection.HORIZONTAL, PatternPart.BLOCK, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);
            var c_p2_middle = document.createElement('canvas');
            var pat2_middle = this.createTextilesPattern(c_p2_middle, PatternDirection.HORIZONTAL, PatternPart.MIDDLE, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);
            var c_p2_top = document.createElement('canvas');
            var pat2_top = this.createTextilesPattern(c_p2_top, PatternDirection.HORIZONTAL, PatternPart.TOP, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);
            var c_p2_bottom = document.createElement('canvas');
            var pat2_bottom = this.createTextilesPattern(c_p2_bottom, PatternDirection.HORIZONTAL, PatternPart.BOTTOM, height, width, facetlength, delta, smoothness, offset, steepness, depth, round, col2_rgb, col_bg);
            var c_ptrn = document.createElement('canvas');
            var ctx_ptrn = c_ptrn.getContext('2d');
            ctx_ptrn.imageSmoothingEnabled = false;
            for (var i = 0; i < scale; i++) {
                ctx_ptrn.drawImage(img, 0, 0, img.width, img.height);
                if (i >= 1) {
                    for (var x = 0; x < i; x++)
                        ctx_ptrn.drawImage(img, img.width * x, img.height * i, img.width, img.height);
                    for (var y = 0; y < i; y++)
                        ctx_ptrn.drawImage(img, img.width * i, img.height * y, img.width, img.height);
                    ctx_ptrn.drawImage(img, img.width * i, img.height * i, img.width, img.height);
                }
            }
            var imgData3 = ctx_ptrn.getImageData(0, 0, img.width * scale, img.height * scale);
            var data3 = imgData3.data;
            //console.log(img.width);
            //ctx.fillStyle = pat1;
            //ctx.fillRect(0, 0, max_w / img.width, max_h / img.height);
            var width_mul = max_w / imgData3.width;
            var height_mul = max_h / imgData3.height;
            for (var y = 0; y < imgData3.height; y++) {
                for (var x = 0; x < imgData3.width; x++) {
                    var pos = x * 4 + y * imgData3.width * 4 + 0;
                    // vertical color
                    if (data3[pos] == 0) {
                        var top = x * 4 + ((y - 1) < 0 ? y - 1 + imgData3.width : y - 1) * imgData3.width * 4;
                        var bottom = x * 4 + ((y + 1) == imgData3.width ? 0 : y + 1) * imgData3.width * 4;
                        if (data3[top] == 0 && data3[bottom] == 0) {
                            ctx.fillStyle = pat1_middle;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else if (data3[top] == 0 && data3[bottom] != 0) {
                            ctx.fillStyle = pat1_bottom;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else if (data3[top] != 0 && data3[bottom] == 0) {
                            ctx.fillStyle = pat1_top;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else {
                            ctx.fillStyle = pat1_block;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                    }
                    else {
                        var left = ((x - 1) < 0 ? x - 1 + imgData3.width : x - 1) * 4 + y * imgData3.width * 4;
                        var right = ((x + 1) == imgData3.width ? 0 : x + 1) * 4 + y * imgData3.width * 4;
                        if (data3[left] != 0 && data3[right] == 0) {
                            ctx.fillStyle = pat2_bottom;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else if (data3[left] == 0 && data3[right] != 0) {
                            ctx.fillStyle = pat2_top;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else if (data3[left] != 0 && data3[right] != 0) {
                            ctx.fillStyle = pat2_middle;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                        else {
                            ctx.fillStyle = pat2_block;
                            ctx.fillRect(x * width_mul, y * height_mul, width_mul, height_mul);
                        }
                    }
                }
            }
            /*
            var helper = function (fn) {
                'use strict';
                fn();
            }
            var do_strict=function() {
                delete c_p1_block;
                delete c_p1_middle;
                delete c_p1_top;
                delete c_p1_bottom;

                delete c_p2_block;
                delete c_p2_middle;
                delete c_p2_top;
                delete c_p2_bottom;

                delete c_ptrn;
                delete img;
            }
            helper(do_strict);
            */
        }
        ;
        drawBrickRectangle(ctx, groutspace, brick_gradient, brick_col, brick_grout_col, gradient_color, x, y, w, h) {
            brick_gradient = Math.min(brick_gradient, Math.min((h - groutspace * 2) / 2, (w - groutspace * 2) / 2));
            /*
            ctx.fillStyle = brick_grout_col;
            ctx.fillRect(x, Math.max(y,0), w, h);
            
            ctx.fillStyle = brick_col;
            ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace , w - groutspace*2, y + groutspace < 0 ? h - groutspace : h - groutspace*2);
            */
            ctx.fillStyle = brick_grout_col;
            ctx.fillRect(x, Math.max(y, 0), w, h);
            var grad = ctx.createLinearGradient(0, y, 0, y + h);
            var max_d = h;
            grad.addColorStop(0, brick_grout_col);
            grad.addColorStop(groutspace / max_d, brick_grout_col);
            grad.addColorStop(groutspace / max_d, gradient_color);
            grad.addColorStop((groutspace + brick_gradient) / max_d, brick_col);
            grad.addColorStop((h - groutspace - brick_gradient) / max_d, brick_col);
            grad.addColorStop((h - groutspace) / max_d, gradient_color);
            grad.addColorStop((h - groutspace) / max_d, brick_grout_col);
            grad.addColorStop(1.0, brick_grout_col);
            ctx.fillStyle = grad;
            ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace, w - groutspace * 2, y + groutspace < 0 ? h - groutspace : h - groutspace * 2);
            //ctx.fillStyle = gradient([0, y, 0, h], ctx, y, groutspace, brick_col, brick_grout_col, gradient_color);
            //ctx.fillRect(x, y, w, h);
            ctx.save();
            var mid_x = w / 2 + x;
            var mid_y = h / 2 + y;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + groutspace, y + groutspace);
            ctx.lineTo(x + groutspace + brick_gradient, y + groutspace + brick_gradient);
            ctx.lineTo(mid_x, mid_y);
            ctx.lineTo(w + x - brick_gradient - groutspace, h + y - brick_gradient - groutspace);
            ctx.lineTo(w + x - brick_gradient, h + y - brick_gradient);
            ctx.lineTo(w + x, y + h);
            ctx.lineTo(w + x, y);
            ctx.lineTo(w + x - groutspace, y + groutspace);
            ctx.lineTo(w + x - brick_gradient - groutspace, y + groutspace + brick_gradient);
            ctx.lineTo(mid_x, mid_y);
            ctx.lineTo(x + brick_gradient + groutspace, h + y - brick_gradient - groutspace);
            ctx.lineTo(x + groutspace, h + y - groutspace);
            ctx.lineTo(x, h + y);
            ctx.lineTo(x, y);
            ctx.clip();
            grad = ctx.createLinearGradient(x, 0, x + w, 0);
            max_d = w;
            grad.addColorStop(0, brick_grout_col);
            grad.addColorStop(groutspace / max_d, brick_grout_col);
            grad.addColorStop(groutspace / max_d, gradient_color);
            grad.addColorStop((groutspace + brick_gradient) / max_d, brick_col);
            grad.addColorStop((w - groutspace - brick_gradient) / max_d, brick_col);
            grad.addColorStop((w - groutspace) / max_d, gradient_color);
            grad.addColorStop((w - groutspace) / max_d, brick_grout_col);
            grad.addColorStop(1.0, brick_grout_col);
            ctx.fillStyle = grad;
            //ctx.fillStyle = gradient([x, 0, w, 0], ctx, tile_part_x, hori_gap, x_tiles_gradient, tile_col_hex, grout_col_hex, tiles_smooth_col, grout_gradient_color);
            ctx.fillRect(x + groutspace, y + groutspace < 0 ? 0 : y + groutspace, w - groutspace * 2, y + groutspace < 0 ? h - groutspace : h - groutspace * 2);
            ctx.restore();
        }
        rotate(ctx, rotation) {
            var max_w = 250;
            var max_h = 250;
            ctx.beginPath();
            ctx.rect(0, 0, max_w, max_h);
            ctx.translate(max_w / 2, max_h / 2);
            ctx.rotate(rotation);
            ctx.translate(-max_w / 2, -max_h / 2);
            var pat = ctx.createPattern(ctx.canvas, "repeat");
            ctx.clearRect(-max_w / 2, -max_h / 2, max_w / 2, max_h / 2);
            ctx.fillStyle = pat;
            ctx.fill();
            ctx.translate(max_w / 2, max_h / 2);
            ctx.rotate(-rotation);
            ctx.translate(-max_w / 2, -max_h / 2);
        }
        createPattern(ctx, options) {
            var max_w = 250;
            var max_h = 250;
            if (options.number != null) {
                this._number = Number(options.number);
            }
            switch (this._number) {
                case 0:
                    this.createStraightPattern(ctx, options);
                    break;
                case 1:
                    this.createWideBlockPattern(ctx, options);
                    break;
                case 2:
                    this.createBlockPattern(ctx, options);
                    break;
                case 3:
                    this.createCirclePattern(ctx, options);
                    break;
                case 4:
                    this.createEdgesPattern(ctx, options);
                    break;
            }
            if (this._rotation != 0) {
                this.rotate(ctx, this._rotation);
            }
        }
        createStraightPattern(ctx, options) {
            this._ctx = ctx;
            this._width = options.width || this._width;
            this._height = options.height || this._height;
            this._numWidth = options.numWidth || this._numWidth;
            this._numHeight = options.numHeight || this._numHeight;
            this._grout_space = options.groutspace || this._grout_space;
            this._brick_gradient = options.brick_gradient || this._brick_gradient;
            this._brick_color = options.brick_color || this._brick_color;
            this._grout_color = options.grout_color || this._grout_color;
            this._gradient_color = options.gradient_color || this._gradient_color;
            var half_height = this._height / 2.0 + 0.5;
            for (var y = 0; y < this._numHeight + 1; y++) {
                for (var x = 0; x < this._numWidth + 1; x++) {
                    if (x % 2 == 1) {
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * this._width, y * this._height - half_height, this._width, this._height);
                    }
                    else
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * this._width, y * this._height, this._width, this._height);
                }
            }
        }
        createBlockPattern(ctx, options) {
            this._ctx = ctx;
            this._width = options.width || this._width;
            this._height = options.height || this._height;
            this._numWidth = options.numWidth || this._numWidth;
            this._numHeight = options.numHeigth || this._numHeight;
            this._grout_color = options.grout_color || this._grout_color;
            this._grout_space = options.groutspace || this._grout_space;
            this._brick_gradient = options.brick_gradient || this._brick_gradient;
            this._brick_color = options.brick_color || this._brick_color;
            var width = this._width / 2.0 + 0.5;
            var height = this._height / 2.0 + 0.5;
            var count_y = this._numHeight * 2;
            var count_x = this._numWidth * 2;
            ctx.fillStyle = this._grout_color;
            ctx.fillRect(0, 0, 256, 256);
            for (var y = 0; y < count_y + 1; y += 2) {
                for (var x = 0; x < count_x + 1; x += 3) {
                    if ((x + y) % 4 == 0) {
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * width, y * height, width, height * 2);
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * width + width, y * height, width, height);
                    }
                    else {
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * width, y * height, width * 2, height);
                        this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this._gradient_color, x * width, y * height + height, width * 2, height);
                    }
                }
            }
        }
        createWideBlockPattern(ctx, options) {
            this._ctx = ctx;
            this._width = options.width || this._width;
            this._height = options.height || this._height;
            this._numWidth = options.numWidth || this._numWidth;
            this._numHeight = options.numHeigth || this._numHeight;
            this._grout_color = options.grout_color || this._grout_color;
            this._grout_space = options.groutspace || this._grout_space;
            this._brick_gradient = options.brick_gradient || this._brick_gradient;
            this._brick_color = options.brick_color || this._brick_color;
            var width = this._width / 2.0 + 0.5;
            var height = this._height / 2.0 + 0.5;
            var count_y = this._numHeight * 2;
            var count_x = this._numWidth * 2;
            ctx.fillStyle = this._grout_color;
            ctx.fillRect(0, 0, 256, 256);
            for (var y = 0; y < count_y + 1; y += 2) {
                for (var x = 0; x < count_x + 1; x += 3) {
                    this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this.gradient_color, x * width, y * height, width, height * 2);
                    this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this.gradient_color, x * width + width, y * height, width * 2, height);
                    this.drawBrickRectangle(ctx, this._grout_space, this._brick_gradient, this._brick_color, this._grout_color, this.gradient_color, x * width + width, y * height + height, width * 2, height);
                }
            }
        }
        createCirclePattern(ctx, options) {
            this._ctx = ctx;
            this._width = options.width || this._width;
            this._height = options.height || this._height;
            this._numWidth = options.numWidth || this._numWidth;
            this._numHeight = options.numHeigth || this._numHeight;
            this._grout_color = options.grout_color || this._grout_color;
            this._grout_space = options.groutspace || this._grout_space;
            this._brick_gradient = options.brick_gradient || this._brick_gradient;
            this._brick_color = options.brick_color || this._brick_color;
            var width = this._width / 3.0 + 0.5;
            var height = this._height / 3.0 + 0.5;
            var count_y = this._numHeight * 3;
            var count_x = this._numWidth * 3;
            for (var y = 0; y < count_y + 1; y += 3) {
                for (var x = 0; x < count_x + 1; x += 3) {
                    this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width, y * height, width * 2, height);
                    this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width + width, y * height + 2 * height, width * 2, height);
                    this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width, y * height + height, width, height * 2);
                    this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width + 2 * width, y * height, width, height * 2);
                    this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width + width, y * height + height, width, height);
                }
            }
        }
        createEdgesPattern(ctx, options) {
            this._ctx = ctx;
            this._width = options.width || this._width;
            this._height = options.height || this._height;
            this._numWidth = options.numWidth || this._numWidth;
            this._numHeight = options.numHeigth || this._numHeight;
            this._grout_color = options.grout_color || this._grout_color;
            this._grout_space = options.groutspace || this._grout_space;
            this._brick_gradient = options.brick_gradient || this._brick_gradient;
            this._brick_color = options.brick_color || this._brick_color;
            var width = this._width / 2.0 + 0.5;
            var height = this._height / 2.0 + 0.5;
            var count_y = this._numHeight * 2;
            var count_x = this._numWidth * 2;
            ctx.translate(-width, -height);
            for (var y = 0; y < count_y + 2; y++) {
                for (var x = 0; x < count_x + 2; x++) {
                    if (y % 4 == x % 4)
                        this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width, y * height, width * 2, height);
                    else if (y % 4 == (x % 4 + 1)
                        || (y % 4 == 0 && x % 4 == 3))
                        this.drawBrickRectangle(ctx, this._grout_space, this.brick_gradient, this.brick_color, this.grout_color, this.gradient_color, x * width, y * height, width, height * 2);
                }
            }
            ctx.translate(width, height);
        }
        set brick_gradient(g) {
            this._brick_gradient = g;
            this.createPattern(this._ctx, {});
        }
        get brick_gradient() {
            return this._brick_gradient;
        }
        set brick_color(c) {
            this._brick_color = c;
            this.createPattern(this._ctx, {});
        }
        get brick_color() {
            return this._brick_color;
        }
        set grout_color(c) {
            this._grout_color = c;
            this.createPattern(this._ctx, {});
        }
        get grout_color() {
            return this._grout_color;
        }
        get grout_space() {
            return this._grout_space;
        }
        set grout_space(n) {
            this._grout_space = n;
            this.createPattern(this._ctx, {});
        }
        set gradient_color(c) {
            this._gradient_color = c;
            this.createPattern(this._ctx, {});
        }
        get gradient_color() {
            return this._gradient_color;
        }
        get number() {
            return this._number;
        }
        set number(n) {
            this._number = n;
            this.createPattern(this._ctx, {});
        }
        get width() {
            return this._width;
        }
        set width(n) {
            this._width = n;
            this.createPattern(this._ctx, {});
        }
        get height() {
            return this._height;
        }
        set height(n) {
            this._height = n;
            this.createPattern(this._ctx, {});
        }
        get numWidth() {
            return this._numWidth;
        }
        set numWidth(n) {
            this._numWidth = n;
            this.createPattern(this._ctx, {});
        }
        get numHeight() {
            return this._numHeight;
        }
        set numHeight(n) {
            this._numHeight = n;
            this.createPattern(this._ctx, {});
        }
        get rotation() {
            return this._rotation;
        }
        set rotation(r) {
            this._rotation = r;
            this.createPattern(this._ctx, {});
        }
    }
    BABYLONX.TexGen = TexGen;
})(BABYLONX || (BABYLONX = {}));

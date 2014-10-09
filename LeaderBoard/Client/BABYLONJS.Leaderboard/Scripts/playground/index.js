var BABYLON;
(function (BABYLON) {
    (function (Playground) {
        var b = ace.require("ace/ext/beautify");

        var n = '\n';
        var jsEditorPosition;

        // Helper to format string
        var format = function (formatted, args) {
            for (var i = 0; i < args.length; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[i]);
            }
            return formatted;
        };

        var Param = (function () {
            function Param() {
            }
            return Param;
        })();
        Playground.Param = Param;

        var Api = (function () {
            function Api() {
            }
            return Api;
        })();
        Playground.Api = Api;
        var Method = (function () {
            function Method(name) {
                this.name = name;
                this.params = new Array();
            }
            return Method;
        })();
        Playground.Method = Method;

        var Js = (function () {
            function Js(callback) {
                this.initialize(callback);
            }
            Js.prototype.log = function (data) {
                data = (data == null || data == undefined) ? [null] : data;
                this.jsonResponse = data;
                jsEditorPosition = this.jsEditor.getCursorPosition();
                this.modal.modal();
            };
            Js.prototype.error = function (error) {
                js.showMessage(error, true);

                var b = $('#btnGetResponse');
                b.button('reset');

                return;
            };

            Js.prototype.initialize = function (callback) {
                var _this = this;
                console.log = function (e) {
                    _this.log(e);
                };
                console.error = function (e) {
                    return _this.error(e);
                };

                this.jsEditor = ace.edit('editor');
                this.jsEditor.setTheme("ace/theme/idle_fingers");
                this.jsEditor.getSession().setMode("ace/mode/javascript");
                this.jsEditor.setShowPrintMargin(false);
                this.jsEditor.setDisplayIndentGuides(false);

                this.jsEditorJson = ace.edit('editorJson');
                this.jsEditorJson.setTheme("ace/theme/kuroir");
                this.jsEditorJson.getSession().setMode("ace/mode/JSON");
                this.jsEditorJson.getSession().setTabSize(2);
                this.jsEditorJson.getSession().setUseWrapMode(true);
                this.jsEditorJson.setShowPrintMargin(false);
                this.jsEditorJson.setDisplayIndentGuides(false);

                this.cacheValue = new Array();
                this.modal = $("#myModal");

                this.modal.on('shown.bs.modal', function (e) {
                    if (_this.jsonResponse == null)
                        _this.modal.hide();

                    var str = JSON.stringify(_this.jsonResponse, null, '\t');

                    var jsEditorJson = ace.edit('editorJson');
                    jsEditorJson.setValue(str);
                    jsEditorJson.clearSelection();
                    jsEditorJson.gotoLine(1);
                    jsEditorJson.focus();

                    var b = $('#btnGetResponse');
                    b.button('reset');
                });

                this.modal.on('hidden.bs.modal', function (e) {
                    var jsEditor = ace.edit('editor');
                    jsEditor.focus();
                    jsEditor.moveCursorToPosition(jsEditorPosition);
                });

                this.initializeScripts(callback);
            };

            Js.prototype.getApplicationUrl = function () {
                var t = document.getElementById('s_applicationUrl');
                return t.value;
                ;
            };

            Js.prototype.getApplicationKey = function () {
                var t = document.getElementById('s_applicationKey');
                return t.value;
            };

            Js.prototype.initializeScripts = function (callback) {
                //this.methods = new Array<Playground.Api>();
                var _this = this;
                var jqxhr = $.getJSON("/Scripts/playground/Apis.json", function (json) {
                    _this.apis = json;
                    _this.apis.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });

                    for (var i = 0; i < _this.apis.length; i++) {
                        _this.apis[i].methods.sort(function (a, b) {
                            return a.name.localeCompare(b.name);
                        });
                    }

                    callback();
                    return;
                });
            };

            Js.prototype.loadApis = function () {
                var sApiName = document.getElementById("sApiName");

                for (var index = 0; index < this.apis.length; index++) {
                    var api = this.apis[index];

                    var opt = document.createElement("option");
                    opt.id = index.toString() + "_" + api.name;
                    opt.value = index.toString();
                    opt.innerText = api.name;

                    sApiName.add(opt);
                }

                // set first api as the current Api
                this.currentApi = this.apis[0];
            };

            Js.prototype.loadMethods = function () {
                var sApiMethodName = document.getElementById("sApiMethodName");

                while (sApiMethodName.options.length > 0) {
                    sApiMethodName.remove(0);
                }

                for (var index = 0; index < this.currentApi.methods.length; index++) {
                    var method = this.currentApi.methods[index];

                    var opt = document.createElement("option");
                    opt.id = index.toString() + "_" + method.name;
                    opt.value = index.toString();
                    opt.innerText = method.name;

                    sApiMethodName.add(opt);
                }

                // set the first method as current method
                this.currentMethod = this.currentApi.methods[0];
            };

            Js.prototype.requestJavascript = function () {
                this.closeMessage();

                if (this.currentMethod == null)
                    return;

                // before changing currentMethod, saving values filled by user
                this.saveCurrentVariables();

                var scriptClient = this.currentApi.script;

                var apiParams = [];
                apiParams.push(JSON.stringify(this.getApplicationUrl()));
                apiParams.push(JSON.stringify(this.getApplicationKey()));

                if (this.currentApi.params != null) {
                    for (var i = 0; i < this.currentApi.params.length; i++) {
                        var p = this.currentApi.params[i];
                        var id = (p.group != null && p.group != undefined) ? p.group + '_' + p.name : '0_' + p.name;

                        var elem = document.getElementById(id);

                        if (p.isRequired && (!elem.value || elem.value == "")) {
                            elem.parentElement.classList.add('has-error');
                            continue;
                        }
                        elem.parentElement.classList.remove('has-error');

                        var v = elem.value;
                        if (p.isType == "text" || p.isType == "longtext") {
                            v = JSON.stringify(v);
                        }

                        apiParams.push(v);
                    }
                }

                var text = format(scriptClient, apiParams);
                text += n;
                text += n;

                // all grouped parameters (such as order, where, fields where I want {order:{xxx}, where:{zzz}, fields:'x,y,z'}
                var groups = [];

                // arrays containing params without group (literal inline )
                // and params with group (object structure)
                var finalParamsWithGroup = [];
                var finalParamsWithoutGroup = [];

                // fill an array with params and values from HTML DOM
                if (this.currentMethod.params != null) {
                    for (var i = 0; i < this.currentMethod.params.length; i++) {
                        // get the definition of the parameter
                        var p = this.currentMethod.params[i];
                        var id = (p.group != null && p.group != undefined) ? p.group + '_' + p.name : '0_' + p.name;

                        // get the HTML element
                        var elem = document.getElementById(id);

                        if (!elem)
                            continue;

                        // check if value is required
                        if (p.isRequired && (!elem.value || elem.value == "")) {
                            elem.parentElement.classList.add('has-error');
                            continue;
                        }
                        elem.parentElement.classList.remove('has-error');

                        // get the value and if not null, add to my tab of 'params with values'
                        if (elem.value != null && elem.value != "") {
                            p.value = elem.value;
                        }

                        // if a group is available, add it to my
                        if (p.group != undefined && elem.value != null && elem.value != "") {
                            if (groups[p.group] == undefined)
                                groups[p.group] = [];

                            groups[p.group][p.name] = p.value;
                        }

                        // a param not assiocated with a group is a simple value
                        if (p.group == undefined && elem.value != null && elem.value != "") {
                            finalParamsWithoutGroup.push(JSON.stringify(p.value));
                        }
                    }
                }

                // foreach group
                if (groups.length > 0) {
                    for (var i in groups) {
                        var strGroup = "{\n";
                        var g = groups[i];

                        for (var j in g) {
                            var ps = g[j];
                            if (ps.indexOf("{") == 0)
                                strGroup += '   ' + j + ": " + ps;
                            else
                                strGroup += '   ' + j + ": " + JSON.stringify(ps);

                            strGroup += "\n,";
                        }
                        if (strGroup.lastIndexOf(",") == strGroup.length - 1)
                            strGroup = strGroup.substring(0, strGroup.length - 1);

                        strGroup += "}";

                        finalParamsWithGroup[i] = strGroup;
                    }
                }

                //format all parameters wihtout any group
                if (finalParamsWithoutGroup.length > 0) {
                    text += format(this.currentMethod.script, finalParamsWithoutGroup);
                } else {
                    text += this.currentMethod.script;
                }

                for (var i in finalParamsWithGroup) {
                    text = text.replace('{' + i.toString() + '}', finalParamsWithGroup[i]);
                }

                for (var i = 0; i <= 4; i++) {
                    if (text.indexOf(', {' + i + '}') >= 0)
                        text = text.replace(', {' + i + '}', '');
                    if (text.indexOf(',{' + i + '}') >= 0)
                        text = text.replace(',{' + i + '}', '');
                }
                for (var i = 0; i <= 4; i++) {
                    if (text.indexOf('{' + i + '} ,') >= 0)
                        text = text.replace('{' + i + '} ,', '');
                    if (text.indexOf('{' + i + '},') >= 0)
                        text = text.replace('{' + i + '},', '');
                }

                this.jsEditor.setValue(text, text.length);

                b.beautify(this.jsEditor.getSession());
            };

            Js.prototype.saveCurrentVariables = function () {
                if (this.currentMethod == null)
                    return;

                var divPanelBody = document.getElementById("divPanelBody");
                var inputApiName = document.getElementById("inputApiName");

                for (var i = 0; i < divPanelBody.children.length; i++) {
                    var elem = divPanelBody.children[i];

                    if (elem instanceof HTMLDivElement) {
                        for (var j = 0; j < elem.children.length; j++) {
                            var inputElem = elem.children[j];

                            if (inputElem instanceof HTMLInputElement) {
                                var input = inputElem;
                                var id = input.id;
                                if (id == null || id == "")
                                    continue;

                                var value = input.value;

                                this.cacheValue[id] = value;
                            }
                        }
                    }
                }
            };

            Js.prototype.changeApi = function (value) {
                // before changing currentMethod, saving values filled by user
                this.saveCurrentVariables();

                this.currentApi = this.apis[value];

                this.loadMethods();

                this.changeMethod(0);
            };

            Js.prototype.changeMethod = function (value) {
                // before changing currentMethod, saving values filled by user
                this.saveCurrentVariables();

                this.currentMethod = this.currentApi.methods[value];

                var divMethodName = document.getElementById("divMethodName");
                var divPanelBody = document.getElementById("divPanelBody");

                divPanelBody.innerHTML = "";

                divMethodName.innerHTML = "<strong>Method :</strong> " + this.currentMethod.name;

                if (this.currentApi.params != null) {
                    for (var index = 0; index < this.currentApi.params.length; index++) {
                        var p = this.currentApi.params[index];

                        divPanelBody.innerHTML += this.getParamForm(p);
                    }
                }

                if (this.currentMethod.params != null) {
                    for (var index = 0; index < this.currentMethod.params.length; index++) {
                        var p = this.currentMethod.params[index];

                        divPanelBody.innerHTML += this.getParamForm(p);
                    }
                }
            };

            Js.prototype.getParamForm = function (p) {
                var val = "";
                var id = (p.group != null && p.group != undefined) ? p.group + '_' + p.name : '0_' + p.name;

                for (var k in this.cacheValue) {
                    if (this.cacheValue.hasOwnProperty(k) && k == id) {
                        val = this.cacheValue[k];
                    }
                }

                var req = p.isRequired ? "<span class='text-danger'>*</span>" : "";

                var div = '<div class="form-group" > ' + '  <label class="control-label" for= "' + id + '">' + p.description + '</label> ' + req + '  <input type="text" value="' + val + '" class="form-control" id = "' + id + '" placeholder = "' + p.name + '" > ' + '  </input> ' + '</div> ';

                if (p.isType && p.isType == "file") {
                    div = '<div class="form-group" > ' + '  <label class="control-label" for= "' + id + '">' + p.description + '</label> ' + req + '<span class="btn btn-default btn-block btn-file pull-right" > ' + 'Browse <input type="file" id="sfile" /></span> ' + '</div> ';
                }
                if (p.isType && p.isType == "longtext") {
                    div = '<div class="form-group" > ' + '  <label class="control-label" for= "' + id + '">' + p.description + '</label> ' + req + '  <textarea rows="5" value="' + val + '" class="form-control" id = "' + id + '" ></textarea> ' + '</div> ';
                }

                return div;
            };

            Js.prototype.closeMessage = function () {
                var alertZone = document.getElementById("alertZone");
                $(".alert").alert('close');
            };

            Js.prototype.showMessage = function (message, isError) {
                var classM = isError ? 'alert-danger' : 'alert-info';
                var errorContent = '<div class="alert ' + classM + ' fade in" role="alert">' + '<button type="button" class="close" data-dismiss="alert">' + '<span aria-hidden="true">&times;</span>' + '<span class="sr-only">Close</span>' + '</button> ' + '<h4>An error occured !</h4> ' + '<p>' + message + '</p>' + '</div>';

                var divError = document.getElementById("alertZone");

                if (divError != null)
                    divError.innerHTML = errorContent;
            };

            Js.prototype.compileAndRun = function () {
                try  {
                    var b = $('#btnGetResponse');
                    b.button('loading');

                    // close message if open
                    this.closeMessage();

                    var code = this.jsEditor.getValue();

                    eval(code);
                } catch (e) {
                    console.error(e);
                }
            };

            Js.prototype.compress = function (s) {
                //// Compressed byte array can be converted into base64 to sumbit to server side to do something.
                //var b = Iuppiter.Base64.encode(s, true);
                //var bb = Iuppiter.toByteArray(b);
                //var db = Iuppiter.decompress(Iuppiter.Base64.decode(bb, true));
            };
            return Js;
        })();
        Playground.Js = Js;
        ;
    })(BABYLON.Playground || (BABYLON.Playground = {}));
    var Playground = BABYLON.Playground;
})(BABYLON || (BABYLON = {}));

var js = new BABYLON.Playground.Js(function () {
    // loading apis
    js.loadApis();

    // loading methods
    js.loadMethods();

    // loading params
    js.changeMethod(0);
});

$("#btnScript").click(function () {
    js.requestJavascript();
    var b = $('#btnGetResponse');
    b.button('reset');
});

$("#btnGetResponse").click(function () {
    js.compileAndRun();
});

$("#sApiName").on("change", function () {
    var selector = document.getElementById("sApiName");
    js.changeApi(+selector.value);
});

$("#sApiMethodName").on("change", function () {
    var selector = document.getElementById("sApiMethodName");
    js.changeMethod(+selector.value);
});
//# sourceMappingURL=index.js.map

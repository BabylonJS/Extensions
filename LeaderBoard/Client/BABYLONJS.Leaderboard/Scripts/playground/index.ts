module BABYLON {
    export module Playground {

        var b = ace.require("ace/ext/beautify");

        var n = '\n';
        var jsEditorPosition: AceAjax.Position;

        // Helper to format string
        var format = (formatted: string, args: any[]) => {
            for (var i = 0; i < args.length; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[i]);
            }
            return formatted;
        };



        export class Param {
            name: string;
            description: string;
            isRequired: boolean;
            isType: string;
            value: any;
            group: number;
        }

        export class Api {
            name: string;
            params: Param[];
            methods: Method[];
            script: string;
        }
        export class Method {
            name: string;
            params: Param[];
            script: string;
            constructor(name?: string) {
                this.name = name;
                this.params = new Array<Param>();
            }
        }

        export class Js {

            jsEditor: AceAjax.Editor;
            jsEditorJson: AceAjax.Editor;
            apis: Array<Playground.Api>;
            currentMethod: Playground.Method;
            currentApi: Playground.Api;
            cacheValue: Array<string>;
            jsonResponse: any;
            modal: JQuery;

            private log(data: any) {
                data = (data == null || data == undefined) ? [null] : data;
                this.jsonResponse = data;
                jsEditorPosition = this.jsEditor.getCursorPosition();
                this.modal.modal();
            }
            private error(error: any) {
                js.showMessage(error, true);

                var b = <JQuery>$('#btnGetResponse');
                b.button('reset');

                return;
            }
            constructor(callback) {

                this.initialize(callback);
            }

            private initialize(callback) {

                console.log = (e) => { this.log(e) };
                console.error = (e) => this.error(e);

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

                this.cacheValue = new Array<string>();
                this.modal = <JQuery>$("#myModal");


                this.modal.on('shown.bs.modal', (e) => {

                    if (this.jsonResponse == null)
                        this.modal.hide();

                    var str = JSON.stringify(this.jsonResponse, null, '\t');

                    var jsEditorJson = ace.edit('editorJson');
                    jsEditorJson.setValue(str);
                    jsEditorJson.clearSelection();
                    jsEditorJson.gotoLine(1);
                    jsEditorJson.focus();

                    var b = <any>$('#btnGetResponse');
                    b.button('reset');
                })

                this.modal.on('hidden.bs.modal', (e) => {

                    var jsEditor = ace.edit('editor');
                    jsEditor.focus();
                    jsEditor.moveCursorToPosition(jsEditorPosition);
                })

              this.initializeScripts(callback);

            }

            private getApplicationUrl() {
                var t = <HTMLInputElement>document.getElementById('s_applicationUrl');
                return t.value;;
            }

            private getApplicationKey() {
                var t = <HTMLInputElement>document.getElementById('s_applicationKey');
                return t.value;
            }


            private initializeScripts(callback) {

                //this.methods = new Array<Playground.Api>();

                var jqxhr = $.getJSON("Scripts/playground/Apis.txt", (json: any) => {

                    this.apis = <Array<Playground.Api>>json;
                    this.apis.sort((a, b) => a.name.localeCompare(b.name));

                    for (var i = 0; i < this.apis.length; i++) {
                        this.apis[i].methods.sort((a, b) => a.name.localeCompare(b.name));
                    }

                    callback();
                    return;
                });

            }


            public loadApis() {

                var sApiName = <HTMLSelectElement>document.getElementById("sApiName");

                for (var index = 0; index < this.apis.length; index++) {
                    var api = this.apis[index];

                    var opt = <HTMLOptionElement>document.createElement("option");
                    opt.id = index.toString() + "_" + api.name;
                    opt.value = index.toString();
                    opt.innerText = api.name;

                    sApiName.add(opt);

                }

                // set first api as the current Api
                this.currentApi = this.apis[0];

            }

            public loadMethods() {

                var sApiMethodName = <HTMLSelectElement>document.getElementById("sApiMethodName");

                while (sApiMethodName.options.length > 0) {
                    sApiMethodName.remove(0);
                }

                for (var index = 0; index < this.currentApi.methods.length; index++) {
                    var method = this.currentApi.methods[index];

                    var opt = <HTMLOptionElement>document.createElement("option");
                    opt.id = index.toString() + "_" + method.name;
                    opt.value = index.toString();
                    opt.innerText = method.name;

                    sApiMethodName.add(opt);

                }

                // set the first method as current method
                this.currentMethod = this.currentApi.methods[0];

            }


            public requestJavascript() {

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

                        var elem = <HTMLInputElement>document.getElementById(id);

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
                var finalParamsWithGroup = []
                var finalParamsWithoutGroup = [];

                // fill an array with params and values from HTML DOM
                if (this.currentMethod.params != null) {
                    for (var i = 0; i < this.currentMethod.params.length; i++) {
                        // get the definition of the parameter
                        var p = this.currentMethod.params[i];
                        var id = (p.group != null && p.group != undefined) ? p.group + '_' + p.name : '0_' + p.name;

                        // get the HTML element
                        var elem = <HTMLInputElement>document.getElementById(id);

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
                        var g = <Array<string>>groups[i];

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

                // format for all parameters in groups
                for (var i in finalParamsWithGroup) {
                    text = text.replace('{' + i.toString() + '}', finalParamsWithGroup[i]);
                }

                // bug to correct. Pacth mode engaged !
                // You know "barbare mode" ? No ...fo sure, it's a french engaged mode.
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

            }

            public saveCurrentVariables() {

                if (this.currentMethod == null)
                    return;

                var divPanelBody = <HTMLDivElement>document.getElementById("divPanelBody");
                var inputApiName = <HTMLInputElement>document.getElementById("inputApiName");


                // All parameters for the current Api
                for (var i = 0; i < divPanelBody.children.length; i++) {
                    var elem = divPanelBody.children[i];

                    if (elem instanceof HTMLDivElement) {

                        for (var j = 0; j < (<HTMLInputElement>elem).children.length; j++) {
                            var inputElem = (<HTMLInputElement>elem).children[j];

                            if (inputElem instanceof HTMLInputElement) {

                                var input = <HTMLInputElement>inputElem;
                                var id = input.id;
                                if (id == null || id == "")
                                    continue;

                                var value = input.value;

                                this.cacheValue[id] = value;

                            }
                        }
                    }
                }

            }

            public changeApi(value: number) {

                // before changing currentMethod, saving values filled by user
                this.saveCurrentVariables();

                this.currentApi = this.apis[value];

                this.loadMethods();

                this.changeMethod(0);
            }

            public changeMethod(value: number) {

                // before changing currentMethod, saving values filled by user
                this.saveCurrentVariables();

                this.currentMethod = this.currentApi.methods[value];

                var divMethodName = <HTMLDivElement>document.getElementById("divMethodName");
                var divPanelBody = <HTMLDivElement>document.getElementById("divPanelBody");

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

            }

            public getParamForm(p: Param) {

                var val = "";
                var id = (p.group != null && p.group != undefined) ? p.group + '_' + p.name : '0_' + p.name;

                for (var k in this.cacheValue) {
                    if (this.cacheValue.hasOwnProperty(k) && k == id) {
                        val = this.cacheValue[k];
                    }
                }

                var req = "";  //p.isRequired ? "<span class='text-danger'>*</span>" : "";


                var div = '<div class="input-group"> ' +
                    '  <label class="input-group-addon" style="min-width:200px;" for= "' + id + '">' + p.description + '</label> ' +
                    req +
                    '  <input type="text" value="' + val + '" class="form-control" id = "' + id + '" placeholder = "' + p.name + '" > ' +
                    '  </input> ' +
                    '</div>';

                if (p.isType && p.isType == "file") {
                    div = '<div class="input-group"> ' +
                    '  <label class="input-group-addon" for= "' + id + '">' + p.description + '</label> ' +
                    req +
                    '<span class="btn btn-default btn-block btn-file pull-right" > ' +
                    'Browse <input type="file" id="sfile" /></span> ' +
                    '</div>';

                }
                if (p.isType && p.isType == "longtext") {
                    div = '<div class="form-group" > ' +
                    '  <label class="control-label" for= "' + id + '">' + p.description + '</label> ' +
                    req +
                    '  <textarea rows="5" value="' + val + '" class="form-control" id = "' + id + '" ></textarea> ' +
                    '</div> ';
                }

                return div;

            }

            public closeMessage() {

                var alertZone = <any>document.getElementById("alertZone");
                (<JQuery>$(".alert")).alert('close')
            }

            public showMessage(message: string, isError?: boolean) {
                var classM = isError ? 'alert-danger' : 'alert-info';
                var errorContent =
                    '<div class="alert ' + classM + ' fade in" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '<span class="sr-only">Close</span>' +
                    '</button> ' +
                    '<h4>An error occured !</h4> ' +
                    '<p>' + message + '</p>' +
                    '</div>';

                var divError = <HTMLDivElement>document.getElementById("alertZone");

                if (divError != null)
                    divError.innerHTML = errorContent;
            }

            public compileAndRun() {

                try {

                    var b = <any>$('#btnGetResponse');
                    b.button('loading');

                    // close message if open
                    this.closeMessage();

                    var code = this.jsEditor.getValue();

                    eval(code);

                } catch (e) {
                    console.error(e);
                }
            }

            public compress(s: any) {

                //// Compressed byte array can be converted into base64 to sumbit to server side to do something.
                //var b = Iuppiter.Base64.encode(s, true);

                //var bb = Iuppiter.toByteArray(b);
                //var db = Iuppiter.decompress(Iuppiter.Base64.decode(bb, true));

            }
        };

    }
}





var js = new BABYLON.Playground.Js(() => {
    // loading apis
    js.loadApis();
    // loading methods
    js.loadMethods();
    // loading params
    js.changeMethod(0);
});


$("#btnScript").click(() => {
    js.requestJavascript();
    var b = <any>$('#btnGetResponse');
    b.button('reset');
});


$("#btnGetResponse").click(() => {
    js.compileAndRun();
});

$("#sApiName").on("change", () => {
    var selector = <HTMLSelectElement>document.getElementById("sApiName");
    js.changeApi(+selector.value);
});

$("#sApiMethodName").on("change", () => {
    var selector = <HTMLSelectElement>document.getElementById("sApiMethodName");
    js.changeMethod(+selector.value);
});






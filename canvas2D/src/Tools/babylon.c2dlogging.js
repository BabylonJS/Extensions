var BABYLON;
(function (BABYLON) {
    // logging stuffs
    var C2DLogging = (function () {
        function C2DLogging() {
        }
        C2DLogging.logFrameRender = function (frameCount) {
            C2DLogging.snooze = true;
            C2DLogging._logFramesCount = frameCount;
        };
        C2DLogging.setPostMessage = function (message) {
            if (C2DLoggingInternals.enableLog) {
                C2DLoggingInternals.postMessages[C2DLoggingInternals.callDepth - 1] = message();
            }
        };
        C2DLogging._startFrameRender = function () {
            if (C2DLogging._logFramesCount === 0) {
                return;
            }
            C2DLogging.snooze = false;
        };
        C2DLogging._endFrameRender = function () {
            if (C2DLogging._logFramesCount === 0) {
                return;
            }
            C2DLogging.snooze = true;
            --C2DLogging._logFramesCount;
        };
        return C2DLogging;
    }());
    // Set to true to temporary disable logging.
    C2DLogging.snooze = true;
    C2DLogging._logFramesCount = 0;
    BABYLON.C2DLogging = C2DLogging;
    var C2DLoggingInternals = (function () {
        function C2DLoggingInternals() {
        }
        C2DLoggingInternals.computeIndent = function () {
            // Compute the indent
            var indent = null;
            if (C2DLoggingInternals.callDepth < 20) {
                indent = C2DLoggingInternals.depths[C2DLoggingInternals.callDepth];
            }
            else {
                indent = "|";
                for (var i = 0; i <= C2DLoggingInternals.callDepth; i++) {
                    indent = indent + "-";
                }
            }
            return indent;
        };
        C2DLoggingInternals.getFormattedValue = function (a) {
            if (a instanceof BABYLON.Prim2DBase) {
                return a.id;
            }
            if (a == null) {
                return "[null]";
            }
            return a.toString();
        };
        return C2DLoggingInternals;
    }());
    //-------------FLAG TO CHANGE TO ENABLE/DISABLE LOGGING ACTIVATION--------------
    // This flag can't be changed at runtime you must manually change it in the code
    C2DLoggingInternals.enableLog = false;
    C2DLoggingInternals.callDepth = 0;
    C2DLoggingInternals.depths = [
        "|-", "|--", "|---", "|----", "|-----", "|------", "|-------", "|--------", "|---------", "|----------",
        "|-----------", "|------------", "|-------------", "|--------------", "|---------------", "|----------------", "|-----------------", "|------------------", "|-------------------", "|--------------------"
    ];
    C2DLoggingInternals.postMessages = [];
    function logProp(message, alsoGet, setNoProlog, getNoProlog) {
        if (message === void 0) { message = ""; }
        if (alsoGet === void 0) { alsoGet = false; }
        if (setNoProlog === void 0) { setNoProlog = false; }
        if (getNoProlog === void 0) { getNoProlog = false; }
        return function (target, propName, descriptor) {
            if (!C2DLoggingInternals.enableLog) {
                return descriptor;
            }
            var getter = descriptor.get, setter = descriptor.set;
            if (getter && alsoGet) {
                descriptor.get = function () {
                    if (C2DLogging.snooze) {
                        return getter.call(this);
                    }
                    else {
                        var indent = C2DLoggingInternals.computeIndent();
                        var id = this.id || "";
                        if (message !== null && message !== "") {
                            console.log(message);
                        }
                        var isSPP = this instanceof BABYLON.SmartPropertyPrim;
                        var flags = isSPP ? this._flags : 0;
                        var depth = C2DLoggingInternals.callDepth;
                        if (!getNoProlog) {
                            console.log(indent + " [" + id + "] (" + depth + ") ==> get " + propName + " property");
                        }
                        ++C2DLoggingInternals.callDepth;
                        C2DLogging.setPostMessage(function () { return "[no msg]"; });
                        // Call the initial getter
                        var r = getter.call(this);
                        --C2DLoggingInternals.callDepth;
                        var flagsStr = "";
                        if (isSPP) {
                            var nflags = this._flags;
                            var newFlags = this._getFlagsDebug((nflags & flags) ^ nflags);
                            var removedFlags = this._getFlagsDebug((nflags & flags) ^ flags);
                            flagsStr = "";
                            if (newFlags !== "") {
                                flagsStr = " +++[" + newFlags + "]";
                            }
                            if (removedFlags !== "") {
                                if (flagsStr !== "") {
                                    flagsStr += ",";
                                }
                                flagsStr += " ---[" + removedFlags + "]";
                            }
                        }
                        console.log(indent + " [" + id + "] (" + depth + ")" + (getNoProlog ? "" : " <==") + " get " + propName + " property => " + C2DLoggingInternals.getFormattedValue(r) + flagsStr + ", " + C2DLoggingInternals.postMessages[C2DLoggingInternals.callDepth]);
                        return r;
                    }
                };
            }
            // Overload the property setter implementation to add our own logic
            if (setter) {
                descriptor.set = function (val) {
                    if (C2DLogging.snooze) {
                        setter.call(this, val);
                    }
                    else {
                        var indent = C2DLoggingInternals.computeIndent();
                        var id = this.id || "";
                        if (message !== null && message !== "") {
                            console.log(message);
                        }
                        var isSPP = this instanceof BABYLON.SmartPropertyPrim;
                        var flags = isSPP ? this._flags : 0;
                        var depth = C2DLoggingInternals.callDepth;
                        if (!setNoProlog) {
                            console.log(indent + " [" + id + "] (" + depth + ") ==> set " + propName + " property with " + C2DLoggingInternals.getFormattedValue(val));
                        }
                        ++C2DLoggingInternals.callDepth;
                        C2DLogging.setPostMessage(function () { return "[no msg]"; });
                        // Change the value
                        setter.call(this, val);
                        --C2DLoggingInternals.callDepth;
                        var flagsStr = "";
                        if (isSPP) {
                            var nflags = this._flags;
                            var newFlags = this._getFlagsDebug((nflags & flags) ^ nflags);
                            var removedFlags = this._getFlagsDebug((nflags & flags) ^ flags);
                            flagsStr = "";
                            if (newFlags !== "") {
                                flagsStr = " +++[" + newFlags + "]";
                            }
                            if (removedFlags !== "") {
                                if (flagsStr !== "") {
                                    flagsStr += ",";
                                }
                                flagsStr += " ---[" + removedFlags + "]";
                            }
                        }
                        console.log(indent + " [" + id + "] (" + depth + ")" + (setNoProlog ? "" : " <==") + " set " + propName + " property, " + C2DLoggingInternals.postMessages[C2DLoggingInternals.callDepth] + flagsStr);
                    }
                };
            }
            return descriptor;
        };
    }
    BABYLON.logProp = logProp;
    function logMethod(message, noProlog) {
        if (message === void 0) { message = ""; }
        if (noProlog === void 0) { noProlog = false; }
        return function (target, key, descriptor) {
            if (!C2DLoggingInternals.enableLog) {
                return descriptor;
            }
            if (descriptor === undefined) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            var originalMethod = descriptor.value;
            //editing the descriptor/value parameter
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (C2DLogging.snooze) {
                    return originalMethod.apply(this, args);
                }
                else {
                    var a = args.map(function (a) { return C2DLoggingInternals.getFormattedValue(a) + ", "; }).join();
                    a = a.slice(0, a.length - 2);
                    var indent = C2DLoggingInternals.computeIndent();
                    var id = this.id || "";
                    if (message !== null && message !== "") {
                        console.log(message);
                    }
                    var isSPP = this instanceof BABYLON.SmartPropertyPrim;
                    var flags = isSPP ? this._flags : 0;
                    var depth = C2DLoggingInternals.callDepth;
                    if (!noProlog) {
                        console.log(indent + " [" + id + "] (" + depth + ") ==> call: " + key + " (" + a + ")");
                    }
                    ++C2DLoggingInternals.callDepth;
                    C2DLogging.setPostMessage(function () { return "[no msg]"; });
                    // Call the method!
                    var result = originalMethod.apply(this, args);
                    --C2DLoggingInternals.callDepth;
                    var flagsStr = "";
                    if (isSPP) {
                        var nflags = this._flags;
                        var newFlags = this._getFlagsDebug((nflags & flags) ^ nflags);
                        var removedFlags = this._getFlagsDebug((nflags & flags) ^ flags);
                        flagsStr = "";
                        if (newFlags !== "") {
                            flagsStr = " +++[" + newFlags + "]";
                        }
                        if (removedFlags !== "") {
                            if (flagsStr !== "") {
                                flagsStr += ",";
                            }
                            flagsStr += " ---[" + removedFlags + "]";
                        }
                    }
                    console.log(indent + " [" + id + "] (" + depth + ")" + (noProlog ? "" : " <==") + " call: " + key + " (" + a + ") Res: " + C2DLoggingInternals.getFormattedValue(result) + ", " + C2DLoggingInternals.postMessages[C2DLoggingInternals.callDepth] + flagsStr);
                    return result;
                }
            };
            // return edited descriptor as opposed to overwriting the descriptor
            return descriptor;
        };
    }
    BABYLON.logMethod = logMethod;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.c2dlogging.js.map

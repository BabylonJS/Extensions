var BABYLON;
(function (BABYLON) {
    /* Babylon Scene Navigation Agent AI */
    var NavigationAgent = (function () {
        function NavigationAgent(owner) {
            if (owner == null)
                throw new Error("Null owner agent mesh specified.");
            this._mesh = owner;
            this._info = (this._mesh.metadata != null && this._mesh.metadata.navAgent != null) ? this._mesh.metadata.navAgent : null;
        }
        Object.defineProperty(NavigationAgent.prototype, "mesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationAgent.prototype, "info", {
            get: function () {
                return this._info;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavigationAgent.prototype, "hasAgentInfo", {
            get: function () {
                return (this.info != null);
            },
            enumerable: true,
            configurable: true
        });
        NavigationAgent.prototype.setDestination = function (destination) {
            if (this.hasAgentInfo) {
            }
            else {
                if (console)
                    console.warn("Null navigation agent metadata. Set agent destination ignored.");
            }
        };
        return NavigationAgent;
    }());
    BABYLON.NavigationAgent = NavigationAgent;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.scenenavagent.js.map

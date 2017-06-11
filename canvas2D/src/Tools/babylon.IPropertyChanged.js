var BABYLON;
(function (BABYLON) {
    var PropertyChangedInfo = (function () {
        function PropertyChangedInfo() {
        }
        return PropertyChangedInfo;
    }());
    BABYLON.PropertyChangedInfo = PropertyChangedInfo;
    /**
     * The purpose of this class is to provide a base implementation of the IPropertyChanged interface for the user to avoid rewriting a code needlessly.
     * Typical use of this class is to check for equality in a property set(), then call the onPropertyChanged method if values are different after the new value is set. The protected method will notify observers of the change.
     * Remark: onPropertyChanged detects reentrant code and acts in a way to make sure everything is fine, fast and allocation friendly (when there no reentrant code which should be 99% of the time)
     */
    var PropertyChangedBase = (function () {
        function PropertyChangedBase() {
            this._propertyChanged = null;
        }
        /**
         * Protected method to call when there's a change of value in a property set
         * @param propName the name of the concerned property
         * @param oldValue its old value
         * @param newValue its new value
         * @param mask an optional observable mask
         */
        PropertyChangedBase.prototype.onPropertyChanged = function (propName, oldValue, newValue, mask) {
            if (this.propertyChanged.hasObservers()) {
                var pci = PropertyChangedBase.calling ? new PropertyChangedInfo() : PropertyChangedBase.pci;
                pci.oldValue = oldValue;
                pci.newValue = newValue;
                pci.propertyName = propName;
                try {
                    PropertyChangedBase.calling = true;
                    this.propertyChanged.notifyObservers(pci, mask);
                }
                finally {
                    PropertyChangedBase.calling = false;
                }
            }
        };
        Object.defineProperty(PropertyChangedBase.prototype, "propertyChanged", {
            /**
             * An observable that is triggered when a property (using of the XXXXLevelProperty decorator) has its value changing.
             * You can add an observer that will be triggered only for a given set of Properties using the Mask feature of the Observable and the corresponding Prim2DPropInfo.flagid value (e.g. Prim2DBase.positionProperty.flagid|Prim2DBase.rotationProperty.flagid to be notified only about position or rotation change)
             */
            get: function () {
                if (!this._propertyChanged) {
                    this._propertyChanged = new BABYLON.Observable();
                }
                return this._propertyChanged;
            },
            enumerable: true,
            configurable: true
        });
        return PropertyChangedBase;
    }());
    PropertyChangedBase.pci = new PropertyChangedInfo();
    PropertyChangedBase.calling = false;
    BABYLON.PropertyChangedBase = PropertyChangedBase;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.IPropertyChanged.js.map

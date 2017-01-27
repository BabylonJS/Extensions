/// <reference path="./Panel.ts"/>
/// <reference path="./Label.ts"/>
/// <reference path="./Button.ts"/>
module DIALOG{
    export class Menu extends BasePanel implements RadioGroup{
        private _menu : BasePanel;
        private _selectedIndex : number;
        private _callbacks = new Array<(button: Button) => void>();
        /**
         * @param {string} title - Optional mesh to display above the menu buttons
         * @param {[string]} labels - Each string results in a menu button created using it as the text
         * @param {number} layoutDir - Vertical for menus, but allow sub-classes like a TabbedPanel to set to horizontal
         * @param {boolean} topLevel - Give a menu the opportunity to be a top level panel
         */
        constructor(title : string, labels: [string], layoutDir = Panel.LAYOUT_VERTICAL, topLevel? : boolean){
            super(title, DialogSys._scene, null, null, false, Panel.LAYOUT_VERTICAL, topLevel);
            this.setBorderVisible(true);
            
            if (title && title != null && title.replace(' ', '').length > 0){
                var titlePanel = new DIALOG.Label(title);
                titlePanel.horizontalAlignment = Panel.ALIGN_HCENTER;
                super.addSubPanel(titlePanel);
            }
            this._menu = new BasePanel('menu-' + title, DialogSys._scene, null, null, false, layoutDir);
            for (var i = 0; i < labels.length; i++){
                var button = new Button(labels[i], Button.RADIO_BUTTON);
                button.stretchHorizontal = layoutDir === Panel.LAYOUT_VERTICAL;
                button.radioGroup = this;
                
                this._menu.addSubPanel(button);
            }
            super.addSubPanel(this._menu);
        }
        
        public assignMenuCallback(itemIdx : number, func: (button: Button) => void): void {
            this._callbacks[itemIdx] = func;
        }
        // ===================================== RadioGroup Impl =====================================
        /**
         * called by Buttons that have a RadioGroup (this) assigned to them
         * @param {BasePanel} reporter - This is the button report in that it has been clicked
         */
        public reportSelected(reporter : BasePanel) : void{
            var subs = this._menu.getSubPanels();
            for (var i = 0; i < subs.length; i++){ 
                var sub = <Button> subs[i];            
                if (sub != reporter){
                    (sub).setSelected(false, true);
                    
                } else {
                    this._selectedIndex = i;
                    if (this._callbacks[i] && this._callbacks[i] !== null) this._callbacks[i](sub);
                } 
            }
        }
        public get selectedIndex(): number { return this._selectedIndex; }
        public set selectedIndex(index : number) {
            (<Button> this._menu.getSubPanels()[index]).setSelected(true);
        }
        // ======================================== Overrides ========================================
        /**
         * @override
         * Add a Button to the end of the menu, or at the index passed.
         * Also make room in _callbacks.
         * 
         * @param {BasePanel} sub - Button to be added.
         * @param {number} index - the position at which to add the Gutton
         */
        public addSubPanel(sub : BasePanel, index? :number) : void{
            if (sub && !(sub instanceof Button)){
                BABYLON.Tools.Error("Labels can contain only Buttons");
                return;
            }
            this._menu.addSubPanel(sub, index);
            
            // keep _callbacks in sync
            if (index){
                this._callbacks.splice(index, 0, null);
            }else{
                this._callbacks.push(null);
            }
        }
        /**
         * @override
         * remove a sub-panel & callback
         * @param {number} index - the index of the button to be removed
         */
        removeAt(index : number) : void{
            super.removeAt(index);
            this._callbacks.splice(index, 1);
        }
        
        /**
         * @override
         * remove all menu buttons  & callback
         */
        removeAll() : void{
            super.removeAll();
            this._callbacks = new Array<(button: Button) => void>();
        }
    }
}
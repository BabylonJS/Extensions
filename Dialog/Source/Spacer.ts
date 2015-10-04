/// <reference path="./Panel.ts"/>
module DIALOG{
    export class Spacer extends BasePanel{        
        /**
         * Sub-class of BasePanel containing no geometry.  Used to assign blank space.  Actual space
         * that a unit occupies is relative to the total units that the top level panel requires in that
         * dimension.  Best to put in spacer with 0,0 during dev.  Once rest is settled, then tune here.
         * 
         * @param {number} vertUnits       - The amount of space in the vertical   dimension.
         * @param {number} horizontalUnits - The amount of space in the horizontal dimension.
         */
        constructor(vertUnits: number, horizontalUnits : number){
            super(null, DialogSys._scene);
            
            this.verticalMargin   = vertUnits;
            this.horizontalMargin = horizontalUnits;  
            this.setEnabled(false);           
        }
        // ======================================== Overrides ========================================
        /**
         * @override
         */
        public useGeometryForBorder() : boolean{
            return false;
        }

        /**
         * @override
         * No meaning for spacers
         */
        public addSubPanel(sub : Panel, index? :number) : void{
            BABYLON.Tools.Error("spacers can have no sub-panels");
        }
        
        /** @override */ public getSubPanel() : Array<Panel>{ return <Array<Panel>> null; }
        /** @override */ public removeAt(index : number, doNotDispose? : boolean) : void{}
        /** @override */ public removeAll(doNotDispose? : boolean) : void{}
     }
}
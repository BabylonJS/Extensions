/// <reference path="../Libs/babylon.d.ts"/>

module BABYLONX {
    
    /**
     * The class responsible to watch input files through drag and drop.
     */
    export class FilesInput {
        private _elementToMonitor: HTMLElement;
        private _filesToLoad: File[];
        private _loadCallback: (files: string[]) => void = null;

        /**
         * Constructor.
         * @param elementToMonitor The html element to monitor for drop.
         * @param loadCallback The callback launched when a file has been loaded.
         */
        constructor(elementToMonitor: HTMLElement, loadCallback: (files: string[]) => void) {
            if (elementToMonitor) {
                this._elementToMonitor = elementToMonitor;
                this._elementToMonitor.addEventListener("dragenter", (e) => { this._drag(e); }, false);
                this._elementToMonitor.addEventListener("dragover", (e) => { this._drag(e); }, false);
                this._elementToMonitor.addEventListener("drop", (e) => { this._drop(e); }, false);
            }
            this._loadCallback = loadCallback;
        }

        /**
         * Function triggered on drag on the watched element.
         * @param e the drag event.
         */
        private _drag(e): void {
            e.stopPropagation();
            e.preventDefault();
        }

        /**
         * Function triggered on drop on the watched element.
         * @param eventDrop the drop event.
         */
        private _drop(eventDrop): void {
            eventDrop.stopPropagation();
            eventDrop.preventDefault();

            this._loadFiles(eventDrop);
        }

        /**
         * Load the list of dropped files in the cache.
         * @param event the drop event.
         */
        private _loadFiles(event): void {
            // Handling data transfer via drag'n'drop
            if (event && event.dataTransfer && event.dataTransfer.files) {
                this._filesToLoad = event.dataTransfer.files;
            }

            // Handling files from input files
            if (event && event.target && event.target.files) {
                this._filesToLoad = event.target.files;
            }

            // Add the file to the know babylon file list.
            var fileNames = [];
            if (this._filesToLoad && this._filesToLoad.length > 0) {
                for (var i = 0; i < this._filesToLoad.length; i++) {
                    BABYLON.FilesInput.FilesToLoad[this._filesToLoad[i].name] = this._filesToLoad[i];
                    fileNames.push(this._filesToLoad[i].name);
                }
            }

            // Trigger callback if required.
            if (this._loadCallback) {
                this._loadCallback(fileNames);
            }
        }
    }
}
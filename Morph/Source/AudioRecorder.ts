module MORPH {
    /** has its origins from:  http://bytearray.org/wp-content/projects/WebAudioRecorder/ */
    export class AudioRecorder{
        private context : AudioContext;
        
        public initialized = false;  // set in prepMic; will remain false if WebAudio or navigator.getUserMedia not supported
        public playbackReady = false;
        public recording = false;
        private requestedDuration : number;
        private startTime : number;
        private completionCallback : () => void;
                
        // arrays of FloatArrays made during recording
        private leftchannel  = new Array<Float32Array>();
        private rightchannel = new Array<Float32Array>();

        // consolidated versions of the buffer, after recording for playback or written to .WAV
        private leftBuffer  : Float32Array;
        private rightBuffer : Float32Array;

        private recorder : ScriptProcessorNode = null;
        private recordingLength = 0;
        private volume : GainNode = null;
        private audioInput = null;
        
        private objectUrl : string;
        
        private static instance : AudioRecorder;
        public static getInstance(doneCallback? : () => void) : AudioRecorder{
            if (AudioRecorder.instance) return AudioRecorder.instance;
            
            AudioRecorder.instance = new AudioRecorder();
            AudioRecorder.instance.completionCallback = doneCallback ? doneCallback : null;
            
            var audioContext = window.AudioContext || window.webkitAudioContext;
            if (audioContext) {
                window.alert('Asking for audio recording permission in advance,\nto avoid asking when actually trying to record.');
            
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (navigator.getUserMedia){
                    navigator.getUserMedia(
                         {audio:true}, 
                        
                         AudioRecorder.prepMic, 
                         
                         function(stream : any) { 
                             window.alert('Error capturing audio.' + stream); 
                             if (typeof doneCallback !== "Undefined") doneCallback();
                         }
                    );
                    
                 } else {
                    window.alert('Navigator.getUserMedia not supported.');
                 }
                
            }else{
                window.alert('WebAudio not supported');
            }              
            return AudioRecorder.instance;
        }
        
        /**
         *  static because it is in a callback for navigator.getUserMedia()
         */
        private static prepMic(stream : any){
            AudioRecorder.instance.context = new (window.AudioContext || window.webkitAudioContext)();
            AudioRecorder.instance.context.sampleRate = 44100; // 11,025 Hz 4 bit ADPCM (Adaptive differential pulse-code modulation)
            
            // creates a gain node
            AudioRecorder.instance.volume = AudioRecorder.instance.context.createGain();

            // creates an audio node from the microphone incoming stream
            AudioRecorder.instance.audioInput = AudioRecorder.instance.context.createMediaStreamSource(stream);

            // connect the stream to the gain node
            AudioRecorder.instance.audioInput.connect(AudioRecorder.instance.volume);

            /* From the spec: This value controls how frequently the audioprocess event is 
            dispatched and how many sample-frames need to be processed each call. 
            Lower values for buffer size will result in a lower (better) latency. 
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 4096;
            AudioRecorder.instance.recorder = AudioRecorder.instance.context.createScriptProcessor(bufferSize, 2, 2);

            // cannot reference using 'this' inside of callback
            AudioRecorder.instance.recorder.onaudioprocess = function(e){
                if (!AudioRecorder.instance.recording) return;
                var left = e.inputBuffer.getChannelData (0);
                var right = e.inputBuffer.getChannelData (1);
                // we clone the samples
                AudioRecorder.instance.leftchannel.push (new Float32Array (left));
                AudioRecorder.instance.rightchannel.push (new Float32Array (right));
                AudioRecorder.instance.recordingLength += bufferSize;

                // determine if the duration required has yet occurred
                if (AudioRecorder.instance.requestedDuration !== Number.MAX_VALUE && Mesh.now() - AudioRecorder.instance.requestedDuration >= AudioRecorder.instance.startTime) AudioRecorder.instance.recordStop();
            };

            // we connect the recorder
            AudioRecorder.instance.volume.connect (AudioRecorder.instance.recorder);
            AudioRecorder.instance.recorder.connect (AudioRecorder.instance.context.destination); 
            AudioRecorder.instance.initialized = true;
            
            // let webpage enable controls accordingly
           if (AudioRecorder.instance.completionCallback){
               AudioRecorder.instance.completionCallback();
               AudioRecorder.instance.completionCallback = null;
           }
        }
        // ==================================== Recording Methods ====================================    
        public recordStart(durationMS = Number.MAX_VALUE, doneCallback? : () => void){
            if (this.recording){ BABYLON.Tools.Warn("already recording"); return; }
            this.recording = true;
            this.requestedDuration = durationMS;
            this.startTime = Mesh.now();
            this.completionCallback = doneCallback ? doneCallback : null;
            
            // delete previous merged buffers, if they exist
            this.leftBuffer = this.rightBuffer = null;
            this.playbackReady = false;
        }

        public recordStop() : void{
            if (!this.recording) {BABYLON.Tools.Warn("recordStop when not recording"); return; }
            this.recording = false;
            // we flatten the left and right channels down
            this.leftBuffer  = this.mergeBuffers (this.leftchannel );
            this.rightBuffer = this.mergeBuffers (this.rightchannel);
            this.playbackReady = true;
            
            this.clean();
            if (this.completionCallback) this.completionCallback();
        }
            
        private mergeBuffers(channelBuffers : Array<Float32Array>) : Float32Array{
            var result = new Float32Array(this.recordingLength);
            var offset = 0;
            var lng = channelBuffers.length;
            for (var i = 0; i < lng; i++){
                var buffer = channelBuffers[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }
            return result;
        }
        
        private clean() : void {
            if (this.objectUrl){
                (window.webkitURL || window.URL).revokeObjectURL(this.objectUrl);
                this.objectUrl = null;
            }
            
            // reset the buffers for the new recording
            this.leftchannel.length = this.rightchannel.length = 0;
            this.recordingLength = 0;
        }
        // ==================================== Playback Methods =====================================    
        public playback(censoredDur : Array<number> = null) : void {
            if (!this.playbackReady) {BABYLON.Tools.Warn("playback when not playbackReady"); return; }
            var newSource = this.context.createBufferSource();
            var newBuffer = this.context.createBuffer(2, this.leftBuffer.length, this.context.sampleRate);
            
            var left  = this.embedBeep(this.leftBuffer , censoredDur);
            var right = this.embedBeep(this.rightBuffer, censoredDur);
            newBuffer.getChannelData(0).set(left );
            newBuffer.getChannelData(1).set(right);
            newSource.buffer = newBuffer;

            newSource.connect( this.context.destination );
            newSource.start(0);
        }
        // ====================================== Saving Methods =====================================    
        public saveToWAV(filename : string, stereo = true, censoredDur : Array<number> = null) : void{
            if (!this.playbackReady) {BABYLON.Tools.Warn("save when not playbackReady"); return; }
            
            if (filename.length === 0){
                window.alert("No name specified");
                return;
            }
            else if (filename.toLowerCase().lastIndexOf(".wav") !== filename.length - 4 || filename.length < 5){
                filename += ".wav";
            }
            
            var blob = new Blob ( [ this.encodeWAV(stereo ? 2 : 1, censoredDur) ], { type : 'audio/wav' } );
        
            // turn blob into an object URL; saved as a member, so can be cleaned out later 
            this.objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
            
            var link = window.document.createElement('a');
            link.href = this.objectUrl;
            link.download = filename;
            var click = document.createEvent("MouseEvents");
            click.initEvent("click", true, false);
            link.dispatchEvent(click);          
        }
        
        private encodeWAV(nChannels : number, censoredDur : Array<number>) : DataView{
            // censor as required
            var left = this.embedBeep(this.leftBuffer, censoredDur);
            var right = (nChannels === 2) ? this.embedBeep(this.rightBuffer, censoredDur) : null;
            
            // we interleave both channels together, if stereo
            var interleaved = (nChannels === 2) ? this.interleave(left, right) : left;
            var dataSize = interleaved.length * 2;  // 2 bytes per byte to also include volume with each
            var headerSize = 44;
            var blockAlign = nChannels * 2;

            var buffer = new ArrayBuffer(headerSize + dataSize);
            var view = new DataView(buffer);
        
            // - - - - - - RIFF chunk (chunkID, chunkSize, data)
            this.writeUTFBytes(view, 0, 'RIFF');
            view.setUint32(4, headerSize + dataSize, true);
            this.writeUTFBytes(view, 8, 'WAVE');
            
            // - - - - - - FMT inner-chunk (chunkID, chunkSize, data)
            this.writeUTFBytes(view, 12, 'fmt ');
            view.setUint32(16, 16, true);  // size of FMT inner-chunk
            
            // format WAVEFORMATEX, http://msdn.microsoft.com/en-us/library/windows/desktop/dd390970%28v=vs.85%29.aspx
            view.setUint16(20, 1, true); // WAVEFORMATEX
            view.setUint16(22, nChannels, true);
            view.setUint32(24, this.context.sampleRate, true);
            view.setUint32(28, this.context.sampleRate * blockAlign, true); // nAvgBytesPerSec
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, 16, true); // bits per sample (same for mono / stereo, since stereo is 2 samples)
            
            // - - - - - - data inner-chunk (chunkID, chunkSize, data)
            this.writeUTFBytes(view, 36, 'data');
            view.setUint32(40, dataSize, true);
        
            // write the PCM samples
            var lng = interleaved.length;
            var index = headerSize;
            var volume = 1;
            // write each byte of data + volume byte
            for (var i = 0; i < lng; i++){
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }
            return view;
        }
        
        private embedBeep(channelBuffer : Float32Array, censoredDur : Array<number>) : Float32Array{
            if (!censoredDur) return channelBuffer;
            
            var result = new Float32Array(channelBuffer);
            for (var i = 0; i < censoredDur.length; i+=2){
                var begin = Math.round(this.context.sampleRate * (censoredDur[i    ] / 1000));
                var end   = Math.round(this.context.sampleRate * (censoredDur[i + 1] / 1000));
                console.log("begin: " + begin + ", end " + end + ", length " + channelBuffer.length  + ", sample rate " +this.context.sampleRate);
                for(var j = begin; j <  end; j++){
                    result[j] = 0;
                }
            }
            return result;
        }
        
        private interleave(left :Float32Array, right : Float32Array) : Float32Array{
            var length = left.length + right.length;
            var result = new Float32Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length; ){
                result[index++] = left[inputIndex];
                result[index++] = right[inputIndex];
                inputIndex++;
            }
            return result;
        }
        
        private writeUTFBytes(view, offset, string){ 
            var lng = string.length;
            for (var i = 0; i < lng; i++){
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }
    }
}
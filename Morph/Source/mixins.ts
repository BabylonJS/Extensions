interface Navigator {
    isCocoonJS: boolean; // delete once using babylon.2.0.d.ts
    
    getUserMedia(
        options: { video?: boolean; audio?: boolean; }, 
        success: (stream: any) => void, 
        error?: (error: string) => void
    ) : void;
    
    webkitGetUserMedia(
        options: { video?: boolean; audio?: boolean; }, 
        success: (stream: any) => void, 
        error?: (error: string) => void
    ) : void;
    
    mozGetUserMedia(
        options: { video?: boolean; audio?: boolean; }, 
        success: (stream: any) => void, 
        error?: (error: string) => void
    ) : void;
}

interface Window {
   AudioContext : AudioContext;
   webkitAudioContext : AudioContext;
}

interface HTMLAnchorElement{
    download : string;
}

interface HTMLURL{
    revokeObjectURL : (string) => void;
}

interface AudioContext {
    new (): any;
    destination : AudioDestinationNode;
    sampleRate : number;
    currentTime : number;
//    listener : AudioListener;
    state : AudioContextState;
    suspend ();
    resume ();
    close ();
    onstatechange : () => void;
    createBuffer (numberOfChannels : number, length : number, sampleRate : number) : AudioBuffer;
//    decodeAudioData (audioData : ArrayBuffer, successCallback? : (decodedData : AudioBuffer) => void, errorCallback? : (DOMException : any) => void) : AudioBuffer;
    createBufferSource () : AudioBufferSourceNode;
//    createMediaElementSource (mediaElement : HTMLMediaElement) : MediaElementAudioSourceNode;
    createMediaStreamSource (mediaStream : any) : MediaStreamAudioSourceNode;
//    createMediaStreamDestination () : MediaStreamAudioDestinationNode;
//    createAudioWorker (scriptURL : string, numberOfInputChannels? : number, numberOfOutputChannels? : number) : AudioWorkerNode;
    createScriptProcessor (bufferSize? : number, numberOfInputChannels? : number , numberOfOutputChannels? : number) : ScriptProcessorNode;
//    createAnalyser () : AnalyserNode;
    createGain () : GainNode;
//    createDelay (maxDelayTime? : number) : DelayNode;
//    createBiquadFilter () : BiquadFilterNode;
//    createWaveShaper () : WaveShaperNode;
//    createPanner () : PannerNode;
//    createStereoPanner () : StereoPannerNode;
//   createConvolver () : ConvolverNode;
//    createChannelSplitter (numberOfOutputs? : number) : ChannelSplitterNode;
//    createChannelMerger (numberOfInputs? : number ) : ChannelMergerNode;
//    createDynamicsCompressor () : DynamicsCompressorNode;
//    createOscillator () : OscillatorNode;
//    createPeriodicWave (real : Float32Array, imag : Float32Array) : PeriodicWave;
}

interface AudioBuffer {
    sampleRate : number;
    length : number;
    duration : number;
    numberOfChannels : number;
    getChannelData (channel : number) : Float32Array;
    copyFromChannel (destination : Float32Array, channelNumber : number, startInChannel? : number) : void;
    copyToChannel (source : Float32Array, channelNumber : number, startInChannel? : number) : void;
}

enum AudioContextState {
    "suspended",
    "running",
    "closed"
}

interface AudioNode  {
    connect (destination : AudioNode, output? : number, input? : number) : void;
    connect (destination : AudioParam, output? : number) : void;
    disconnect (output? : number) : void;
    context : AudioContext;
    numberOfInputs : number;
    numberOfOutputs : number;
    channelCount : number;
    channelCountMode : number;
    channelInterpretation : any;
}

interface GainNode extends AudioNode {
    gain : AudioParam;
}

interface AudioDestinationNode extends AudioNode {
    maxChannelCount : number;
}

interface ScriptProcessorNode extends AudioNode {
    onaudioprocess: (any) => void;
    bufferSize : number;
}

interface AudioBufferSourceNode extends AudioNode {
    buffer : AudioBuffer;
    playbackRate : AudioParam;
    detune : AudioParam;
    loop : boolean;
    loopStart : number;
    loopEnd : number;
    
    start (when? : number,  offset? : number, duration? : number) : void;
    stop (when? : number) :void;
    onended : any;
}

interface MediaStreamAudioSourceNode extends AudioNode {
}

interface AudioParam {
    value : number;
    defaultValue : number;
    setValueAtTime (value : number, startTime : number) : void;
    linearRampToValueAtTime (value : number, endTime : number) : void;
    exponentialRampToValueAtTime (value : number, endTime : number) : void;
    setTargetAtTime (target : number, startTime : number, timeConstant : number) : void;
    setValueCurveAtTime (values : Float32Array, startTime : number, duration : number) : void;
    cancelScheduledValues (startTime : number) : void;
}

/*interface AudioWorkerNode extends AudioNode {
    terminate () : void;
    postMessage (message : string, transfer? : any) : void;
                attribute EventHandler onmessage;
    addParameter (DOMString name, optional float defaultValue) : AudioParam;
    void       removeParameter (DOMString name);
} */

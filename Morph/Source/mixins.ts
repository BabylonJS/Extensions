interface Navigator {
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

interface HTMLAnchorElement{
    download : string;
}

interface HTMLURL{
    revokeObjectURL : (string) => void;
}


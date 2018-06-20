export class EncodedImage {
    data : number[] = [];
    
    constructor(){};

    get(){
        return this.data as number[];
    }

    write(byte:number){
        this.data.push(byte);
    }

    writeArray(array:number[], arraySize:number){
        for (let i = 0; i < arraySize; i++){
            this.write(array[i]);
        }
    }

    writeUTF(UTF:string){
        for(let i = 0; i < UTF.length; i++){
            this.write(UTF.charCodeAt(i));
        }
    }

    writeColor(color:string){
        if(!/(^[0-9a-fA-F]{5})\w/.test(color)) throw new Error('Image encoding error, color string validation error')
        else{
            for (let i = 0; i < color.length; i+=2) {
                const intValue : number = parseInt(color[i]+color[i+1], 16);
                this.write(intValue);
                
            }
        }
        
    }
    
    writeLittleEndian(num: number){
        this.write(num & 0xff);
        this.write((num >> 8) & 0xff);
    }

}
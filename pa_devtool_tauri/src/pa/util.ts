
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace pautil{
    export const remove_i_of_array=<T>(i:number,array:T[])=>{
        if(i<0||i>=array.length){
            return;
        }
        for(let ii=i;i<array.length-1;i++){
            array[i]=array[i+1];
        }
        array.pop();
    }
}
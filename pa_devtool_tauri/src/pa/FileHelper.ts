
import {invoke} from "@tauri-apps/api";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileHelper{
    export const open_dir=(dir:string)=>{
        invoke("open_dir", {dir:dir})
    }
}
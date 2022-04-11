import {createDir, readDir, readTextFile, writeFile} from "@tauri-apps/api/fs"
import {configDir, sep, dataDir,} from "@tauri-apps/api/path";
import {pautil} from "@/pa/util";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Storage {

    export class ConfigStruct {

    }

    export class ProjectDisc {
        project_path = ""
        constructor(project_path:string) {
            this.project_path=project_path
        }
    }

    export class DataStruct {
        //
        project_dirs: Array<ProjectDisc> = []
        _next_cmd_id=1;
        get_next_cmd_id(){
            const ret=this._next_cmd_id;
            this._next_cmd_id++;
            this._next_cmd_id%=2147483647;

            return ret;
        }
        copyfrom(dataStuct:DataStruct){
            this.project_dirs=dataStuct.project_dirs;
        }
    }
    const data_file_path="./data.json"
    export const load_data = async (tar: DataStruct)=> {
        return readTextFile(data_file_path)
            .then((res) => {
                console.log("read data succ:", res)
                const parse=JSON.parse(res)
                tar.copyfrom(parse);
                console.log("change tar", tar)
            })
            .catch((res) => {
                console.log("read data fail:", res)
                writeFile({
                        /** Path to the file to write. */
                        path: data_file_path,
                        /** The UTF-8 string to write to the file. */
                        contents: JSON.stringify(tar)
                    }
                )
                    .then(
                    )


            })
    }

    export const save_data=async (cur:DataStruct)=>{
        writeFile({
            /** Path to the file to write. */
            path: data_file_path,
            /** The UTF-8 string to write to the file. */
            contents: JSON.stringify(cur)
        }).then()
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace ope_data{
        export const delete_prj_i=(data:DataStruct,i:number)=>{
            pautil.remove_i_of_array(i,data.project_dirs);
            save_data(data);
        }

    }

    export class ScriptData{
        name=""
        cmd=""
        copyfrom(d:ScriptData){
            this.name=d.name
            this.cmd=d.cmd
        }
        constructor(name:string,cmd:string) {
            this.name=name;
            this.cmd=cmd;
        }
    }
    export class ProjectData{
        script_list:ScriptData[]=[]
        copyfrom(p:ProjectData){
            this.script_list=p.script_list
        }
    }

    const project_data_dir=".pa_devtool"
    const project_data_file="data.json"
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace ope_project{
        export const read_project_data=async (
            prj_disc:ProjectDisc,
            write2:ProjectData
        )=>{
            readTextFile(prj_disc.project_path+sep+project_data_dir
                +sep+project_data_file
            ).then((res)=>{//读取项目数据
              try {
                  write2.copyfrom(JSON.parse(res));
              }catch (err){
                  console.log(err)
              }
            }).catch(
                ()=>{
                    const p=new ProjectData()
                    write2.copyfrom(p)
                    save_project_data(prj_disc,write2)
                }
            )
        }
        export const add_project_script=(
            prj_disc:ProjectDisc,
            prj_data:ProjectData,
            script:ScriptData)=>{
            // console.log("prjdata",prj_data)
            prj_data.script_list.push(script);
            save_project_data(prj_disc,prj_data);
        }
        export const delete_project_script=(
            prj_disc:ProjectDisc,
            prj_data:ProjectData,
            i:number
        )=>{
            pautil.remove_i_of_array(i,prj_data.script_list);
            save_project_data(prj_disc,prj_data);
        }

        export const change_project_script=(
            prj_disc:ProjectDisc,
            prj_data:ProjectData,
            i:number,
            script_data:ScriptData,
        )=>{
            prj_data.script_list[i]=script_data;
            save_project_data(prj_disc,prj_data);
        }
        const save_project_data=(prj_disc:ProjectDisc,data:ProjectData)=>{
            console.log("save_project_data",prj_disc,data)
            const wf=()=>{
                writeFile({
                    /** Path to the file to write. */
                    path: prj_disc.project_path+sep+project_data_dir
                        +sep+project_data_file,
                    /** The UTF-8 string to write to the file. */
                    contents: JSON.stringify(data)
                }).catch((err)=>{
                    console.log(err)
                })
            }
            readDir(prj_disc.project_path+sep+project_data_dir).then(
                ()=>{
                    wf()
                }
            ).catch(
                ()=>{
                    createDir(
                        prj_disc.project_path+sep+project_data_dir,
                        {recursive:true}
                    ).then(
                        ()=>{
                            wf()
                        }
                    )
                }
            )

        }
    }
    // const load_config=async (tar:ConfigStruct)=>{
    //     const dir=configDir()
    //     console.log("config dir:",dir)
    //     readTextFile(dir+sep+"config.json").then()
    // }
}
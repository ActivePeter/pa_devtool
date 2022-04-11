<template>
  <el-card shadow="hover">
    <div class="card">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="cmd_name" v-if="state===states.View">
            <div v-if="!editing">
              {{ cmd_name }}
              <div style="width: 10px; display: inline-block;"></div>
              <el-tag class="mx-1" size="small" type='info'
              >{{ cmd }}
              </el-tag>
            </div>
          </div>
          <div v-if="state===states.New||state===states.Edit||editing">
            <el-input v-model="add_mode_data.name" placeholder="名称"/>
            <div style="height: 10px"></div>
            <el-input v-model="add_mode_data.cmd" placeholder="命令"/>
          </div>
        </el-col>
        <el-col :span="8">

          <div v-if="state===states.View" class="btns">
            <div v-if="editing" style="padding-top: 20px">
              <el-button class="btn" type="text" @click="cancel_edit">取消</el-button>
              <div style="width: 10px; display: inline-block;"></div>
              <el-button class="btn" type="success" round
                         @click="apply_edit"
              >完成
              </el-button>
            </div>
            <div v-if="!editing">
              <el-popconfirm
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="red"
                  title="确认删除?"
              @confirm="delete_one"
              >
                <template #reference>
                  <el-button class="btn" type="text" >删除</el-button>
                </template>
              </el-popconfirm>
              <div style="width: 10px; display: inline-block;"></div>
              <el-button class="btn" type="text" @click="start_edit">修改</el-button>
              <div style="width: 10px; display: inline-block;"></div>
              <el-button class="btn" type="success" round
                         @click="run_cmd"
              >执行
              </el-button>
            </div>
          </div>
          <div v-if="state===states.New" class="btns" style="padding-top: 20px">
            <el-button class="btn" type="success" round
                       @click="add_new_cmd"
                       :disabled="add_mode_data.name===''||add_mode_data.cmd===''"
            >添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {CmdBarTs} from "@/components/CmdBarTs";
import bus from "@/Bus";
import {bus_event_names} from "@/Bus";
import {Storage} from "@/components/Storage";
import {fs, invoke, path, shell, window} from "@tauri-apps/api";
import {appWindow} from "@tauri-apps/api/window";


@Options({
  props: {
    app_data: Storage.DataStruct,
    state: CmdBarTs.CmdBarState,
    cmd_name: String,
    cmd: String,
    index: Number,
    selected_prj:String
  }
})
export default class CmdBar extends Vue {
  $props!: {
    index: number,
    cmd: string,
    cmd_name:string,
    app_data: Storage.DataStruct,
    selected_prj:string
  }
  states = CmdBarTs.CmdBarState
  add_mode_data = new Storage.ScriptData("","")
  editing=false
  start_edit(){
    this.editing=true;
    this.add_mode_data.cmd=this.$props.cmd;
    this.add_mode_data.name=this.$props.cmd_name;
    // this.$emit("update:state",this.states.Edit)
  }
  cancel_edit(){
    this.editing=false;
  }
  apply_edit(){
    this.editing=false;
    bus.emit(bus_event_names.change_one_cmd_in_cur_prj,{
      i:this.$props.index,
      script_data:this.add_mode_data
    })
  }
  delete_one() {

    bus.emit(bus_event_names.delete_one_cmd_in_cur_prj, this.$props.index)
  }

  add_new_cmd() {
    bus.emit(bus_event_names.add_new_cmd_2_cur_prj, this.add_mode_data)
    this.add_mode_data = new Storage.ScriptData("","")
  }

  run_cmd() {
    const space_i = this.$props.cmd.indexOf(" ");
    let cmd;
    let args = "";
    if (space_i == -1) {
      cmd = this.$props.cmd;
    } else {
      cmd = this.$props.cmd.substr(0, space_i);
      args = this.$props.cmd.substr(space_i + 1)
    }
    const cmd_id = this.$props.app_data.get_next_cmd_id()

    invoke("init_process", {
      window: appWindow,
      cmdId: cmd_id,
      cmdStr: cmd,
      cmd: "init_process",
      cmdArgs: args,
    })
    path.appDir().then((path1) => {
      // path.executableDir().then(exepath=>{
      //   console.log(exepath);
        const wf = () => {
          fs.writeFile({//cmd文件
            path: path1 + "run.cmd",
            contents: "start powershell -file "+path1+"run.ps1"
          }).then(
              () => {
                fs.writeFile(//ps文件
                    {
                      path: path1 + "run.ps1",
                      contents: "cd "+this.$props.selected_prj+"\r\n"+
                          this.$props.cmd+"\r\nPAUSE",
                    }
                ).then(
                    ()=>{
                      // console.log(path1 + "run.cmd")
                      shell.open(
                          path1 + "run.cmd",
                          // "start"
                      )
                    }
                )
              }
          )
        }
        fs.readDir(path1).then(
            () => {
              wf()
            }
        ).catch(()=>{
          fs.createDir(path1,{recursive:true}).then(
              ()=>{
                wf()
              }
          )
        })
      // })

      // console.log(path1 + "/run.cmd")
      // shell.open(path1 + "/run.cmd")

    });

  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cmd_name {
  display: inline-block;
  /*height: 32px;*/
  /*vertical-align: middle;*/
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.card {
  /*position: relative;*/
  vertical-align: middle;
}

.btns {
  float: right;
}
</style>

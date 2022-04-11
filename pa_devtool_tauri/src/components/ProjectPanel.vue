<template>
  <div class="hello">
    <el-row>
      <el-col :span="14">
        <el-card class="box-card" shadow="hover">
          选择项目


          <div style="width: 10px; display: inline-block;"></div>
          <el-select v-model="selected_prj" class="m-2" placeholder="Select">
            <el-option
                v-for="(item,i) in app_data.project_dirs"
                :key="i"
                :label="i"
                :value="item.project_path"
            />
          </el-select>
          <!--          <div style="width: 10px; display: inline-block;"></div>-->
          <div class="right_btns">
            <el-button type="text"
                       v-if="selected_prj!==''"
                       @click="open_prj_dir"
            >打开项目文件夹
            </el-button>
            <el-button type="text"
                       @click="show_man_prj_dialog=true"
            >添加/删除项目
            </el-button>
          </div>
        </el-card>
        <div style="width: 1px; height: 10px;"></div>
        <v-for
            v-for="(item, i) in project_data.script_list"
            :key="i"
        >
          <!--          {{item}}-->
          <CmdBar :state="cmd_bar_state.View"
                  :cmd="item.cmd"
                  :cmd_name="item.name"
                  :index="i"
                  :app_data="app_data"
                  :selected_prj="selected_prj"
          ></CmdBar>
          <div style="height: 10px"></div>
        </v-for>
        <CmdBar :state="cmd_bar_state.New"
                v-if="selected_prj!==''"
        ></CmdBar>

      </el-col>
      <el-col :span="10">

      </el-col>
    </el-row>
  </div>
  <ManPrjPathDialog v-model:dialog-form-visible="show_man_prj_dialog"
                    :app_data="app_data"
  ></ManPrjPathDialog>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import CmdBar from "@/components/CmdBar.vue";
import {CmdBarTs} from "@/components/CmdBarTs";
import CmdBarState = CmdBarTs.CmdBarState;
import ManPrjPathDialog from "@/components/ManPrjPathDialog.vue";
import {Storage} from "@/components/Storage";
import ProjectData = Storage.ProjectData;
import bus from "@/Bus";
import {bus_event_names} from "@/Bus";
import {appWindow} from "@tauri-apps/api/window";
import {FileHelper} from "@/pa/FileHelper";

@Options({
  components: {
    CmdBar,
    ManPrjPathDialog,
  },
  props: {
    msg: String,
    app_data: Storage.DataStruct
  },
  watch: {
    selected_prj(v) {
      console.log("selected_prj change", v)
      Storage.ope_project.read_project_data(
          new Storage.ProjectDisc(v),
          this.project_data
      )
    }
  }
})
export default class HelloWorld extends Vue {
  msg!: string
  cmd_bar_state = CmdBarState
  selected_prj = ""
  project_data = new ProjectData()
  cmd_bars = [
    {
      cmdname: 'hh',
      cmd: 'hhhhh',
    },
    {
      cmdname: 'll',
      cmd: 'hhhll',
    },
  ]
  show_man_prj_dialog = false
  options = [
    {
      value: 'Option1',
      label: 'Option1',
    },
    {
      value: 'Option2',
      label: 'Option2',
    },
    {
      value: 'Option3',
      label: 'Option3',
    },
    {
      value: 'Option4',
      label: 'Option4',
    },
    {
      value: 'Option5',
      label: 'Option5',
    },
  ]

  mounted() {
    bus.on(bus_event_names.add_new_cmd_2_cur_prj, (res) => {
      // console.log("add_new_cmd_2_cur_prj",res);
      Storage.ope_project.add_project_script(
          new Storage.ProjectDisc(this.selected_prj)
          , this.project_data, res as Storage.ScriptData)
    })
    bus.on(bus_event_names.delete_one_cmd_in_cur_prj, (i) => {
      // console.log("delete_one_cmd_in_cur_prj",res)
      Storage.ope_project.delete_project_script(
          new Storage.ProjectDisc(this.selected_prj)
          , this.project_data, i as number
      )
    })
    bus.on(bus_event_names.change_one_cmd_in_cur_prj, (res: any) => {
      Storage.ope_project.change_project_script(
          new Storage.ProjectDisc(this.selected_prj), this.project_data, res.i as number,
          res.script_data as Storage.ScriptData
      )
    })
    appWindow.listen("init_process", (res) => {
      console.log("process", res);
    })
  }

  open_prj_dir() {
    FileHelper.open_dir(this.selected_prj);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right_btns {
  display: inline-block;
  float: right;
}
</style>

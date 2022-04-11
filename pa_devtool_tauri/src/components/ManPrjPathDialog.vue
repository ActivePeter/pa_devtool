<template>
  <el-dialog

      v-model="show" title="添加或删除项目">
    <el-card shadow="hover"
             v-for="(item,i) in app_data.project_dirs"
             :key="i"

             style="margin-bottom: 10px"
    >
      <el-row :gutter="0">
        <el-col :span="16">
          <div

              class="file_path"
              style="
              /*height: 32px;*/
      /*horiz-align: center;*/
"
          >
            {{ item.project_path }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="btns">
            <el-button class="btn" type="text"
              @click="delete_prj_i(i)"
            >删除</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div style="height: 10px"></div>
    <el-button type="text" @click="read_f">添加项目目录</el-button>
    <FileInputComp ref="file_ref"
      :file_type="FileInputCompTs.FileType.Directory"
    ></FileInputComp>

  </el-dialog>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
// import {CmdBarTs} from "@/components/CmdBarTs";
import {Storage} from "@/components/Storage";
import FileInputComp from "@/pa/FileInputComp.vue";
import {FileInputCompTs} from "@/pa/FileInputCompTs";
import {dialog} from "@tauri-apps/api";
import bus from "@/Bus"
  ;
@Options({
  watch: {
    dialogFormVisible(v) {
      // console.log(v);
      this.show = v;
    },
    show(v) {
      this.$emit("update:dialogFormVisible", v);
    },
  },
  props: {
    dialogFormVisible: Boolean,
    app_data:Storage.DataStruct
  },
  components:{
    FileInputComp
  }
})
export default class ManPrjPathDialog extends Vue {
  // states=CmdBarTs.CmdBarState
  FileInputCompTs=FileInputCompTs
  show = false
  $refs!: {
    file_ref:FileInputComp
  }
  read_f(){
    dialog.open({
      directory:true,
      title:"选择项目文件夹"
    }).then((res)=>{
      bus.emit("new_project_dir",res)
    })
      // this.$refs.file_ref.read_f_info((f:any)=>{
      // // this.file_ref.value?.read_f_info((f)=>{
      //   console.log(f)
      // })

  }
  delete_prj_i(i:number){
    bus.emit("delete_prj_i",i)
  }
  // handleClose(){
  //
  // }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btns {
  float: right;
}
.file_path{
  /*padding-top: 7px;*/
  /*margin-bottom: -7px;*/
}
</style>

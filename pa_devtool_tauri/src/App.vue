<template>
  <ProjectPanel msg="Welcome to Your Vue.js + TypeScript App"
    :app_data="app_data"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ProjectPanel from './components/ProjectPanel.vue';
import {Storage} from "@/components/Storage";
import bus from "@/Bus";
import ProjectDisc = Storage.ProjectDisc;
@Options({
  components: {
    ProjectPanel,
  },
})
export default class App extends Vue {
  app_data=new Storage.DataStruct();
  mounted(){
    bus.on("new_project_dir",(dir)=>{
        let pd=new ProjectDisc(dir as string);
        this.app_data.project_dirs.push(pd);

        //save
        Storage.save_data(this.app_data)

    })
    bus.on("delete_prj_i",(i)=>{
      Storage.ope_data.delete_prj_i(this.app_data,i as number)
    })
    // bus.on("new_project_dir",(dir:Storage.ProjectDisc)=>{
    //   let pd=new ProjectDisc();
    //   pd.project_path=dir;
    //   this.app_data.project_dirs.push(pd);
    // })
    Storage.load_data(this.app_data).then(()=>{
      console.log("load data then",this.app_data);
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>

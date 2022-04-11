<template>

  <input v-if="file_type===FileInputCompTs.FileType.File && show"
         type="file" ref="file_ref" style="display: none" @change="_read_f">
  <input v-if="file_type===FileInputCompTs.FileType.Directory && show"
         type="file" webkitdirectory directory ref="file_ref" style="display: none" @change="_read_f">
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {ref} from "vue";
import { FileInputCompTs} from "@/pa/FileInputCompTs";

enum TaskType {
  GetFileInfo,
  GetFileContent,
}

@Options({
  props: {
    file_type:FileInputCompTs.FileType
  },
})

export default class FileInputComp extends Vue  {
  show = true
  recent_callback: any
  recent_task_type: TaskType = TaskType.GetFileInfo
  $refs!: {
    file_ref: HTMLInputElement
  }
  FileInputCompTs=FileInputCompTs;
  _read_f() {
    const selectedFile = this.$refs.file_ref.files?.[0];

    if (!selectedFile) {
      return;
    }
    this.show = false;
    this.$nextTick(() => {
      this.show = true;
    })

    if (this.recent_task_type === TaskType.GetFileContent) {

      // console.log("文件名:" + name + "大小:" + size);
      const reader = new FileReader(); //这是核心,读取操作就是由它完成.
      reader.readAsText(selectedFile as Blob); //读取文件的内容,也可以读取文件的URL
      const cb = this.recent_callback;
      reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        // console.log(this.result);
        cb(this.result, selectedFile);
      }
    } else if (this.recent_task_type === TaskType.GetFileInfo) {

      // console.log("selectedFile GetFileInfo",selectedFile)
      this.recent_callback(selectedFile);
    }
  }

  read_f_info(data_loaded_cb: (file: any) => void) {
    this.recent_callback = data_loaded_cb
    this.recent_task_type = TaskType.GetFileInfo

    // console.log("read_f_info");
    this.$refs.file_ref.click();
  }

  read_f_data(data_loaded_cb: (content: any, file: any) => void) {
    this.recent_callback = data_loaded_cb;
    this.recent_task_type = TaskType.GetFileContent;

    this.$refs.file_ref.click();

  }
}
</script>

t<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

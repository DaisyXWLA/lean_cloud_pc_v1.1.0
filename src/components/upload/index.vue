<template>
  <div>
    <el-upload
      ref="upload"
      action="#"
      name="image"
      :auto-upload="false"
      :on-change="handleChange"
      list-type="picture"
      :on-exceed="handleExceed"
      :file-list="fileArr"
      accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx"
    >
    <el-button type="primary" size="mini">上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {
        fileArr:[]
      }
    };
  },
  methods: {
    handleExceed(files, fileList) {
    //   this.$Message.success('超出附件最大上传量！');
    },
    handleChange(file,fileList){
      this.fileArr=[]
      this.fileArr.push(file)
      this.$emit("getImgUrl",this.fileArr)
    }
  }
};
</script>
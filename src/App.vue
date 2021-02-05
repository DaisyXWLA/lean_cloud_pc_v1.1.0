<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="scss">
//对话框标题
.el-dialog__header {
  background: #1890ff;
  padding: 10px 20px;
}
.el-dialog__title {
  color: #fff;
}
.el-dialog__headerbtn:focus .el-dialog__close,
.el-dialog__headerbtn:hover .el-dialog__close {
  color: #fff;
}
.el-dialog__headerbtn {
  top: 12px;
}
//文本框
.el-input__inner {
  height: 32px;
}
//table
.el-table td {
  padding: 8px;
}
//对话框按钮
.el-button {
  padding: 8px 20px;
}
//form表单
.el-form-item {
  margin-bottom: 14px;
}
.el-form-item__error {
  padding-top: 2px;
}

// 附件
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 88px;
}
.el-upload--picture-card i {
  font-size: 24px;
}
//对话框垂直居中
.el-dialog:not(.is-fullscreen) {
  margin-top: 0 !important;
}
.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 200px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
.el-dialog__body {
  padding: 30px 20px 10px;
}
.el-dialog__title {
  font-size: 16px;
}
//messageBox弹框
.el-message-box {
  border: none;
}
.el-message-box__header {
  background: #3c5dbd;
}
.el-message-box__title {
  color: #fff;
  font-size: 16px;
}
.el-message-box__headerbtn .el-message-box__close {
  color: #fff;
}
.el-message-box__headerbtn:focus .el-message-box__close,
.el-message-box__headerbtn:hover .el-message-box__close {
  color: #fff;
}
.el-message-box__content {
  padding: 20px 15px 5px;
}
</style>

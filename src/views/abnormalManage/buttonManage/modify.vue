<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <div class="title">基本信息</div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入按键名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键简称" prop="shortName">
            <el-input v-model="form.shortName" placeholder="请输入按键简称" />
          </el-form-item> </el-col
      ></el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键类别" prop="buttonType">
            <el-select
              v-model="form.buttonType"
              placeholder="请选择按键类别"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="type in typeOptions"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="重要程度" prop="importantLevel">
            <el-select
              v-model="importantLevel"
              placeholder="请选择按键类别"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="type in levelOptions"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属区域" prop="areaId">
            <treeselect
              v-model="form.areaId"
              :options="areaOptions"
              :show-count="true"
              placeholder="请选择所在区域"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键负责人">
            <el-select
              v-model="buttonChargeUsers"
              multiple
              placeholder="请选择按键负责人"
              style="width: 100%"
              @change="selectPrincipal"
            >
              <el-option
                v-for="item in principalOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="buttonDesc">
            <el-input
              type="textarea"
              v-model="form.buttonDesc"
              placeholder="请输入描述内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">事务流定义</div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事件附加信息">
            <el-checkbox
              :label="true"
              v-model="form.isDesc"
              @change="selectDesc"
              >文字描述</el-checkbox
            >
            <el-checkbox
              :label="true"
              v-model="form.isImages"
              @change="selectImages"
              >上传图片</el-checkbox
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="响应人">
            <el-select
              v-model="buttonResponseUsers"
              multiple
              placeholder="请选择按键响应人"
              style="width: 100%"
              @change="selectResponse"
            >
              <el-option
                v-for="item in principalOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="抄送人">
            <el-select
              v-model="userCcUsers"
              multiple
              placeholder="请选择按键抄送人"
              style="width: 100%"
              @change="selectCC"
            >
              <el-option
                v-for="item in principalOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="响应人是否到场">
            <el-radio-group v-model="form.showUp" @change="changeResponse">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px">
        <el-col :span="3">
          <span style="font-size: 14px; font-weight: 700; color: #606266"
            >通知上级与时间设定</span
          >
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="mini"
            @click="addItem"
            style="padding: 6px 10px"
            >添加行</el-button
          >
        </el-col>
      </el-row>
      <el-table>
        <el-table-column
          label="通知人"
          align="center"
          width="387"
        ></el-table-column>
        <el-table-column
          label="通知类型"
          align="center"
          width="387"
        ></el-table-column>
        <el-table-column
          label="等待时间"
          align="center"
          width="242"
        ></el-table-column>
        <el-table-column label="操作" align="center"></el-table-column>
      </el-table>
      <el-row
        v-for="(item, index) in form.buttonNoticeUsers"
        :key="index"
        class="form"
      >
        <el-col :span="8"
          ><el-form-item prop="noticeUserId">
            <el-select
              v-model="item.noticeUserId"
              placeholder="请选择通知人"
              style="width: 100%"
            >
              <el-option
                v-for="option in principalOptions"
                :key="option.userId"
                :label="option.nickName"
                :value="option.userId"
                :disabled="option.status == 1"
              ></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="8">
          <el-form-item prop="noticeType">
            <el-select
              v-model="item.noticeType"
              placeholder="请选择类型"
              style="width: 100%"
            >
              <el-option
                v-for="option in noticeTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5"
          ><el-form-item prop="noticeWaitTime">
            <el-input
              v-model="item.noticeWaitTime"
              placeholder="请输入等待时间"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item></el-col
        >
        <el-col :span="3"
          ><i
            style="line-height: 36px; color: #999"
            class="el-icon-delete"
            @click="removeItem(item)"
          ></i
        ></el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button type="warning" @click="back">返回</el-button>
      <!-- <el-button @click="cancel">取 消</el-button> -->
    </div>
  </div>
</template>

<script>
import {
  addButton,
  getButtonType,
  getButton,
} from "@/api/abnormal/buttonManage";

import { getTreeList } from "@/api/system/area";
import { getPrincipal } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: false,
      //类别下拉选项
      typeOptions: [],
      //负责人下拉选项
      principalOptions: [],
      //区域下拉选项
      areaOptions: [],
      //通知类型下拉选项
      noticeTypeOptions: [
        { value: "0", label: "未响应" },
        { value: "1", label: "未完成" },
      ],
      //重要程度分级
      levelOptions: [
        {
          value: "1",
          label: "一般",
        },
        {
          value: "2",
          label: "次要",
        },
        {
          value: "3",
          label: "重要",
        },
        {
          value: "4",
          label: "紧急",
        },
        {
          value: "5",
          label: "加急",
        },
      ],
      // 表单参数
      form: {
        buttonNoticeUsers: [],
      },
      userCcUsers: [],
      buttonChargeUsers: [],
      buttonResponseUsers: [],
      importantLevel: "",
      // 表单校验
      rules: {
        name: [
          { required: true, message: "按键名称不能为空", trigger: "blur" },
        ],
        buttonType: [
          { required: true, message: "请选择按键类别", trigger: "change" },
        ],
        importantLevel: [
          { required: true, message: "请选择重要程度", trigger: "chenge" },
        ],
        areaId: [{ required: true, message: "请选择区域", trigger: "chenge" }],
        // noticeUserId: [
        //   { required: true, message: "请选择通知人", trigger: "chenge" },
        // ],
        // noticeType: [
        //   { required: true, message: "请选择通知类型", trigger: "chenge" },
        // ],
        // noticeWaitTime: [
        //   { required: true, message: "等待时间不能为空", trigger: "blur" },
        // ],
      },
      //按键数据
      data: {},
      verifyFlag: false,
    };
  },
  created() {
    // this.form.showUp = false;
    this.getData();
  },
  methods: {
    getData() {
      //获取按键信息
      this.loading = true;
      getButton(this.$route.params.id).then((res) => {
        if (res.status == "SUCCESS") {
          this.loading = false;
          this.form = res.obj;
          this.userCcUsers = res.obj.userCcUsers.map((item) => {
            return item.ccUserId;
          });
          this.buttonChargeUsers = res.obj.buttonChargeUsers.map((item) => {
            return item.chargeUserId;
          });
          this.buttonResponseUsers = res.obj.buttonResponseUsers.map((item) => {
            return item.responseUserId;
          });
          if (res.obj.buttonNoticeUsers.length == 0) {
            this.form.buttonNoticeUsers = [];
          } else {
            for (let i = 0; i < res.obj.buttonNoticeUsers.length; i++) {
              if (res.obj.buttonNoticeUsers[i].noticeType == 0) {
                res.obj.buttonNoticeUsers[i].noticeType = "未响应";
              } else {
                res.obj.buttonNoticeUsers[i].noticeType = "未完成";
              }
            }
          }
          if (res.obj.importantLevel == 1) {
            this.importantLevel = "一般";
          } else if (res.obj.importantLevel == 2) {
            this.importantLevel = "次要";
          } else if (res.obj.importantLevel == 3) {
            this.importantLevel = "重要";
          } else if (res.obj.importantLevel == 4) {
            this.importantLevel = "紧急";
          } else if (res.obj.importantLevel == 5) {
            this.importantLevel = "加急";
          }
        } else {
          this.loading = false;
          this.msgError("获取按键信息失败，请重试！");
        }
      });
      //获取按键类别
      getButtonType().then((res) => {
        if (res.status == "SUCCESS") {
          this.typeOptions = res.obj.map((item) => {
            return { value: item.id, label: item.name };
          });
        }
      });
      //获取区域
      getTreeList().then((res) => {
        if (res.status == "SUCCESS") {
          this.areaOptions = res.obj;
        }
      });
      //获取人员列表
      getPrincipal().then((res) => {
        this.principalOptions = res.obj;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //返回异常按键列表页
    back() {
      this.$router.push({ path: "/abnormalManage/abnormalButton" });
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
      };
      this.resetForm("form");
      this.userCcUsers = undefined;
      this.buttonChargeUsers = undefined;
      this.buttonResponseUsers = undefined;
      this.form.showUp = false;
      this.form.buttonNoticeUsers = [
        {
          noticeUserId: "",
          noticeWaitTime: "",
          noticeType: "",
        },
      ];
    },
    /** 提交按钮 */
    submitForm() {
      // this.loading = true;
      if (!this.form.isDesc) {
        this.form.isDesc = false;
      }
      if (!this.form.isImages) {
        this.form.isImages = false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.buttonNoticeUsers.length == 0) {
            if (!isNaN(this.importantLevel)) {
              this.form.importantLevel = this.importantLevel;
            } else {
              if (this.importantLevel == "一班") {
                this.form.importantLevel = 1;
              } else if (this.importantLevel == "次要") {
                this.form.importantLevel = 2;
              } else if (this.importantLevel == "重要") {
                this.form.importantLevel = 3;
              } else if (this.importantLevel == "紧急") {
                this.form.importantLevel = 4;
              } else if (this.importantLevel == "加急") {
                this.form.importantLevel = 5;
              }
            }
            addButton(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("修改按键信息成功");
                this.loading = false;
                this.$router.push({ path: "/abnormalManage/abnormalButton" });
              } else {
                this.loading = false;
                this.msgError("修改按键信息失败，请重试！");
              }
            });
          } else {
            if (
              this.form.buttonNoticeUsers.some(
                (item) =>
                  item.noticeUserId == "" ||
                  item.noticeWaitTime == "" ||
                  item.noticeType == ""
              )
            ) {
              this.msgError("通知上级与时间设定信息不完善，请填写完整后提交！");
              this.loading = false;
              return;
            } else {
              for (let i = 0; i < this.form.buttonNoticeUsers.length; i++) {
                if (this.form.buttonNoticeUsers[i].noticeType == "未响应") {
                  this.form.buttonNoticeUsers[i].noticeType = 0;
                } else if (
                  this.form.buttonNoticeUsers[i].noticeType == "未完成"
                ) {
                  this.form.buttonNoticeUsers[i].noticeType = 1;
                }
              }
              if (!isNaN(this.importantLevel)) {
                this.form.importantLevel = this.importantLevel;
              } else {
                if (this.importantLevel == "一班") {
                  this.form.importantLevel = 1;
                } else if (this.importantLevel == "次要") {
                  this.form.importantLevel = 2;
                } else if (this.importantLevel == "重要") {
                  this.form.importantLevel = 3;
                } else if (this.importantLevel == "紧急") {
                  this.form.importantLevel = 4;
                } else if (this.importantLevel == "加急") {
                  this.form.importantLevel = 5;
                }
              }
              addButton(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("修改按键信息成功");
                  this.loading = false;
                  this.$router.push({
                    path: "/abnormalManage/abnormalButton",
                  });
                } else {
                  this.loading = false;
                  this.msgError("修改按键信息失败，请重试！");
                }
              });
            }
          }
        }
      });
    },
    selectDesc(desc) {
      this.form.isDesc = desc;
    },
    selectImages(img) {
      this.form.isImages = img;
    },
    changeResponse(showUp) {
      this.form.showUp = showUp;
    },
    //添加行
    addItem() {
      this.form.buttonNoticeUsers.push({
        noticeUserId: "",
        noticeWaitTime: "",
        noticeType: "",
      });
    },
    //删除行
    removeItem(item) {
      let index = this.form.buttonNoticeUsers.indexOf(item);
      if (index !== -1) {
        this.form.buttonNoticeUsers.splice(index, 1);
      }
    },
    //选择负责人
    selectPrincipal(principal) {
      this.buttonChargeUsers = principal;
      this.form.buttonChargeUsers = principal.map((item) => {
        return { chargeUserId: item };
      });
    },
    //选择响应人
    selectResponse(response) {
      this.buttonResponseUsers = response;
      this.form.buttonResponseUsers = response.map((item) => {
        return { responseUserId: item };
      });
    },
    //选择抄送人
    selectCC(cc) {
      this.userCcUsers = cc;
      this.form.userCcUsers = cc.map((item) => {
        return { ccUserId: item };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions span + span {
  margin-left: 5px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions {
  font-size: 16px;
}
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-form-item__error {
  // top: 10px;
  // left: inherit;
  // right: -100px !important;
  // text-align: left;
}
/deep/ .el-form {
  width: 70%;
  // margin: auto;
}
.title {
  font-size: 16px;
  margin: 10px 0;
  color: #409eff;
  padding-left: 5px;
  font-weight: bolder;
  border-left: 3px solid #409eff;
}
.footer {
  width: 70%;
  text-align: center;
  margin-top: 10px;
}
/deep/ .el-table__empty-block {
  display: none;
}
.form {
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  text-align: center;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  /deep/ .el-input--medium .el-input__inner {
    border: none;
    text-align: center;
  }
  /deep/ .el-input-group__append {
    border: none;
    background: none;
  }
  /deep/ .el-input__suffix {
    // background: #eee;
  }
}
/deep/ .el-table__header {
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
}
</style>

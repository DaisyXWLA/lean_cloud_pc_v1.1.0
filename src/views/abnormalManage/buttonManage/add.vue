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
              v-model="form.importantLevel"
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
          <el-form-item label="响应人" prop="buttonResponseUsers">
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
      <el-row class="empty-box" v-if="form.buttonNoticeUsers.length == 0">
        <el-col :span="24">
          <div class="empty">暂无数据</div>
        </el-col>
      </el-row>
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
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { addButton, getButtonType } from "@/api/abnormal/buttonManage";

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
      //表格表头
      header: [
        { label: "通知人", key: "noticeUserId" },
        { label: "通知类型", key: "noticeType" },
        { label: "等待时间", key: "noticeWaitTime" },
        { label: "操作", key: "" },
      ],
      // 表单参数
      form: {
        buttonNoticeUsers: [],
        showUp: false,
      },
      userCcUsers: [],
      buttonChargeUsers: [],
      buttonResponseUsers: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "按键名称不能为空", trigger: "blur" },
        ],
        buttonType: [
          { required: true, message: "请选择按键类别", trigger: "change" },
        ],
        importantLevel: [
          { required: true, message: "请选择重要程度", trigger: "change" },
        ],
        areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
        buttonResponseUsers: [
          {
            required: true,
            message: "请选择响应人",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    /** 查询商品列表 */
    getData() {
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
      this.resetForm("form");
      this.userCcUsers = undefined;
      this.buttonChargeUsers = undefined;
      this.buttonResponseUsers = undefined;
      this.form.showUp = false;
      // this.form.buttonNoticeUsers = [
      //   {
      //     noticeUserId: "",
      //     noticeWaitTime: "",
      //     noticeType: "",
      //   },
      // ];
    },
    /** 提交按钮 */
    submitForm() {
      // console.log(this.form.buttonNoticeUsers);
      this.loading = true;
      if (!this.form.isDesc) {
        this.form.isDesc = false;
      }
      if (!this.form.isImages) {
        this.form.isImages = false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.buttonNoticeUsers.length == 0) {
            addButton(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增按键成功！");
                this.loading = false;
                this.$router.push({ path: "/abnormalManage/abnormalButton" });
              } else {
                this.loading = false;
                this.msgError("新增按键失败，请重试！");
              }
            });
          } else {
            if (
              this.form.buttonNoticeUsers.some(
                (item) => item.noticeUserId == ""||item.noticeWaitTime==""||item.noticeType==""
              )
            ) {
              this.msgError("通知上级与时间设定信息不完善，请填写完整后提交！");
              this.loading = false;
              return;
            } else {
              addButton(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("新增按键成功！");
                  this.loading = false;
                  this.$router.push({
                    path: "/abnormalManage/abnormalButton",
                  });
                } else {
                  this.loading = false;
                  this.msgError("新增按键失败，请重试！");
                }
              });
            }
          }
        } else {
          this.loading = false;
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
      console.log(this.form.buttonNoticeUsers);
      this.form.buttonNoticeUsers.push({
        noticeUserId: "",
        noticeWaitTime: "",
        noticeType: "",
      });
    },
    //删除行
    removeItem(item) {
      // console.log(item);
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
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-form {
  width: 70%;
}
.app-container {
  padding-top: 5px;
}
.empty-box {
  border: 1px solid #f2f2f2;
  border-top: none;
  .empty {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 10px;
  }
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
  margin-top: 20px;
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
}
/deep/ .el-table__header {
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
}
</style>

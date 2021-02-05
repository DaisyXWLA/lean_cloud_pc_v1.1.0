<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <div class="title">基本信息</div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键组名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入按键组名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键组简称" prop="shortName">
            <el-input v-model="form.shortName" placeholder="请输入按键组简称" />
          </el-form-item> </el-col
      ></el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="按键组类别" prop="btType">
            <el-select
              v-model="form.btType"
              placeholder="请选择按键组类别"
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
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="form.description"
              placeholder="请输入描述内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">事务流定义</div>

      <el-row v-for="(item, index) in form.buttonBts" :key="index">
        <el-col :span="18">
          <el-form-item label="关联按键" prop="buttonId">
            <el-select
              v-model="item.buttonId"
              placeholder="请选择按键"
              style="width: 100%"
            >
              <el-option
                v-for="option in buttonOptions"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="按键背景色" prop="color">
            <el-color-picker v-model="item.color"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="1.5" v-if="form.buttonBts.length !== 1">
          <i
            style="padding-left: 30px; line-height: 40px"
            class="el-icon-delete"
            @click="removeItem(item)"
          ></i>
        </el-col>
        <el-col :span="1.5">
          <i
            style="padding-left: 10px; line-height: 40px"
            class="el-icon-plus"
            @click="addItem"
          ></i>
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
          <el-form-item label="触发对象">
            <el-select
              v-model="userBts"
              multiple
              placeholder="请选择触发人"
              style="width: 100%"
              @change="selectUser"
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
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button type="warning" @click="back">返回</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  addButtonGroup,
  getButtonGroupType,
  getAllButton,
} from "@/api/abnormal/buttonGroupManage";

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
      //按键下拉选项
      buttonOptions: [],
      //负责人下拉选项
      principalOptions: [],
      //区域下拉选项
      areaOptions: [],
      // 表单参数
      form: {
        buttonBts: [
          {
            buttonId: "",
            color: "#409EFF",
          },
        ],
      },
      userBts: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "按键名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      //获取按键类别
      getButtonGroupType().then((res) => {
        if (res.status == "SUCCESS") {
          this.typeOptions = res.obj.map((item) => {
            return { value: item.id, label: item.name };
          });
        }
      });
      //获取按键
      getAllButton().then((res) => {
        if (res.status == "SUCCESS") {
          this.buttonOptions = res.obj;
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
      this.$router.push({ path: "/abnormalManage/abnormalButtonGroup" });
    },
    // 表单重置
    reset() {
      this.resetForm("form");
      this.form.buttonBts = [
        {
          buttonId: "",
          color: "#409EFF",
        },
      ];
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.buttonBts.length == 0) {
            addButtonGroup(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增按键成功！");
                this.loading = false;
                this.$router.push({
                  path: "/abnormalManage/abnormalButtonGroup",
                });
              } else {
                this.loading = false;
                this.msgError("新增按键失败，请重试！");
              }
            });
          } else {
            if (
              this.form.buttonBts.some(
                (item) => item.buttonId == "" || item.color == ""
              )
            ) {
              this.msgError("请选择关联按键！");
              this.loading = false;
              return;
            } else {
              addButtonGroup(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("新增按键成功！");
                  this.loading = false;
                  this.$router.push({
                    path: "/abnormalManage/abnormalButtonGroup",
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
    //选择关联人
    selectUser(user) {
      this.userBts = user;
      this.form.userBts = user.map((item) => {
        return { userId: item };
      });
    },
    //添加行
    addItem() {
      this.form.buttonBts.push({
        buttonId: "",
        color: "#409EFF",
      });
    },
    //删除行
    removeItem(item) {
      let index = this.form.buttonBts.indexOf(item);
      if (index !== -1) {
        this.form.buttonBts.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-form-item__error {
  top: 10px;
  left: inherit;
  right: -100px !important;
  text-align: left;
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
</style>

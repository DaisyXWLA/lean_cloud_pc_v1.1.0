<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="按键名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入按键名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="按键类别" prop="buttonTypeName">
        <el-select
          v-model="queryParams.buttonType"
          :filterable="true"
          placeholder="请选择按键类别"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="所属区域" prop="areaId">
        <treeselect
          v-model="queryParams.areaId"
          :options="areaOptions"
          :show-count="true"
          placeholder="请选择所在区域"
          style="width: 200px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="buttonList"
      @row-click="handleUpdate"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="按键名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="按键简称" prop="shortName" align="center" />
      <el-table-column label="按键类别" prop="buttonTypeName" align="center" />
      <el-table-column label="重要程度" align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.importantLevel" disabled> </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" prop="areaName" align="center" />
      <!-- <el-table-column label="按键负责人" prop="price" align="center" /> -->
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.status != 2"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <el-drawer :title="title" :visible.sync="open" size="42%">
      <div class="drawer-container">
        <div class="content">
          <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <div class="title">基本信息</div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="按键名称" prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入按键名称"
                    @change="change($event)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="按键简称" prop="shortName">
                  <el-input
                    v-model="form.shortName"
                    placeholder="请输入按键简称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="重要程度" prop="importantLevel">
                  <el-select
                    v-model="form.importantLevel"
                    placeholder="请选择按键类别"
                    clearable
                    size="small"
                    style="width: 100%"
                    @change="selectLevel"
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
                <el-form-item label="按键描述" prop="buttonDesc">
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
                  <!-- <el-select
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
                  </el-select> -->
                  <treeselect
                    multiple
                    :disable-branch-nodes="true"
                    v-model="buttonResponseUsers"
                    :options="principalOptions"
                    placeholder="请选择区域负责人"
                    @select="selectResponse"
                    @deselect="deselectResponse"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="响应人是否到场">
                  <el-radio-group
                    v-model="form.showUp"
                    @change="changeResponse"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="抄送人">
                  <!-- <el-select
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
                  </el-select> -->
                  <treeselect
                    multiple
                    :disable-branch-nodes="true"
                    v-model="userCcUsers"
                    :options="principalOptions"
                    placeholder="请选择按键抄送人"
                    @select="selectCC"
                    @deselect="deselectCC"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row
              style="margin-bottom: 10px; line-height: 30px"
            >
              <el-col :span="5">
                <span style="font-size: 14px; font-weight: 700; color: #606266"
                  >通知上级与时间设定</span
                >
              </el-col>
              <el-col :span="2">
                <el-button
                  type="primary"
                  size="mini"
                  @click="addItem"
                  style="padding: 5px 10px"
                  >添加行</el-button
                >
              </el-col>
            </el-row>
            <el-table>
              <el-table-column
                label="通知人"
                align="center"
                width="246"
              ></el-table-column>
              <el-table-column
                label="通知类型"
                align="center"
                width="246"
              ></el-table-column>
              <el-table-column
                label="等待时间"
                align="center"
                width="154"
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
                  <!-- <el-select
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
                  </el-select>  -->
                  <treeselect
                    :disable-branch-nodes="true"
                    v-model="item.noticeUserId"
                    :options="principalOptions"
                    placeholder="请选择通知人"
                    :clearable="false"
                  />
                </el-form-item>
              </el-col>
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
        </div>

        <div class="footer">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm()"
            :loading="loading"
            >{{ loading ? "提交中 ..." : "确 定" }}</el-button
          >
          <el-button @click="cancel" size="medium">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  buttonList,
  getButton,
  addButton,
  deleteButton,
  getButtonType,
} from "@/api/abnormal/buttonManage";

import { getTreeList } from "@/api/system/area";
import { getUserTree } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 列表数据
      buttonList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //类别下拉选项
      typeOptions: [],
      //负责人下拉选项
      principalOptions: [],
      //区域下拉选项
      areaOptions: [],
      //复选框
      checkList: [],
      //通知类型下拉选项
      noticeTypeOptions: [
        { value: "0", label: "未响应" },
        { value: "1", label: "未完成" },
      ],
      //重要程度分级
      levelOptions: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "5",
          label: "5",
        },
      ],
      //表格表头
      header: [
        { label: "通知人", key: "noticeUserId" },
        { label: "通知类型", key: "noticeType" },
        { label: "等待时间", key: "noticeWaitTime" },
        { label: "操作", key: "" },
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        buttonType: undefined,
        // areaId: undefined,
      },
      // 表单参数
      form: { buttonNoticeUsers: [], showUp: false },
      userCcUsers: [],
      // buttonChargeUsers: [],
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
          { required: true, message: "请选择重要程度", trigger: "change" },
        ],
        // areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
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
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      buttonList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.buttonList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
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
      getUserTree().then((res) => {
        this.principalOptions = res.obj;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {};
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
      this.userCcUsers = [];
      // this.buttonChargeUsers = undefined;
      this.buttonResponseUsers = [];
      this.form.showUp = false;
      this.form.buttonNoticeUsers = [];
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增按键";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.open = true;
      this.title = "修改按键";
      getButton(id).then((res) => {
        if (res.status == "SUCCESS") {
          this.loading = false;
          this.form = res.obj;
          this.userCcUsers = res.obj.userCcUsers.map((item) => {
            return item.ccUserId;
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
        } else {
          this.loading = false;
          this.msgError("获取按键信息失败，请重试！");
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteButton(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      if (!this.form.isDesc) {
        this.form.isDesc = false;
      }
      if (!this.form.isImages) {
        this.form.isImages = false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.form.buttonNoticeUsers.length == 0) {
              addButton(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("修改按键信息成功");
                  this.open = false;
                  this.getList();
                } else {
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
                this.msgError(
                  "通知上级与时间设定信息不完善，请填写完整后提交！"
                );
                this.loading = false;
                // return;
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
                addButton(this.form).then((res) => {
                  if (res.status == "SUCCESS") {
                    this.msgSuccess("修改按键信息成功");
                    this.open = false;
                    this.getList();
                  } else {
                    this.msgError("修改按键信息失败，请重试！");
                  }
                });
              }
            }
          } else {
            if (this.form.buttonNoticeUsers.length == 0) {
              addButton(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("新增按键成功！");
                  this.open = false;
                  this.getList();
                } else {
                  this.loading = false;
                  this.msgError("新增按键失败，请重试！");
                }
              });
            } else {
              if (
                this.form.buttonNoticeUsers.some(
                  (item) =>
                    item.noticeUserId == null ||
                    item.noticeWaitTime == "" ||
                    item.noticeType == ""
                )
              ) {
                this.msgError(
                  "通知上级与时间设定信息不完善，请填写完整后提交！"
                );
                this.loading = false;
                // return;
              } else {
                addButton(this.form).then((res) => {
                  if (res.status == "SUCCESS") {
                    this.msgSuccess("新增按键成功！");
                    this.open = false;
                    this.getList();
                  } else {
                    this.loading = false;
                    this.msgError("新增按键失败，请重试！");
                  }
                });
              }
            }
          }
        } else {
          this.loading = false;
        }
      });
    },
    selectLevel(level) {
      this.form.importantLevel = level;
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
      // console.log(this.form.buttonNoticeUsers);
      this.form.buttonNoticeUsers.push({
        noticeUserId: null,
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
    // selectPrincipal(principal) {
    //   this.buttonChargeUsers = principal;
    //   this.form.buttonChargeUsers = principal.map((item) => {
    //     return { chargeUserId: item };
    //   });
    // },
    //选择响应人
    selectResponse(node) {
      console.log(node);
      this.buttonResponseUsers.push(node.id);
      this.form.buttonResponseUsers = this.buttonResponseUsers.map((item) => {
        return { responseUserId: item };
      });
    },
    deselectResponse(node) {
      for (let i = 0; i < this.buttonResponseUsers.length; i++) {
        if (node.id == this.buttonResponseUsers[i]) {
          this.buttonResponseUsers.splice(i, 1);
          this.form.buttonResponseUsers = this.buttonResponseUsers.map(
            (item) => {
              return { responseUserId: item };
            }
          );
        }
      }
    },

    //选择抄送人
    selectCC(node) {
      console.log(node);
      this.userCcUsers.push(node.id);
      this.form.userCcUsers = this.userCcUsers.map((item) => {
        return { ccUserId: item };
      });
    },
    deselectCC(node) {
      for (let i = 0; i < this.userCcUsers.length; i++) {
        if (node.id == this.userCcUsers[i]) {
          this.userCcUsers.splice(i, 1);
          this.form.userCcUsers = this.userCcUsers.map((item) => {
            return { ccUserId: item };
          });
        }
      }
    },

    //input强制渲染
    change(e) {
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-drawer__header {
  span {
    outline: none;
  }
}
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-checkbox-group {
  padding-left: 30px;
}
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-dialog__body {
  padding-top: 5px;
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
  margin: 5px 0;
  color: #409eff;
  padding-left: 5px;
  font-weight: bolder;
  border-left: 3px solid #409eff;
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
  /deep/ .vue-treeselect__control {
    border: none!important;
  }
}
/deep/ .el-table__header {
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
}
/deep/ .el-drawer__header {
  background: #f8f8f9;
  padding: 15px 20px;
  color: #666;
  font-size: 16px;
  margin-bottom: 0;
  border-bottom: 1px solid #f2f2f2;
}
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.drawer-container {
  .content {
    padding: 0 30px;
    box-sizing: border-box;
  }
  .footer {
    margin: 20px 0;
    text-align: center;
    background: #fff;
  }
}
/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 20px;
}
/deep/ .vue-treeselect__placeholder {
  padding-left: 0;
  color: #c0c4cc;
  font-size: 12px;
}
/deep/ .vue-treeselect__value-remove {
  border-left: none;
}
/deep/ .vue-treeselect__multi-value-item {
  padding: 0;
}
/deep/ .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0;
}
  
</style>

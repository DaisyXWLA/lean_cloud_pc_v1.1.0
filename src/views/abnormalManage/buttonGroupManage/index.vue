<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="按键组名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入按键组名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="按键组类别" prop="btType">
        <el-select
          v-model="queryParams.btType"
          :filterable="true"
          placeholder="请选择按键组类别"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="areaName">
        <treeselect
          v-model="queryParams.areaId"
          :options="areaOptions"
          :show-count="true"
          placeholder="请选择所在区域"
          style="width: 200px"
        />
      </el-form-item>
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
      :data="buttonGroupList"
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
        label="按键组名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="按键组简称" prop="shortName" align="center" />
      <el-table-column label="按键组类别" prop="btTypeName" align="center" />
      <el-table-column label="所属区域" prop="areaName" align="center" />
      <!-- <el-table-column label="按键" prop="price" align="center" /> -->
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
              <el-col :span="24">
                <el-form-item label="按键组名称" prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入按键组名称"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="按键组简称" prop="shortName">
                  <el-input
                    v-model="form.shortName"
                    placeholder="请输入按键组简称"
                  />
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
                <el-form-item label="按键组描述" prop="description">
                  <el-input
                    type="textarea"
                    v-model="form.description"
                    placeholder="请输入描述内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="title">事务流定义</div>
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
                  <!-- <el-select
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
                  </el-select> -->
                  <treeselect
                    multiple
                    :disable-branch-nodes="true"
                    v-model="userBts"
                    :options="principalOptions"
                    placeholder="请选择触发人"
                    @select="selectUser"
                    @deselect="deselectUser"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div style="padding-left: 40px">
              <el-row style="margin-bottom: 10px; line-height: 30px">
                <el-col :span="3.5">
                  <span
                    style="font-size: 14px; font-weight: 700; color: #606266"
                    >关联按键</span
                  >
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="addItem"
                    style="padding: 5px 10px; margin-left: 15px"
                    >添加行</el-button
                  >
                </el-col>
              </el-row>
              <el-table>
                <el-table-column
                  label="关联按键"
                  align="center"
                  width="410"
                ></el-table-column>
                <el-table-column
                  label="按键背景色"
                  align="center"
                  width="176"
                ></el-table-column>
                <el-table-column label="操作" align="center"></el-table-column>
              </el-table>
              <el-row class="empty-box" v-if="form.buttonBts.length == 0">
                <el-col :span="24">
                  <div class="empty">暂无数据</div>
                </el-col>
              </el-row>
              <el-row
                v-for="(item, index) in form.buttonBts"
                :key="index"
                class="form"
              >
                <el-col :span="14"
                  ><el-form-item prop="noticeUserId">
                    <el-select
                      v-model="item.buttonId"
                      placeholder="请选择关联按键"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in buttonOptions"
                        :key="option.userId"
                        :label="option.name"
                        :value="option.id"
                      ></el-option>
                    </el-select> </el-form-item
                ></el-col>
                <el-col :span="6">
                  <el-form-item prop="color">
                    <el-color-picker v-model="item.color"></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4"
                  ><i
                    style="line-height: 36px; color: #999"
                    class="el-icon-delete"
                    @click="removeItem(item)"
                  ></i
                ></el-col>
              </el-row>
            </div>
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
  buttonGroupList,
  getButtonGroup,
  deleteButtonGroup,
  getButtonGroupType,
  addButtonGroup,
  getAllButton,
} from "@/api/abnormal/buttonGroupManage";

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
      buttonGroupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //类别下拉选项
      typeOptions: [],
      //按键下拉选项
      buttonOptions: [],
      //负责人下拉选项
      principalOptions: [],
      //区域下拉选项
      areaOptions: [],
      //复选框
      checkList: [],
      userBts: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        btType: undefined,
        areaId: undefined,
      },
      // 表单参数
      form: {
        buttonBts: [],
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "按键名称不能为空", trigger: "blur" },
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
      buttonGroupList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          console.log(res.obj.records);
          this.buttonGroupList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
      //获取按键类别
      getButtonGroupType().then((res) => {
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
      this.form.buttonBts = [];
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增按键组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.open = true;
      this.title = "修改按键组";
      //获取按键详情
      getButtonGroup(id).then((res) => {
        this.form = res.obj;
        this.userBts = res.obj.userBts.map((item) => {
          return item.userId;
        });
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
          return deleteButtonGroup(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            console.log(this.form);
            if (this.form.buttonBts.length == 0) {
              addButtonGroup(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("修改按键组成功！");
                  this.loading = false;
                  this.open = false;
                  this.getList();
                } else {
                  this.loading = false;
                  this.msgError("修改按键组失败，请重试！");
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
                // return;
              } else {
                addButtonGroup(this.form).then((res) => {
                  if (res.status == "SUCCESS") {
                    this.msgSuccess("修改按键组成功！");
                    this.loading = false;
                    this.open = false;
                    this.getList();
                  } else {
                    this.loading = false;
                    this.msgError("修改按键组失败，请重试！");
                  }
                });
              }
            }
          } else {
            console.log(this.form);
            if (this.form.buttonBts.length == 0) {
              addButtonGroup(this.form).then((res) => {
                if (res.status == "SUCCESS") {
                  this.msgSuccess("新增按键组成功！");
                  this.open = false;
                  this.getList();
                } else {
                  this.loading = false;
                  this.msgError("新增按键组失败，请重试！");
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
                // return;
              } else {
                addButtonGroup(this.form).then((res) => {
                  if (res.status == "SUCCESS") {
                    this.msgSuccess("新增按键组成功！");
                    this.loading = false;
                    this.open = false;
                    this.getList();
                  } else {
                    this.loading = false;
                    this.msgError("新增按键组失败，请重试！");
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
    //选择触发对象
    selectUser(node) {
      this.userBts.push(node.id);
      this.form.userBts = this.userBts.map((item) => {
        return { userId: item };
      });
    },
    deselectUser(node) {
      for (let i = 0; i < this.userBts.length; i++) {
        if (node.id == this.userBts[i]) {
          this.userBts.splice(i, 1);
          this.form.userBts = this.userBts.map((item) => {
            return { userId: item };
          });
        }
      }
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
/deep/ .el-drawer__header {
  span {
    outline: none;
  }
}
/deep/ .el-dialog__body {
  padding-top: 5px;
}
.title {
  font-size: 16px;
  margin: 5px 0;
  color: #409eff;
  padding-left: 5px;
  font-weight: bolder;
  border-left: 3px solid #409eff;
}
/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 14px;
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

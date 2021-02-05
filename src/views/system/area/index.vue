<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="区域名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入区域名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="areaChargeUserNames">
        <el-input
          v-model="queryParams.areaChargeUserNames"
          placeholder="请输入负责人名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择区域状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="areaList"
      @row-click="handleUpdate"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column
        label="区域编号"
        prop="code"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="区域名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="区域简称"
        prop="shortName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="负责人"
        prop="areaChargeUserNames"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        :formatter="statusFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status != 2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status != 2"
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click.stop="handlePigeonhole(scope.row)"
            v-hasPermi="['system:role:edit']"
            >归档</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-folder-remove"
            @click.stop="handleForbidden(scope.row)"
            v-hasPermi="['system:role:edit']"
            >禁用</el-button
          >
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-folder-add"
            @click.stop="handleEnable(scope.row)"
            v-hasPermi="['system:role:remove']"
            >启用</el-button
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
    <!-- 添加或修改区域对话框 -->
    <el-drawer
      :title="title"
      :withHeader="false"
      :visible.sync="open"
      size="35%"
    >
      <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="21">
                <span>{{ title }}</span>
              </el-col>
              <el-col :span="3">
                <el-button icon="el-icon-receiving" @click="submitForm"
                  >保存</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" class="close"
            ><el-button icon="el-icon-close" @click="cancel"></el-button
          ></el-col>
        </el-row>
      </div>
      <div class="container">
        <div class="form">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="所属区域" prop="parentId">
                  <treeselect
                    :class="borderColor"
                    v-model="form.parentId"
                    :options="areaOptions"
                    :show-count="true"
                    placeholder="请选择所属区域"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="区域名称" prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入区域名称"
                    style="width: 100%"
                  /> </el-form-item
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="区域编号" prop="code">
                  <el-input
                    v-model="form.code"
                    placeholder="请输入区域编号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="区域简称" prop="shortName">
                  <el-input
                    v-model="form.shortName"
                    placeholder="请输入区域简称"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in radioStatusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      >{{ dict.dictLabel }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="负责人">
                  <!-- <el-select
                    v-model="areaUsers"
                    multiple
                    placeholder="请选择区域负责人"
                    style="width: 100%"
                    @change="selectPrincipal"
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
                    v-model="areaUsers"
                    :options="principalOptions"
                    placeholder="请选择区域负责人"
                    @select="selectPrincipal"
                    @deselect="deselectPrincipal"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="区域描述" prop="description">
                  <el-input
                    type="textarea"
                    v-model="form.description"
                    placeholder="请输入描述内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  areaList,
  addArea,
  getAreaAndPrincipal,
  deleteArea,
  getParentArea,
  getTreeAreaList,
  areaPigeonhole,
  areaForbidden,
  areaEnable,
} from "@/api/system/area";
import { getPrincipal, getUserTree } from "@/api/system/dept";
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
      // 类别表格数据
      areaList: [],
      //上级区域下拉选项
      areaOptions: [],
      //上级区域校验样式
      borderColor: "",
      //负责人下拉选项
      principalOptions: [],
      areaUsers: [],
      statusOptions: [
        {
          dictValue: "0",
          dictLabel: "禁用",
        },
        {
          dictValue: "1",
          dictLabel: "启用",
        },
        {
          dictValue: "2",
          dictLabel: "归档",
        },
      ],
      radioStatusOptions: [
        {
          dictValue: "1",
          dictLabel: "启用",
        },
        {
          dictValue: "0",
          dictLabel: "禁用",
        },
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        areaChargeUserNames: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "区域名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "请选择所属区域", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      areaList(this.queryParams).then((res) => {
        // console.log(res);
        if (res.status == "SUCCESS") {
          this.areaList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        } else {
          this.msgError("获取区域列表失败，请重试！");
        }
      });
      //获取人员列表
      getUserTree().then((res) => {
        this.principalOptions = res.obj;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        status: "1",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.borderColor = "";
      this.reset();
      this.open = true;
      this.title = "新增区域";
      //获取上级区域
      getTreeAreaList().then((res) => {
        this.areaOptions = res.obj;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      if (row.status != 2) {
        this.borderColor = "";
        this.reset();
        const id = row.id || this.ids;
        getAreaAndPrincipal(id).then((res) => {
          this.form = res.obj;
          this.form.status = res.obj.status.toString();
          this.areaUsers = res.obj.areaUsers.map((item) => {
            return item.userId;
          });
          this.open = true;
          this.title = "修改区域";
        });
        //获取上级区域
        getTreeAreaList(id).then((res) => {
          this.areaOptions = res.obj;
        });
      }
    },
    // 归档
    handlePigeonhole(row) {
      this.$confirm("归档后不可使用，是否确认归档?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return areaPigeonhole(row.id);
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            this.getList();
            this.msgSuccess("归档成功！");
          } else {
            this.msgError("归档失败，请重试！");
          }
        });
    },
    // 禁用
    handleForbidden(row) {
      this.$confirm("是否确认禁用?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return areaForbidden(row.id);
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            this.getList();
            this.msgSuccess("禁用成功！");
          } else {
            this.msgError("禁用失败，请重试！");
          }
        });
    },
    //启用
    handleEnable(row) {
      this.$confirm("是否确认启用?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return areaEnable(row.id);
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            this.getList();
            this.msgSuccess("启用成功！");
          } else {
            this.msgError("启用失败，请重试！");
          }
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            addArea(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("修改区域成功！");
                this.open = false;
                this.getList();
              } else {
                this.msgError("修改区域失败，请重试！");
              }
            });
          } else {
            console.log(this.form);
            addArea(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增区域成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError("新增区域失败，请重试！");
              }
            });
          }
        } else {
          this.borderColor = "border-color";
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
          return deleteArea(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //选择负责人
    selectPrincipal(node, instanceId) {
      this.areaUsers.push(node.id);
      this.form.areaUsers = this.areaUsers.map((item) => {
        return { userId: item };
      });
    },
    deselectPrincipal(node, instanceId) {
      for (let i = 0; i < this.areaUsers.length; i++) {
        if (node.id == this.areaUsers[i]) {
          this.areaUsers.splice(i, 1);
          this.form.areaUsers = this.areaUsers.map((item) => {
            return { userId: item };
          });
        }
      }
      console.log(this.areaUsers);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.border-color {
  /deep/ .vue-treeselect__control {
    border-color: #ff4949;
  }
}
/deep/ .el-drawer {
  background: #f9f9f9;
}
.header {
  background: #f5f5f5;
  //   padding: 15px 30px;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
  .close {
    text-align: right;
    border-left: 1px solid #ddd;
    padding: 15px 30px 15px 0;
  }
  /deep/ .el-button {
    background: none;
    border: none;
    padding: 0;
    outline: none;
    i {
      font-size: 18px;
      color: #999;
      font-weight: bold;
      vertical-align: middle;
    }
    span {
      color: #888;
      vertical-align: middle;
    }
  }
}
.container {
  padding: 20px;
  .form {
    border: 1px solid #ddd;
    // border-bottom: none;
    // border-right: none;
    padding: 20px 10px;
    background: #fff;
    /deep/ .el-input__inner {
      padding: 0 5px;
      // text-align: center;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      padding: 6px 10px;
      // border-bottom: 1px solid #ddd;

      // border-right: 1px solid #ddd;
    }
    /deep/ .el-form-item__label {
      color: #999;
      font-size: 12px;
    }
    /deep/ .el-form-item__error {
      padding-top: 0;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
      line-height: 20px;
    }
    // /deep/ .vue-treeselect__control{
    //   height: 28px!important;
    // }
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
  }
}
</style>
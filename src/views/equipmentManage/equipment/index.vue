<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaId">
        <treeselect
          v-model="queryParams.areaId"
          :options="areaOptions"
          :show-count="true"
          placeholder="请选择所在区域"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="设备负责人" prop="chargeUserName">
        <el-input
          v-model="queryParams.chargeUserName"
          placeholder="请输入负责人姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
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
      :data="equipmentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column
        label="设备名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备资产号"
        prop="code"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备简称"
        prop="shortName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属区域"
        prop="areaName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="负责人"
        prop="equipmentUserNames"
        align="center"
        :show-overflow-tooltip="true"
      />
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

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备资产号" prop="code">
              <el-input v-model="form.code" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备简称" prop="shortName">
              <el-input v-model="form.shortName" placeholder="请输入设备简称" />
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
            <el-form-item label="设备负责人">
              <el-select
                v-model="equipmentUsers"
                multiple
                placeholder="请选择设备负责人"
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
            <el-form-item label="设备描述" prop="description">
              <el-input
                type="textarea"
                v-model="form.description"
                placeholder="请输入描述内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  equipmentList,
  addEquipment,
  getEquipment,
  deleteEquipment,
} from "@/api/equipment/equipmentManage";
import { getTreeList } from "@/api/system/area";
import { getPrincipal } from "@/api/system/dept";
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
      // 设备表格数据
      equipmentList: [],
      //负责人下拉选项
      principalOptions: [],
      //区域下拉选项
      areaOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        areaId: undefined,
        chargeUserName: undefined,
      },
      // 表单参数
      form: {},
      equipmentUsers: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      equipmentList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.equipmentList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
      //获取区域
      getTreeList().then((res) => {
        this.areaOptions = res.obj;
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
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
      };
      this.equipmentUsers = undefined;
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getEquipment(id).then((res) => {
        this.form = res.obj;
        this.equipmentUsers = res.obj.equipmentUsers.map((item) => {
          return item.userId;
        });
        this.open = true;
        this.title = "修改设备";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            addEquipment(this.form).then((res) => {
              this.msgSuccess("修改设备成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquipment(this.form).then((res) => {
              this.msgSuccess("新增设备成功");
              this.open = false;
              this.getList();
            });
          }
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
          return deleteEquipment(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //选择负责人
    selectPrincipal(principal) {
      this.equipmentUsers = principal;
      this.form.equipmentUsers = principal.map((item) => {
        return { userId: item };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
</style>
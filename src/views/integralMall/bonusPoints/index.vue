<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="激励对象" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入激励对象名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getDateRange"
        ></el-date-picker>
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
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="list">
      <el-table-column type="index" width="50" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="激励对象"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="激励积分" align="center" prop="changePoint" />
      <el-table-column label="激励原因" align="center" prop="remark" />
      <el-table-column label="操作人" align="center" prop="createUserName" />
      <el-table-column label="操作时间" align="center" prop="createTime" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 调整积分对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <div class="container">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="激励对象" prop="userId">
                <el-select
                  v-model="form.userId"
                  :filterable="true"
                  placeholder="请选择验收人"
                  style="width: 100%"
                  @change="getMemeber"
                >
                  <el-option
                    v-for="item in memberOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                    :disabled="item.status == 1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现有积分">
                <el-input v-model="point" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="激励类型" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择激励积分类型"
                  @change="getType"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="typeValue == '2' ? '扣除积分' : '奖励积分'"
                prop="changePoint"
              >
                <el-input v-model="form.changePoint" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="激励原因" prop="remark">
                <el-input type="textarea" v-model="form.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getIntegralList,changeIntegral } from "@/api/system/user";
import { getPrincipal, getUserTree } from "@/api/system/dept";
import {getUser} from "@/api/system/user"
export default {
  data() {
    return {
      // 遮罩层
      loading: true,

      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      memberOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          {
            required: true,
            message: "激励对象不能为空",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "激励类型不能为空",
            trigger: "change",
          },
        ],
        changePoint: [
          {
            required: true,
            message: "激励积分不能为空",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "激励积分说明不能为空",
            trigger: "blur",
          },
        ],
      },
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        beginCreateTime: undefined,
        endCreateTime: undefined,
      },
      typeOptions: [
        { value: "1", label: "奖励" },
        { value: "2", label: "扣除" },
      ],
      realName: "",
      point: "",
      typeValue: "",
      userId:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getIntegralList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.list = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        } else {
          this.msgError("获取用户列表失败，请重试！");
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = [];
      this.queryParams.beginCreateTime = null;
      this.queryParams.endCreateTime = null;
      this.handleQuery();
    },
    //获取查询时间范围
    getDateRange(value) {
      this.queryParams.beginCreateTime = value[0];
      this.queryParams.endCreateTime = value[1];
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增激励";
      // 获取部门负责人列表
      getPrincipal().then((res) => {
        this.memberOptions = res.obj;
        // this.principalOptions = res.obj.map((item) => {
        //   return this.addValue(item);
        // });
        console.log(this.memberOptions);
      });
    },
    getType(value) {
      this.typeValue = value;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form.userId = this.userId;
          changeIntegral(this.form).then((res) => {
            if (res.status == "SUCCESS") {
              this.loading = false;
              this.msgSuccess("激励成功！");
              this.open = false;
              this.getList();
            } else {
              this.loading = false;
              this.open = false;
              this.msgError(res.message);
            }
          });
        }
      });
    },
    getMemeber(value){
        this.userId=value
        getUser(value).then(res=>{
            if(res.code==200){
                this.point=res.data.point
            }
        })
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #ddd;
  border-bottom: none;
}
</style>
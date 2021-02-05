<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="调整对象" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入调整对象名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="调整时间">
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

    <el-table v-loading="loading" :data="list">
      <el-table-column type="index" width="50" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整人" align="center" prop="createUserName" />
      <el-table-column
        label="调整对象"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="调整积分" align="center" prop="changePoint" />
      <el-table-column label="调整原因" align="center" prop="remark" />
      <el-table-column label="调整时间" align="center" prop="createTime" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getIntegralList } from "@/api/system/user";

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
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        beginCreateTime: undefined,
        endCreateTime: undefined,
      },
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
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #ddd;
  border-bottom: none;
}
</style>
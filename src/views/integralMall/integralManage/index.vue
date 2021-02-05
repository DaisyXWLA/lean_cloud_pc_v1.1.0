<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="订单编号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入订单编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="兑换人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入兑换人姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          :filterable="true"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兑换时间">
        <el-date-picker
          v-model="time"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
          icon="el-icon-sell"
          size="mini"
          @click="giveOut"
          v-hasPermi="['system:role:add']"
          >发放</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload2"
          size="mini"
          @click="exportFile"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" >
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单编号"
        prop="orderSn"
        width="300"
        align="center"
      />
      <el-table-column label="兑换人" prop="userName" align="center" />
      <el-table-column
        label="兑换商品"
        prop="prizes"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="兑换时间" prop="createTime" align="center" />
      <el-table-column label="消费积分" prop="price" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 2">未发放</span>
          <span v-else-if="scope.row.status == 3">{{
            scope.row.deliverTime
          }}</span>
        </template>
      </el-table-column>
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
            icon="el-icon-sell"
            @click="giveOut(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.status!=3"
            >发放</el-button
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
  </div>
</template>

<script>
import { orderList, changeStatus } from "@/api/order/order";

export default {
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
      // 订单列表
      orderList: [],
      //兑换时间
      time:null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //订单状态
      statusOptions: [
        { key: "", title: "全部" },
        { key: "2", title: "未发放" },
        { key: "3", title: "已发放" },
      ],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        status: "",
        orderSn: undefined,
        beginCreateTime:undefined,
        endCreateTime:undefined
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      if(this.time!=null){
        this.queryParams.beginCreateTime=this.time[0]
        this.queryParams.endCreateTime=this.time[1]
      }
      orderList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          // console.log(res);
          this.orderList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.beginCreateTime=undefined
      this.queryParams.endCreateTime=undefined
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.time=null
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 发放
    giveOut(row) {
      const orderId = row.id || this.ids;
      this.$confirm("是否确认发放已选商品?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return changeStatus(orderId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("发放成功！");
        });
    },
    // 导出
    exportFile() {
      const queryParams = this.queryParams;
      queryParams.export = 1;
      this.$confirm("是否确认导出所有数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return orderList(queryParams);
        })
        .then((res) => {
          console.log(res)
          this.download(res.msg);
          setTimeout(()=>{
            delete queryParams.export;
          })
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
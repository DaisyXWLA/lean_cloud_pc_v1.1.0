<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="按键名称" prop="buttonName">
        <el-input
          v-model="queryParams.buttonName"
          placeholder="请输入按键名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起人" prop="createUserName">
        <el-input
          v-model="queryParams.createUserName"
          placeholder="请输入发起人姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="响应人" prop="responseUserName">
        <el-input
          v-model="queryParams.responseUserName"
          placeholder="请输入响应人姓名"
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
          :clearable="true"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间">
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
    <el-table
      v-loading="loading"
      :data="abnormalList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="80">
        <template slot-scope="scope">
          <span>{{ (queryParams.current - 1) * queryParams.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="按键"
        prop="buttonName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="按键组" prop="buttonTeamName" align="center" />
      <el-table-column label="发起人" prop="createUserName" align="center" />
      <el-table-column label="发起时间" prop="createTime" align="center" />
      <!-- <el-table-column label="发起时间" prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="响应人" prop="responseUserName" align="center" />
      <el-table-column label="持续时间" prop="durationSeconds" align="center">
        <template slot-scope="scope">
          <span>{{ formatterTime(scope.row.durationSeconds) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="响应时间" prop="responseTime" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.responseTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属区域" prop="areaName" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" class="color-pending">未响应</span>
          <span v-else-if="scope.row.status == 3" class="color-underway"
            >处理中</span
          >
          <span v-else-if="scope.row.status == 4" class="color-finish"
            >已完成</span
          >
          <span v-else-if="scope.row.status == 5" class="color-sum"
            >已总结</span
          >
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
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-if="scope.row.status != 2"
            >详情</el-button
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" class="detail">
        <div class="title">事件基本信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按键">{{ form.buttonName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按键类型">{{
              form.buttonTypeName
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="按键组">{{
              form.buttonTeamName
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要程度"
              ><el-rate v-model="form.buttonImportantLevel" disabled> </el-rate
            ></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属区域">{{ form.areaName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="按键负责人">{{
              buttonChargeUsers
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上报人">{{
              form.createUserName
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报时间">{{ form.createTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.responseUserName != null">
          <el-col :span="12">
            <el-form-item label="响应人">{{
              form.responseUserName
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="响应时间">{{
              form.responseTime
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.doneUserName != null">
          <el-col :span="12">
            <el-form-item label="完成人">{{ form.doneUserName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">{{ form.doneTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.summaryUser != null">
          <el-col :span="12">
            <el-form-item label="总结人">{{ form.summaryUser }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总结时间">{{ form.summaryTime }}</el-form-item>
          </el-col>
        </el-row>
        <!-- <div class="title">事件附加信息</div> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="异常描述">{{ form.description }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附加照片"
              ><el-image
                v-for="item in imgUrl"
                :key="item"
                style="width: 60px; height: 60px"
                :src="item"
                fit="cover"
                :preview-src-list="[item]"
              ></el-image
            ></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-collapse accordion>
              <el-collapse-item title="事件处理状态记录">
                <div v-for="(item, index) in form.processFlows" :key="index">
                  <div class="process">
                    <span
                      v-if="item.statusName == '未处理'"
                      class="circle circle-pending"
                    ></span>
                    <span
                      v-else-if="item.statusName == '已分配'"
                      class="circle circle-assign"
                    ></span>
                    <span
                      v-else-if="item.statusName == '已响应'"
                      class="circle circle-response"
                    ></span>
                    <span
                      v-else-if="item.statusName == '处理中'"
                      class="circle circle-underway"
                    ></span>
                    <span
                      v-else-if="item.statusName == '已完成'"
                      class="circle circle-finish"
                    ></span>
                    <span
                      v-else-if="item.statusName == '已总结'"
                      class="circle circle-sum"
                    ></span>

                    <span
                      v-if="item.statusName == '未处理'"
                      class="status pending"
                    >
                      {{ item.statusName }}
                    </span>
                    <span
                      v-else-if="item.statusName == '已分配'"
                      class="status assign"
                    >
                      {{ item.statusName }}
                    </span>
                    <span
                      v-else-if="item.statusName == '已响应'"
                      class="status response"
                    >
                      {{ item.statusName }}
                    </span>
                    <span
                      v-else-if="item.statusName == '处理中'"
                      class="status underway"
                    >
                      {{ item.statusName }}
                    </span>
                    <span
                      v-else-if="item.statusName == '已完成'"
                      class="status finish"
                    >
                      {{ item.statusName }}
                    </span>
                    <span
                      v-else-if="item.statusName == '已总结'"
                      class="status sum"
                    >
                      {{ item.statusName }}
                    </span>
                    <div class="content">
                      <div class="name">
                        {{ item.userName }}
                      </div>
                      <div class="time">
                        {{ item.doTime }}
                      </div>
                    </div>
                    <div class="remark" v-if="item.status == 1">
                      分配人数：{{ item.distributionUserCount }}
                    </div>
                    <div class="allot" v-if="form.processFlows.length == 2">
                      分配人：{{ buttonResponseUsers }}
                    </div>
                    <div class="remark" v-if="item.statusName == '已总结'">
                      总结：{{ item.doRemark }}
                    </div>
                    <div class="remark" v-else>
                      状态描述：{{ item.doRemark }}
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getButtonType } from "@/api/abnormal/buttonManage";
import { abnormalList, getAbnormal } from "@/api/abnormal/abnormalList";
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
      abnormalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //区域下拉选项
      areaOptions: [],
      //查询时间
      time: null,
      //状态下拉选项
      statusOptions: [
        { value: "1", label: "未响应" },
        { value: "3", label: "处理中" },
        { value: "4", label: "已完成" },
        { value: "5", label: "已总结" },
      ],
      //状态颜色
      statusColor: "",
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        buttonName: undefined,
        createUserName: undefined,
        responseUserName: undefined,
        status: undefined,
        beginCreateTime: undefined,
        endCreateTime: undefined,
      },
      // 表单参数
      form: {},
      buttonInfo: {},
      buttonChargeUsers: "",
      imgUrl: [],
      baseURL: "",
      buttonResponseUsers: "",
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.baseURL = process.env.VUE_APP_BASE_API;
  },
  methods: {
    /** 查询异常记录列表 */
    getList() {
      this.loading = true;
      if (this.time != null) {
        this.queryParams.beginCreateTime = this.time[0];
        this.queryParams.endCreateTime = this.time[1];
      }
      abnormalList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.abnormalList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
      //获取按键类别下拉选项
      //获取按键类别
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.queryParams.beginCreateTime = undefined;
      this.queryParams.endCreateTime = undefined;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {};
      this.time=undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情 */
    handleDetail(row) {
      getAbnormal(row.id).then((res) => {
        if (res.status == "SUCCESS") {
          this.title = "异常详情";
          this.open = true;
          this.form = res.obj.abnormal;
          this.buttonInfo = res.obj.button;
          this.buttonChargeUsers = res.obj.button.buttonChargeUsers
            .map((item) => {
              return item.userName;
            })
            .join(",");
          this.imgUrl = res.obj.abnormal.images.split(";").map((item) => {
            return `${this.baseURL}${item}`;
          });
          this.buttonResponseUsers = res.obj.button.buttonResponseUsers
            .map((item) => {
              return item.userName;
            })
            .join(",");
        }
      });
    },
    // 字典状态翻译
    statusFormat(row, column) {
      if (row.status == 0) {
        this.statusColor = "color-pending";
        return "未处理";
      } else if (row.status == 1) {
        this.statusColor = "color-assign";
        return "已分配";
      } else if (row.status == 2) {
        this.statusColor = "color-response";
        return "已响应";
      } else if (row.status == 3) {
        this.statusColor = "color-underway";
        return "处理中";
      } else if (row.status == 4) {
        this.statusColor = "color-finish";
        return "已完成";
      } else if (row.status == 5) {
        this.statusColor = "color-sum";
        return "已总结";
      }
    },
    //格式化时间
    formatterTime(time) {
      let result = parseInt(time);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "00") res += `${h}小时`;
      if (m !== "00") res += `${m}分`;
      res += `${s}秒`;
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px;
}

/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-checkbox-group {
  padding-left: 30px;
}
/deep/ .el-form-item__content {
  color: #999;
}
.color-pending {
  color: #ff6348;
}

.color-assign {
  color: #ffa502;
}

.color-response {
  color: #ffc312;
}

.color-underway {
  color: #2db755;
}

.color-finish {
  color: #2bcbba;
}

.color-sum {
  color: #2d98da !important;
}
.detail {
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .title {
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
    font-weight: bolder;
  }
  .process {
    // display: flex;
    padding-left: 20px;
    line-height: 20px;
    margin-top: 5px;

    .circle {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff6348;
      // margin-right: 10px;
    }

    .circle-pending {
      background: #ff6348;
    }

    .circle-assign {
      background: #ffa502;
    }

    .circle-response {
      background: #ffc312;
    }

    .circle-underway {
      background: #2db755;
    }

    .circle-finish {
      background: #2bcbba;
    }

    .circle-sum {
      background: #2d98da;
    }

    .status {
      font-size: 14px;
    }

    .pending {
      color: #ff6348;
    }

    .assign {
      color: #ffa502;
    }

    .response {
      color: #ffc312;
    }

    .underway {
      color: #2db755;
    }

    .finish {
      color: #2bcbba;
    }

    .sum {
      color: #2d98da;
    }
  }

  .content {
    margin-top: 5px;
    line-height: 16px;

    .name {
      font-size: 14px;
      color: #666;
    }

    .time {
      font-size: 12px;
      color: #999;
    }
  }

  .remark {
    // padding-left: 10px;
    font-size: 14px;
    color: #666;
  }

  .num {
    // padding-left: 10px;
    font-size: 14px;
    color: #666;
  }
  /deep/ .el-collapse {
    border-top: 0;
    border-bottom: 0;
  }
  /deep/ .el-collapse-item__header {
    border-bottom: 0;
    font-size: 14px;
    color: #666;
    font-weight: bolder;
  }
  /deep/ label {
    font-weight: inherit;
  }
}
</style>

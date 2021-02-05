<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          size="small"
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

    <el-table v-loading="loading" :data="configList" @row-click="handleUpdate">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        label="序号"
        type="index"
        align="center"
        prop="id"
        width="100"
      />
      <el-table-column
        label="配置名称"
        align="center"
        prop="configName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="更新人" align="center" prop="updater" />
      <el-table-column label="更新时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 异常配置对话框 -->
    <el-drawer
      :title="title"
      :withHeader="false"
      :visible.sync="abnormalConfigOpen"
      size="40%"
    >
      <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="21">
                <span>{{ title }}</span>
              </el-col>
              <el-col :span="3">
                <el-button icon="el-icon-receiving" @click="submitAbnormalForm"
                  >保存</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" class="close"
            ><el-button icon="el-icon-close" @click="abnormalCancel"></el-button
          ></el-col>
        </el-row>
      </div>
      <div class="abnormal-config-container">
        <el-form ref="abnormalForm" :model="form" label-width="230px">
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="通知人是否有操作异常处理的权限"
                prop="noticeUserHasAuthForAbnormal"
              >
                <el-switch
                  v-model="form.noticeUserHasAuthForAbnormal"
                  active-color="#13ce66"
                >
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
    <!-- 合理化建议配置对话框 -->
    <el-drawer
      :title="title"
      :withHeader="false"
      :visible.sync="proposalConfigOpen"
      size="45%"
    >
      <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="21">
                <span>{{ title }}</span>
              </el-col>
              <el-col :span="3">
                <el-button icon="el-icon-receiving" @click="submitProposalForm"
                  >保存</el-button
                >
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2" class="close"
            ><el-button icon="el-icon-close" @click="proposalCancel"></el-button
          ></el-col>
        </el-row>
      </div>
      <div class="proposal-config-container">
        <div class="form">
          <el-form ref="proposalForm" :model="form" label-width="240px">
            <el-row>
              <el-col :span="auditPointFlag ? 12 : 24">
                <el-form-item label="审核时是否发放积分" prop="auditPoint">
                  <el-switch
                    v-model="form.auditPoint"
                    active-color="#13ce66"
                    @change="getAuditPointFlag"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="auditPointFlag">
                <el-form-item label="审核时发放积分范围">
                  <el-input
                    v-model="form.auditMinPoint"
                    size="mini"
                    placeholder="请输入发放积分最小值"
                  ></el-input>
                  <span style="padding: 0 5px; color: #999">-</span>
                  <el-input
                    v-model="form.auditMaxPoint"
                    size="mini"
                    placeholder="请输入发放积分最大值"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="checkPointFlag ? 12 : 24">
                <el-form-item label="验收时是否发放积分" prop="checkPoint">
                  <el-switch
                    v-model="form.checkPoint"
                    active-color="#13ce66"
                    @change="getCheckPointFlag"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="checkPointFlag">
                <el-form-item label="验收时发放积分范围">
                  <el-input
                    v-model="form.checkMinPoint"
                    size="mini"
                    placeholder="请输入发放积分最小值"
                  ></el-input>
                  <span style="padding: 0 5px; color: #999">-</span>
                  <el-input
                    v-model="form.checkMaxPoint"
                    size="mini"
                    placeholder="请输入发放积分最大值"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="select">
              <el-col :span="12"
                ><el-form-item label="审核时效设置" prop="auditTimeLimit">
                  <el-select
                    v-model="form.auditTimeLimit"
                    placeholder="请选择时效"
                    size="mini"
                  >
                    <el-option
                      v-for="dict in timeOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="12">
                <el-form-item label="验收人配置" prop="checkByLaunchOrFinish">
                  <el-select
                    v-model="form.checkByLaunchOrFinish"
                    placeholder="请选择验收人"
                    size="mini"
                  >
                    <el-option
                      v-for="dict in checkByLaunchOrFinishOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="验收人是否可以验收自己落实的提案"
                  prop="checkBySelf"
                  label-width="240px"
                >
                  <el-switch v-model="form.checkBySelf" active-color="#13ce66">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="审核人是否可以审核自己发起的提案"
                  prop="auditBySelf"
                  label-width="240px"
                >
                  <el-switch v-model="form.auditBySelf" active-color="#13ce66">
                  </el-switch>
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
  configList,
  getAbnormalConfig,
  modifyAbnormalConfig,
  getProposalConfig,
  modifyProposalConfig,
} from "@/api/configuration/configuration";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公告表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 表单参数
      form: {},
      // 是否显示弹出层
      abnormalConfigOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      proposalConfigOpen: false,
      checkPointFlag: false,
      auditPointFlag: false,
      timeOptions: [
        { value: "60", label: "1小时" },
        { value: "120", label: "2小时" },
        { value: "360", label: "6小时" },
        { value: "720", label: "12小时" },
        { value: "1440", label: "24小时" },
        { value: "2880", label: "48小时" },
      ],
      checkByLaunchOrFinishOptions: [
        { value: "1", label: "发起人所属的部门验收" },
        { value: "2", label: "落实人所属的部门验收" },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      configList(this.queryParams).then((response) => {
        this.configList = response.obj.records;
        this.total = response.obj.total;
        this.loading = false;
      });
    },
    // 取消按钮
    abnormalCancel() {
      this.abnormalConfigOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeUserHasAuthForAbnormal: false,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const flag = row.configKey;
      if (row.configKey == "abnormalConfig") {
        getAbnormalConfig().then((res) => {
          this.form = res.obj;
          this.abnormalConfigOpen = true;
          this.title = "修改异常配置";
        });
      } else if (row.configKey == "proposalConfig") {
        getProposalConfig().then((res) => {
          console.log(res);
          this.form = res.obj;
          this.checkPointFlag = res.obj.checkPoint;
          this.auditPointFlag = res.obj.auditPoint;
          if (res.obj.auditTimeLimit == "60") {
            this.form.auditTimeLimit = "1小时";
          } else if (res.obj.auditTimeLimit == "120") {
            this.form.auditTimeLimit = "2小时";
          } else if (res.obj.auditTimeLimit == "360") {
            this.form.auditTimeLimit = "6小时";
          } else if (res.obj.auditTimeLimit == "720") {
            this.form.auditTimeLimit = "12小时";
          } else if (res.obj.auditTimeLimit == "1440") {
            this.form.auditTimeLimit = "24小时";
          } else if (res.obj.auditTimeLimit == "2880") {
            this.form.auditTimeLimit = "48小时";
          }
          if (res.obj.checkByLaunchOrFinish == "1") {
            this.form.checkByLaunchOrFinish = "发起人所属的部门验收";
          } else if (res.obj.checkByLaunchOrFinish == "2") {
            this.form.checkByLaunchOrFinish = "落实人所属的部门验收";
          }
          this.proposalConfigOpen = true;
          this.title = "修改合理化建议配置";
        });
      }
    },
    /** 提交异常配置 */
    submitAbnormalForm() {
      this.$refs["abnormalForm"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          modifyAbnormalConfig(this.form).then((res) => {
            this.msgSuccess("修改异常配置成功！");
            this.abnormalConfigOpen = false;
            this.getList();
          });
        }
      });
    },
    submitProposalForm() {
      this.$refs["proposalForm"].validate((valid) => {
        if (valid) {
          if (this.form.auditTimeLimit == "1小时") {
            this.form.auditTimeLimit = "60";
          } else if (this.form.auditTimeLimit == "2小时") {
            this.form.auditTimeLimit = "120";
          } else if (this.form.auditTimeLimit == "6小时") {
            this.form.auditTimeLimit = "360";
          } else if (this.form.auditTimeLimit == "12小时") {
            this.form.auditTimeLimit = "720";
          } else if (this.form.auditTimeLimit == "24小时") {
            this.form.auditTimeLimit = "1440";
          } else if (this.form.auditTimeLimit == "48小时") {
            this.form.auditTimeLimit = "2880";
          }
          if (this.form.checkByLaunchOrFinish == "发起人所属的部门验收") {
            this.form.checkByLaunchOrFinish = "1";
          } else if (
            this.form.checkByLaunchOrFinish == "落实人所属的部门验收"
          ) {
            this.form.checkByLaunchOrFinish = "2";
          }
          modifyProposalConfig(this.form).then((res) => {
            this.msgSuccess("修改合理化建议配置成功！");
            this.proposalConfigOpen = false;
            this.getList();
          });
        }
      });
    },
    // 取消按钮
    proposalCancel() {
      this.proposalConfigOpen = false;
      this.reset();
    },
    //验收是否发放积分
    getCheckPointFlag(value) {
      this.checkPointFlag = value;
    },
    //审核是否发放积分
    getAuditPointFlag(value) {
      this.auditPointFlag = value;
    },
  },
};
</script>
<style lang="scss" scoped>
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
.abnormal-config-container {
  padding: 20px;

  /deep/ .el-form-item__label {
    color: #999;
    font-size: 12px;
  }
}
/deep/ .el-drawer {
  background: #f9f9f9;
}
.proposal-config-container {
  padding: 20px;
  .form {
    border: 1px solid #ddd;
    border-bottom: none;
    border-right: none;
    background: #fff;
    /deep/ .el-input {
      width: 40%;
    }
    /deep/ .el-input__inner {
      padding: 0 5px;
      text-align: center;
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      padding: 5px 10px;
      border-bottom: 1px solid #ddd;

      border-right: 1px solid #ddd;
    }
    /deep/ .el-form-item__label {
      color: #999;
      font-size: 12px;
    }
    /deep/ .el-form-item--medium .el-form-item__content{
      line-height: 34px;
    }
    .select {
      /deep/ .el-input {
        width: 100%;
      }
    }
  }
}
</style>
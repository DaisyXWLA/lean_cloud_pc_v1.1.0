<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="提案标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入提案标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="所属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="true"
          placeholder="请选择部门"
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item label="类别" prop="proposalType">
        <el-select
          v-model="queryParams.proposalType"
          placeholder="请选择类别"
          clearable
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域" prop="areaId">
        <treeselect
          v-model="queryParams.areaId"
          :options="areaOptions"
          :show-count="true"
          placeholder="请选择区域"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="auditStatus">
        <el-select
          v-model="auditStatus"
          placeholder="岗位状态"
          clearable
          multiple
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
        <el-button type="cyan" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="proposalList"
      @row-click="handleDetail"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column
        label="提案标题"
        prop="title"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="所属部门" prop="deptName" align="center" />
      <el-table-column label="类别" prop="typeName" align="center" />
      <el-table-column label="区域" prop="areaName" align="center" />
      <el-table-column label="创建人" prop="realName" align="center" />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        :formatter="formatTime"
      />
      <el-table-column
        label="状态"
        prop="status"
        align="center"
        :formatter="formatStatus"
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
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:role:edit']"
            >详情</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            >删除</el-button
          > -->
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
    <el-drawer :title="title" :visible.sync="open" size="45%">
      <div class="detail-container">
        <div class="content">
          <el-form label-width="100">
            <div class="box">
              <div class="title">提案基本信息</div>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="提案标题">
                    {{ form.title }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态" class="border-left">
                    <span :style="'color:' + color">{{
                      status(form.auditStatus)
                    }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="创建人">{{
                    form.realName
                  }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="创建时间"
                    prop="code"
                    class="border-left"
                  >
                    {{ form.createTime }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属部门">
                    {{ form.deptName }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区域" class="border-left">
                    <span>{{ form.areaName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="类别">{{ form.typeName }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="现状描述">
                    {{ form.state }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="期望建议">
                    {{ form.proposal }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="accessory">
                <el-col :span="24">
                  <el-form-item label="附件">
                    <div class="img">
                      <el-image v-if="pictures.length == 0" fit="cover">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <el-image
                        v-for="(item, index) in pictures"
                        :key="index"
                        :src="baseURL + item"
                        :preview-src-list="[baseURL + item]"
                        fit="cover"
                      ></el-image>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div class="box">
            <div class="title">提案处理状态记录</div>
            <div class="process">
              <div
                class="process-content"
                v-for="(item, index) in form.flowProcessList"
                :key="index"
              >
                <div class="left">
                  <i
                    v-if="
                      item.doneStatus == 2 && item.name.indexOf('撤销') == -1
                    "
                    class="el-icon-error refuse"
                  ></i>
                  <i
                    v-else-if="
                      item.doneStatus == 2 && item.name.indexOf('撤销') != -1
                    "
                    class="el-icon-refresh-left backout"
                  ></i>
                  <i
                    v-else-if="item.doneStatus == 1"
                    class="el-icon-success complete"
                  ></i>
                  <i
                    v-else-if="item.doneStatus == 0"
                    class="el-icon-remove pending"
                  ></i
                  ><span class="title">{{ item.name }}</span>
                </div>
                <div class="right">
                  <span><label>操作人：</label>{{ item.acceptName }}</span>
                  <span
                    v-if="
                      index == form.flowProcessList.length - 1 &&
                      item.name.indexOf('通过') == -1 &&
                      item.name.indexOf('撤销') == -1
                    "
                    ><label>已等待：</label>{{ waitTime(processTime) }}</span
                  >
                  <span
                    v-else-if="
                      (index == form.flowProcessList.length - 1 &&
                        item.name.indexOf('通过') != -1) ||
                      (index == form.flowProcessList.length - 1 &&
                        item.name.indexOf('撤销') != -1)
                    "
                    ><label>操作时间：</label
                    >{{ processTimeFormat(item.doneTime) }}</span
                  >
                  <span v-else
                    ><label>操作时间：</label
                    >{{ processTimeFormat(item.acceptTime) }}</span
                  >
                  <span class="content" v-if="item.content == null">
                    <span>
                      <label>{{ contentFormat(item.content) }}</label>
                    </span>
                  </span>
                  <span
                    class="content"
                    v-else-if="item.content.indexOf('<br/>') == -1"
                  >
                    <span>
                      <label class="steps-content"
                        >描述：{{ contentFormat(item.content) }}</label
                      >
                    </span>
                  </span>
                  <span class="content" v-else>
                    <span>
                      <label
                        class="steps-content"
                        v-if="contentFormat(item.content).expense == ''"
                      ></label>
                      <label class="steps-content" v-else
                        >预计投入：{{
                          contentFormat(item.content).expense
                        }}
                        元</label
                      >
                    </span>
                    <span>
                      <label
                        class="steps-content"
                        v-if="contentFormat(item.content).integral == ''"
                      ></label>
                      <label
                        class="steps-content"
                        v-else-if="item.name.indexOf('审核') != -1"
                        >提案积分奖励：{{
                          contentFormat(item.content).integral
                        }}</label
                      >
                      <label
                        class="steps-content"
                        v-else-if="item.name.indexOf('验收') != -1"
                        >落实积分奖励：{{
                          contentFormat(item.content).integral
                        }}</label
                      >
                    </span>
                    <span>
                      <label
                        class="steps-content"
                        v-if="contentFormat(item.content).finishTime == ''"
                      ></label>
                      <label class="steps-content" v-else
                        >期望时间：{{
                          contentFormat(item.content).finishTime
                        }}</label
                      >
                    </span>
                    <span>
                      <label class="steps-content"
                        >描述：{{ contentFormat(item.content).content }}</label
                      >
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="title">提案评审记录</div>
            <div class="check-process">
              <div class="left"><span class="title">提案一审</span></div>
              <div class="right">
                <div class="standard">
                  <label style="white-space: nowrap">评审标准：</label>
                  <div class="standard-content">
                    <el-table :data="data" :border="true"
                      ><el-table-column
                        label="评审维度"
                        align="center"
                        prop="dimensionality"
                      ></el-table-column
                      ><el-table-column
                        label="评审细则"
                        align="center"
                        prop="option"
                      ></el-table-column
                      ><el-table-column
                        label="得分"
                        align="center"
                        width="80"
                        prop="score"
                      ></el-table-column
                    ></el-table>
                  </div>
                </div>
                <div class="comment">
                  <label>评审意见：</label>啦啦啦啦啦啦啦啦
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { proposalList, getDetail, getType } from "@/api/proposal/proposal";
import { getTreeList } from "@/api/system/area";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import pic from "@/assets/401_images/401.gif";
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
      proposalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        title: undefined,
        deptId: undefined,
        proposalType: undefined,
        areaId: undefined,
        auditStatus: undefined,
      },
      auditStatus: [],
      deptOptions: [],
      typeOptions: [],
      areaOptions: [],
      statusOptions: [
        { dictValue: "0", dictLabel: "审核未通过" },
        { dictValue: "1", dictLabel: "待审核" },
        { dictValue: "2", dictLabel: "待落实" },
        { dictValue: "3", dictLabel: "已完成" },
        { dictValue: "5", dictLabel: "验收通过" },
        { dictValue: "4", dictLabel: "已撤销" },
      ],
      // 表单参数
      form: {},
      pictures: [],
      processTime: "",
      contentObj: {},
      //评审标准
      data: [
        {
          dimensionality: "质量",
          option: "提高商品价值提高公司形象",
          score: "10",
        },
      ],
      //上传图片
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      baseURL: "",
      picUrl: pic,
      processList: [],
      //状态字体颜色
      color: "",
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.baseURL = process.env.VUE_APP_BASE_API;
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = false;
      proposalList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.proposalList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        }
      });
      //获取部门选项
      treeselect().then((res) => {
        // console.log(res.data)
        this.deptOptions = res.data;
      });
      //获取类别选项
      getType().then((res) => {
        console.log(res);
        this.typeOptions = res.obj;
      });
      //获取区域选项
      getTreeList().then((res) => {
        this.areaOptions = res.obj;
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
      if (this.auditStatus.length != 0) {
        this.queryParams.auditStatus = this.auditStatus.join(",");
      }
      this.queryParams.pages = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.auditStatus = [];
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
      // this.reset();
      this.open = true;
      this.title = "新增提案";
    },
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.open = true;
      this.title = "合理化建议详情";
      getDetail(row.id).then((res) => {
        console.log(res);
        if (res.status == "SUCCESS") {
          this.form = res.obj;
          if (res.obj.pictures != "[]" && res.obj.pictures != null) {
            this.pictures = res.obj.pictures.split(";");
          }
          this.processTime =
            res.obj.flowProcessList[
              res.obj.flowProcessList.length - 2
            ].acceptTime;
        }
      });
    },
    //格式化状态
    formatStatus(row, column, value) {
      if (row.auditStatus == 0) {
        return "审核未通过";
      } else if (row.auditStatus == 1) {
        return "待审核";
      } else if (row.auditStatus == 2) {
        return "待落实";
      } else if (row.auditStatus == 3) {
        return "已完成";
      } else if (row.auditStatus == 4) {
        return "已撤销";
      } else if (row.auditStatus == 5) {
        return "验收通过";
      }
    },
    //流程内容格式化
    //计算等待时间
    waitTime(startTime) {
      let date1 = new Date(startTime); //开始时间
      let date2 = new Date(); //结束时间
      let date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数

      //计算出相差天数
      let days = Math.floor(date3 / (24 * 3600 * 1000));
      //计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000));

      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      if (days == 0) {
        return `${hours}小时${minutes}分钟${seconds}秒`;
      } else {
        return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
      }
    },
    //格式化时间
    processTimeFormat(time) {
      let date = new Date(time);
      let newTime = `${this.addZero(date.getMonth() + 1)}月${this.addZero(
        date.getDate()
      )}日  ${this.addZero(date.getHours())}:${this.addZero(
        date.getMinutes()
      )}`;
      return newTime;
    },
    //时间补零
    addZero(time) {
      return time < 10 ? `0${time}` : time;
    },
    // 流程内容格分割
    contentFormat(str) {
      if (str == null) {
        return "";
      } else if (str.indexOf("<br/>") == -1) {
        return str;
      } else {
        // return str.
        // console.log(str.match(new RegExp('<br/>', "g")))
        let indexArr = [];
        for (let i = 0; i < str.length; i++) {
          if (str[i] == "<") {
            indexArr.push(i);
          }
        }
        if (indexArr.length == 0) {
          this.contentObj.content = str.slice(0, indexArr[0]);
          this.contentObj.finishTime = "";
          this.contentObj.integral = "";
          this.contentObj.expense = "";
        } else if (indexArr.length == 1) {
          this.contentObj.content = str.slice(0, indexArr[0]);
          this.contentObj.finishTime = str.slice(indexArr[0] + 12, indexArr[1]);
          this.contentObj.integral = "";
          this.contentObj.expense = "";
        } else if (indexArr.length == 2) {
          this.contentObj.content = str.slice(0, indexArr[0]);
          this.contentObj.finishTime = str.slice(indexArr[0] + 12, indexArr[1]);
          this.contentObj.integral = str.slice(indexArr[1] + 12);
          this.contentObj.expense = "";
        } else {
          this.contentObj.content = str.slice(0, indexArr[0]);
          this.contentObj.finishTime = str.slice(indexArr[0] + 12, indexArr[1]);
          this.contentObj.integral = str.slice(indexArr[2] + 12);
          this.contentObj.expense = str.slice(
            indexArr[1] + 10,
            indexArr[2] - 1
          );
        }
        return this.contentObj;
      }
    },
    //格式化列表中创建时间
    formatTime(row, column) {
      let date = new Date(row.createTime);
      let newTime = `${date.getFullYear()}-${this.addZero(
        date.getMonth() + 1
      )}-${this.addZero(date.getDate())}`;
      return newTime;
    },
    addZero(time) {
      return time < 10 ? `0${time}` : time;
    },
    //格式化状态
    status(status) {
      if (status == 0) {
        this.color = "#fe6e69";
        return "审核未通过";
      } else if (status == 1) {
        this.color = "#fdb205";
        return "待审核";
      } else if (status == 2) {
        this.color = "#fdb205";
        return "待落实";
      } else if (status == 3) {
        this.color = "#2db755";
        return "已完成";
      } else if (status == 4) {
        this.color = "#f19066";
        return "已撤销";
      } else if (status == 5) {
        this.color = "#2db755";
        return "验收通过";
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
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-drawer {
  background: #f9f9f9;
}
/deep/ .el-drawer__header {
  background: #f5f5f5;
  padding: 15px 30px;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
}
.detail-container {
  padding: 0 30px;
  .content {
    .box {
      border: 1px solid #e5e5e5;
      background: #fff;
      margin-top: 20px;
    }
    .title {
      font-size: 16px;
      color: #555;
      padding: 15px;
      font-weight: bold;
    }
    .border-left {
      border-left: 1px solid #e5e5e5;
    }
    /deep/ .el-form-item {
      border-top: 1px solid #e5e5e5;
      margin-bottom: 0;
    }

    /deep/ .el-form-item__label {
      width: 130px;
      text-align: right;
      margin-right: 20px;
      color: #999;
      border-right: 1px solid #e5e5e5;
    }
    /deep/ .el-form-item__content {
      text-align: left;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .accessory {
      /deep/ .el-form-item--medium .el-form-item__label {
        line-height: 75px;
      }
      /deep/ .el-image {
        height: 65px;
        width: 65px;
        border-radius: 4px;
        margin: 5px 0 5px 5px;
      }
      /deep/ .el-form-item__content {
        height: 75px;
      }
    }
    .process {
      border-top: 1px solid #e5e5e5;
      .process-content {
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .left {
          width: 16%;
          display: flex;
          align-items: center;
          border-right: 1px solid #e5e5e5;
          padding: 15px;
          .title {
            color: #666;
            font-size: 14px;
            padding-left: 5px;
            padding-right: 0;
          }

          .refuse {
            font-size: 16px;
            color: #fe6e69;
          }

          .pending {
            font-size: 16px;
            color: #fdb205;
          }

          .transfer {
            font-size: 16px;
            color: #539cf8;
          }

          .complete {
            font-size: 16px;
            color: #2db755;
          }

          .backout {
            font-size: 10px;
            color: #fff;
            background: #f19066;
            padding: 2px;
            border-radius: 50%;
          }
        }
        .right {
          width: 84%;
          padding: 10px 15px;
          label {
            font-weight: normal;
          }
          span {
            display: block;
            color: #333;
            font-size: 14px;
            line-height: 21px;
          }
        }
      }
    }
    .check-process {
      display: flex;
      // align-items: center;
      border-top: 1px solid #e5e5e5;
      .left {
        width: 15%;
        padding: 15px 0;
        text-align: center;
        .title {
          color: #666;
          font-size: 14px;
        }
      }
      .right {
        width: 85%;
        padding: 15px 0;
        // border-left: 1px solid #e5e5e5;
        .comment {
          padding: 0 15px 0 0;
        }
        .standard {
          padding: 0 15px 10px 0;
          display: flex;
          .standard-content {
            flex: 1;
            /deep/ .el-table--medium th {
              padding: 0;
            }
            /deep/ .el-table .el-table__header-wrapper th {
              height: inherit;
              background: none;
            }
          }
        }
        label {
          color: #333;
          font-size: 14px;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
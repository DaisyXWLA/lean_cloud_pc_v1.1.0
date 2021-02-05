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
          placeholder="请选择状态"
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
      <el-table-column label="序号" type="index" width="80">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
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
            <div class="content-title">
              <el-tooltip
                class="item"
                effect="dark"
                :content="form.title"
                placement="top-start"
              >
                <el-button>{{ form.title }}</el-button>
              </el-tooltip>
            </div>
            <div class="box">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="创建人">{{
                    form.realName
                  }}</el-form-item>
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
                  <el-form-item label="类别">{{ form.typeName }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区域" class="border-left">
                    <span>{{ form.areaName }}</span>
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
                  <el-form-item
                    label="创建时间"
                    prop="code"
                    class="border-left"
                  >
                    {{ form.createTime }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="box">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="现状描述">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="form.state"
                      placement="top-start"
                    >
                      <el-button>{{ form.state }}</el-button>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="期望建议">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="form.proposal"
                      placement="top-start"
                    >
                      <el-button>{{ form.proposal }}</el-button>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="accessory">
                <el-col :span="24">
                  <el-form-item label="改善前图片">
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
              <div v-if="form.auditStatus > 2">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="改善效果说明">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="form.state"
                        placement="top-start"
                      >
                        <el-button>{{ form.state }}</el-button>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="accessory">
                  <el-col :span="24">
                    <el-form-item label="改善后图片">
                      <div class="img">
                        <el-image v-if="improveImages.length == 0" fit="cover">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                        <el-image
                          v-for="(item, index) in improveImages"
                          :key="index"
                          :src="baseURL + item"
                          :preview-src-list="[baseURL + item]"
                          fit="cover"
                        ></el-image>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="改善效果" v-if="form.profit != null">
                      收益{{ form.profit }}元
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>
          <div class="box">
            <el-collapse accordion>
              <el-collapse-item title="提案处理状态记录">
                <div class="process">
                  <div
                    class="process-content"
                    v-for="(item, index) in form.flowProcessList"
                    :key="index"
                  >
                    <div class="left">
                      <i
                        v-if="
                          item.doneStatus == 2 &&
                          item.name.indexOf('撤销') == -1
                        "
                        class="el-icon-error refuse"
                      ></i>
                      <i
                        v-else-if="
                          item.doneStatus == 2 &&
                          item.name.indexOf('撤销') != -1
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
                      <span><label></label>{{ item.acceptName }}，</span>
                      <span
                        v-if="
                          index == form.flowProcessList.length - 1 &&
                          item.name.indexOf('通过') == -1 &&
                          item.name.indexOf('撤销') == -1
                        "
                        ><label>已等待</label>{{ waitTime(processTime) }}</span
                      >
                      <span
                        v-else-if="
                          (index == form.flowProcessList.length - 1 &&
                            item.name.indexOf('通过') != -1) ||
                          (index == form.flowProcessList.length - 1 &&
                            item.name.indexOf('撤销') != -1)
                        "
                        ><label>操作时间：</label>{{ item.doneTime
                        }}<i v-if="index >= 1">，</i></span
                      >
                      <span v-else
                        ><label>操作时间：</label>{{ item.acceptTime
                        }}<i v-if="index >= 1">，</i></span
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
                            元，</label
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
                            >提案奖励{{
                              contentFormat(item.content).integral
                            }}，</label
                          >
                          <label
                            class="steps-content"
                            v-else-if="item.name.indexOf('验收') != -1"
                            >落实奖励{{
                              contentFormat(item.content).integral
                            }}，</label
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
                            }}，</label
                          >
                        </span>
                        <span>
                          <label class="steps-content"
                            >描述：{{
                              contentFormat(item.content).content
                            }}</label
                          >
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="box" v-if="gradingResults.length > 0">
            <div
              class="title"
              style="
                border-bottom: 1px solid #e5e5e5;
                border-top: 1px solid #e5e5e5;
              "
            >
              提案评审记录
            </div>
            <div
              class="check-process"
              v-for="item in gradingResults"
              :key="item.id"
            >
              <div class="left">
                <i class="el-icon-success complete" v-if="item.status == 1"></i>
                <i
                  class="el-icon-remove pending"
                  v-else-if="item.status == 2"
                ></i>
                <span class="title" v-if="item.stage == 1">提案一审</span
                ><span class="title" v-if="item.stage == 2">提案二审</span>
              </div>
              <div class="right">
                <div class="status">
                  <label style="white-space: nowrap">评审状态：</label
                  ><span v-if="item.status == 1">已评审，</span
                  ><span v-if="item.status == 2">未评审</span>
                </div>
                <div class="standard" v-if="item.status == 1">
                  <label style="white-space: nowrap">得分：</label>
                  <span class="standard-content">{{ item.score }} 分</span>
                  <span
                    style="color: #1890ff; cursor: pointer; padding-left: 10px"
                    @click="scoreDetail(item.id)"
                    >查看积分详情</span
                  ><i>，</i>
                </div>
                <div class="comment" v-if="item.status == 1">
                  <label>评审意见：</label>{{ item.remark }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      title="积分详情"
      :visible.sync="dialogOpen"
      append-to-body
      width="1100px"
    >
      <div class="standard-box">
        <div v-for="(item, index) in standardList" :key="index">
          <el-table
            ref="table"
            v-loading="loading"
            :data="item.data"
            :cell-style="tableCellStyle"
            :border="true"
          >
            <el-table-column
              align="center"
              prop="name"
              label="分值"
              class="lable"
              width="180"
            />
            <el-table-column
              v-for="(column, index) in item.header"
              :key="column.key"
              :prop="column.key"
              :label="column.label"
              align="center"
            >
              <template slot-scope="scope"
                ><span
                  v-if="index < item.header.length"
                  style="display: block; padding: 10px; text-align: left"
                  >{{ scope.row.options[index].title }}</span
                ></template
              >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  proposalList,
  getDetail,
  getType,
  getStandard,
  getCheckResult,
} from "@/api/proposal/proposal";
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
      dialogOpen: false,
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
      improveImages: [],
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
      //评审记录
      gradingResults: [],
      //评分标准列表
      standardList: [],
      selectedIds: [],
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
    /** 查看详情按钮操作 */
    handleDetail(row) {
      this.open = true;
      this.title = "合理化建议详情";
      getDetail(row.id).then((res) => {
        // console.log(res);
        if (res.status == "SUCCESS") {
          this.form = res.obj;
          this.gradingResults = res.obj.gradingResults;
          if (res.obj.pictures != "[]" && res.obj.pictures != null) {
            this.pictures = res.obj.pictures.split(";");
          }
          if (res.obj.improveImages != "[]" && res.obj.improveImages != null) {
            this.improveImages = res.obj.improveImages.split(";");
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
    //查看评分详情
    scoreDetail(id) {
      // this.$router.push({ path: `/proposalManage/scoreDetail/${id}` });
      this.dialogOpen = true;
      this.loading=true;
      this.selectedIds=[]
      //获取评审结果
      getCheckResult(id).then((res) => {
        if (res.status == "SUCCESS") {
          for (let i = 0; i < res.obj.scoreDetails.length; i++) {
            this.selectedIds.push(res.obj.scoreDetails[i].standardId);
          }
          this.queryParams.worksType = res.obj.worksType;
          this.queryParams.id = res.obj.gradingId;
          getStandard(this.queryParams).then((res) => {
            if (res.status == "SUCCESS") {
              this.loading=false;
              this.standardList = res.obj;
              let datas = [];
              for (let i = 0; i < res.obj.length; i++) {
                datas.push(res.obj[i].data);
              }
              for (let i = 0; i < datas.length; i++) {
                for (let j = 0; j < datas[i].length; j++) {
                  for (let k = 0; k < datas[i][j].options.length; k++) {
                    for (let l = 0; l < this.selectedIds.length; l++) {
                      if (this.selectedIds[l] == datas[i][j].options[k].id) {
                        datas[i][j].options[k].flag = true;
                      }
                    }
                  }
                }
              }
            }else{
              this.loading=false
            }
          });
        }
      });
    },
    tableCellStyle(obj) {
      if (
        obj.columnIndex == 0 ||
        obj.columnIndex == obj.row.options.length + 1
      ) {
        return;
      } else {
        if (
          obj.columnIndex > 0 &&
          obj.columnIndex < obj.row.options.length + 1
        ) {
          if (obj.row.options[obj.columnIndex - 1].flag) {
            return "background-color:#1890ff;color:#fff";
          }
        }
        return "background-color:#fff;";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 28px;
}
/deep/ .el-form-item--medium .el-form-item__label {
  line-height: 28px;
}
/deep/ .el-table {
  border: 1px solid #f2f2f2;
  border-bottom: none;
}
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
// /deep/ .el-dialog__title {
//   color: #fff;
// }
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
  padding: 0 20px;
  margin: 10px 0 20px;
  .content {
    .content-title {
      /deep/ .el-button {
        border: none;
        background: none;
        cursor: inherit;
        color: #666;
        padding: 10px 20px 0;
        font-weight: 700;
        font-size: 15px;
        &:hover {
          color: #666;
          background: none;
        }
      }
    }
    .box {
      border: 1px solid #e5e5e5;
      border-top: none;
      background: #fff;
      margin: 15px 0;
      /deep/ .el-form-item__label {
        font-size: 12px;
      }
      /deep/ .el-button {
        padding: 0;
        border: none;
        cursor: inherit;
        color: inherit;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        &:hover {
          color: inherit;
          background: none;
        }
      }
      /deep/ .el-collapse {
        border-bottom: none;
      }
      /deep/ .el-collapse-item__header {
        height: 38px;
        line-height: 38px;
        padding: 0 15px;
        font-size: 14px;
        color: #666;
        font-weight: bold;
      }
      /deep/ .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    .title {
      font-size: 14px;
      color: #666;
      padding: 10px 15px;
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
      margin-right: 20px;
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
        line-height: 65px;
      }
    }
    .process {
      border-top: 1px solid #e5e5e5;
      .process-content {
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .left {
          width: 17%;
          display: flex;
          align-items: center;
          border-right: 1px solid #e5e5e5;
          padding: 0 15px;
          .title {
            color: #999;
            font-size: 12px;
            padding: 5px 0 5px 5px;
          }

          .refuse {
            font-size: 14px;
            color: #fe6e69;
          }

          .pending {
            font-size: 14px;
            color: #fdb205;
          }

          .transfer {
            font-size: 14px;
            color: #539cf8;
          }

          .complete {
            font-size: 14px;
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
          width: 83%;
          padding: 5px 15px;
          label {
            font-weight: normal;
          }
          span {
            // display: block;
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
      border-bottom: 1px solid #e5e5e5;
      .left {
        width: 14%;
        padding: 5px 15px;
        text-align: left;
        .complete {
          font-size: 14px;
          color: #2db755;
        }
        .pending {
          font-size: 14px;
          color: #fdb205;
        }
        .title {
          color: #999;
          font-size: 12px;
          padding: 5px 0 5px 5px;
        }
      }
      .right {
        width: 86%;
        padding: 5px 15px;
        border-left: 1px solid #e5e5e5;
        .status {
          display: inline-block;
        }
        .comment {
          padding: 0 15px 0 0;
          display: inline-block;
        }
        .standard {
          padding-right: 5px;
          display: inline-block;
          .standard-content {
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
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
.standard-box {
  /deep/ .el-table--medium th {
    padding: 0;
  }
  /deep/ .el-table .cell {
    padding: 0;
    line-height: 18px;
    span {
      padding: 0 !important;
      text-align: center !important;
      font-size: 12px;
    }
  }
  /deep/ .el-table--border td:first-child .cell {
    font-weight: bold;
    font-size: 12px;
  }
  //表头字体大小
  /deep/ .el-table .el-table__header-wrapper th {
    font-size: 14px;
    height: 32px;
  }
  /deep/ .el-input__inner {
    border: 1px solid #dcdfe6 !important;
  }
  //改变经过高亮
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  .value {
    margin: 10px 0;
  }
  /deep/ .el-button {
    margin-bottom: 14px;
  }
}
/deep/ .el-table td{
  padding: 5px;
}
</style>
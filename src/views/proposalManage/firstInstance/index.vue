<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-row>
        <el-col :span="3.5">
          <el-form-item label="提案标题" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入提案标题"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3.5">
          <el-form-item label="提案人" prop="launchUser">
            <el-input
              v-model="queryParams.launchUser"
              placeholder="请输入提案人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3.5">
          <el-form-item label="落实人" prop="finishUser">
            <el-input
              v-model="queryParams.finishUser"
              placeholder="请输入落实人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3.5">
          <el-form-item label="验收起止时间">
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
        </el-col>
        <el-col :span="3.5"
          ><el-form-item>
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
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="20">
        <el-form
          :model="queryParams"
          ref="queryForm"
          v-show="showSearch"
          :inline="true"
        >
          <el-form-item
            label="评审状态"
            prop="gradingStatus"
            style="margin-bottom: 10px"
          >
            <el-radio-group
              v-model="unchecked"
              @change="selectRadio"
              size="small"
            >
              <el-radio-button label="未评审"></el-radio-button>
              <el-radio-button label="已评审"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="proposalList"
      @row-click="handleCheck"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column
        label="提案标题"
        prop="title"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="提案人" prop="realName" align="center" />
      <el-table-column label="落实人" prop="staffUserName" align="center" />
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        :formatter="formatTime"
      />
      <el-table-column
        label="验收时间"
        prop="checkTime"
        align="center"
        :formatter="formatTime"
      />
      <!-- <el-table-column
        label="评审状态"
        prop="gradingStatus"
        align="center"
        :formatter="formatStatus"
      /> -->
      <el-table-column label="评审状态" align="center"
        ><template slot-scope="scope"
          ><span v-if="scope.row.resultStatus == 2" style="color: #f19066"
            >未评审</span
          ><span v-else style="color: #2db755">已评审</span></template
        ></el-table-column
      >
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.resultStatus == 2"
            size="mini"
            type="text"
            icon="el-icon-s-check"
            @click="handleCheck(scope.row)"
            v-hasPermi="['system:role:edit']"
            >审核</el-button
          >
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleCheck(scope.row)"
            v-hasPermi="['system:role:edit']"
            >查看</el-button
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
    <el-drawer :title="title" :visible.sync="open" size="45%">
      <!-- <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="20">
                <span>{{ title }}</span>
              </el-col>
              <el-col :span="2">
                <el-button icon="el-icon-edit-outline" @click="grade"
                  >评分</el-button
                >
              </el-col>
              <el-col :span="2">
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
      </div> -->
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
                    <span style="color: #2db755" v-if="form.auditStatus == 5"
                      >验收通过</span
                    >
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
                          ><label>已等待：</label
                          >{{ waitTime(processTime) }}</span
                        >
                        <span
                          v-else-if="
                            (index == form.flowProcessList.length - 1 &&
                              item.name.indexOf('通过') != -1) ||
                            (index == form.flowProcessList.length - 1 &&
                              item.name.indexOf('撤销') != -1)
                          "
                          ><label>操作时间：</label
                          >{{ processTimeFormat(item.doneTime)
                          }}<i v-if="index >= 1">，</i></span
                        >
                        <span v-else
                          ><label>操作时间：</label
                          >{{ processTimeFormat(item.acceptTime)
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
                              v-if="
                                contentFormat(item.content).finishTime == ''
                              "
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

            <div
              class="box"
              v-if="gradingResults.length == 1 && gradingResults[0].status == 2"
            >
              <div class="title check-btn">
                <span>提案评审</span
                ><el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="grade"
                  >一审打分</el-button
                >
              </div>
            </div>
            <div class="box" v-else>
              <div class="title" style="border-bottom: 1px solid #e5e5e5">
                提案评审记录
              </div>
              <div
                class="check-process"
                v-for="item in gradingResults"
                :key="item.id"
              >
                <div class="left">
                  <i
                    class="el-icon-success complete"
                    v-if="item.status == 1"
                  ></i>
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
                      style="
                        color: #1890ff;
                        cursor: pointer;
                        padding-left: 10px;
                      "
                      @click="scoreList(item.id)"
                      >查看得分详情</span
                    ><i>，</i>
                  </div>
                  <div class="comment" v-if="item.status == 1">
                    <label>评审意见：</label>{{ item.remark }}
                  </div>
                </div>
              </div>
            </div>
          </el-form>
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
    <el-dialog
      title="评分标准"
      :visible.sync="standardOpen"
      append-to-body
      width="1100px"
    >
      <div class="standard-box standard-score-box">
        <div v-for="(item, index) in scoreStandardList" :key="index">
          <el-table
            ref="table"
            v-loading="loading"
            :data="item.data"
            :cell-style="standardTableCellStyle"
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
              :width="column.key == '得分' ? '100' : ''"
            >
              <template slot-scope="scope"
                ><span
                  @click="
                    cellClick(
                      scope.row,
                      scope.row.options[index].id,
                      scope.row.options[index].value
                    )
                  "
                  v-if="index < item.header.length - 1"
                  style="display: block; padding: 10px"
                  >{{ scope.row.options[index].title }}</span
                >
                <span v-else
                  ><el-input
                    class="value"
                    v-model="scope.row.value"
                    readonly
                    style="width: 80px"
                  ></el-input></span
              ></template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="standardCancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提交评审"
      :visible.sync="submitOpen"
      :close-on-click-modal="false"
      append-to-body
      width="600px"
    >
      <el-form
        ref="form"
        :model="standardForm"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item prop="remark" label="已选总分">
          <div class="score">
            <span style="padding-left: 15px">{{ score }} 分</span>
            <span style="font-size:14px;color:#999;" v-if="score >= standardScore"
              >（注：该提案累计积分达到二审标准，将提交二审）</span
            >
          </div>
        </el-form-item>
        <el-form-item
          label="发起人积分"
          prop="launchScore"
          v-if="score < standardScore"
        >
          <div class="distribute">
            <el-input
              v-model="standardForm.launchScore"
              placeholder="请输入分配给发起人的积分"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="落实人积分"
          prop="finishScore"
          v-if="score < standardScore"
        >
          <div class="distribute">
            <el-input
              v-model="standardForm.finishScore"
              placeholder="请输入分配给落实人的积分"
            />
          </div>
        </el-form-item>
        <el-form-item prop="remark" label="评审意见">
          <el-input
            type="textarea"
            v-model="standardForm.remark"
            placeholder="请输入评审意见"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCheckList,
  getDetail,
  getStandard,
  getCheckResult,
  submitGrade,
} from "@/api/proposal/proposal";
import pic from "@/assets/401_images/401.gif";
export default {
  data() {
    return {
      //查询时间
      time: null,
      checked: "已评审",
      unchecked: "未评审",
      normalPlain: false,
      disablePlain: true,
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
      proposalList: [],
      improveImages: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dialogOpen: false,
      standardOpen: false,
      submitOpen: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        title: undefined,
        launchUser: undefined,
        finishUser: undefined,
        // auditStatus: 5,
        gradingStatus: 2,
        gradingStage: 1,
        checkBeginCreateTime: undefined,
        checkEndCreateTime: undefined,
      },
      categoryOptions: [],
      statusOptions: [
        { value: "1", title: "已评审" },
        { value: "2", title: "未评审" },
      ],
      // 表单参数
      form: {},
      //上传图片
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      baseURL: "",
      picUrl: pic,
      processList: [],
      pictures: [],
      processTime: "",
      contentObj: {},
      id: "",
      resultId: "",
      gradingResults: [],
      //评分标准列表
      standardList: [],
      selectedIds: [],
      //评分标准弹窗
      scoreStandardList: [],
      standardForm: {},
      // 表单校验
      rules: {
        launchScore: [
          { required: true, message: "发起人积分不能为空", trigger: "blur" },
        ],
        finishScore: [
          { required: true, message: "落实人积分不能为空", trigger: "blur" },
        ],
      },
      scoreDetails: [],
      standardQueryParams: { current: 1, size: 10 },
      gradingId: "",
      //选择的总分
      score: "",
      //发起人积分
      launchScore: "",
      //落实人积分
      finishScore: "",
      selectedDatas: [],
      checkFlag: "",
      standardScore: "",
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.baseURL = process.env.VUE_APP_BASE_API;
  },
  methods: {
    selectRadio(label) {
      if (label == "未评审") {
        this.queryParams.gradingStatus = 2;
        this.getList();
      } else {
        this.queryParams.gradingStatus = 1;
        this.getList();
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = false;
      if (this.time != null) {
        this.queryParams.checkBeginCreateTime = this.time[0];
        this.queryParams.checkEndCreateTime = this.time[1];
      }
      getCheckList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.proposalList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.msgError(res.message);
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
      this.queryParams.pages = 1;
      this.queryParams.checkBeginCreateTime = undefined;
      this.queryParams.checkEndCreateTime = undefined;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.time = undefined;
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
    /** 审核 */
    handleCheck(row) {
      this.open = true;
      this.title = "提案评审";
      this.id = row.id;
      this.resultId = row.resultId;
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
    scoreList(id) {
      // this.$router.push({
      //   path: `/proposalManage/scoreDetail/${id}`,
      // });
      this.dialogOpen = true;
      this.loading = true;
      this.selectedIds = [];
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
              this.loading = false;
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
            } else {
              this.loading = false;
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
    //评分
    grade() {
      // this.$router.push({
      //   path: `/proposalManage/scoreList/${this.id}/${this.resultId}`,
      // });
      this.standardOpen = true;
      //获取评审结果
      getCheckResult(this.resultId).then((resSecond) => {
        if (resSecond.status == "SUCCESS") {
          this.checkFlag = resSecond.obj.pid;
          this.standardQueryParams.worksType = resSecond.obj.worksType;
          if (resSecond.obj.pid != 0) {
            getCheckResult(resSecond.obj.pid).then((resFirst) => {
              this.selectedDatas = resFirst.obj.scoreDetails.map((item) => {
                return {
                  parentId: item.dimensionId,
                  id: item.standardId,
                  score: item.score,
                };
              });
              // console.log(resFirst.obj.scoreDetails)
              this.standardQueryParams.worksType = resSecond.obj.worksType;
              this.standardQueryParams.id = resSecond.obj.gradingId;
              getStandard(this.standardQueryParams).then((resStandard) => {
                if (resStandard.status == "SUCCESS") {
                  // console.log(resStandard);
                  if (resStandard.obj.length > 0) {
                    this.gradingId = resStandard.obj[0].data[0].gradingId;
                    for (let i = 0; i < resStandard.obj.length; i++) {
                      resStandard.obj[i].header.push({
                        label: "得分",
                        key: "得分",
                      });

                      for (let j = 0; j < this.selectedDatas.length; j++) {
                        for (
                          let k = 0;
                          k < resStandard.obj[i].data.length;
                          k++
                        ) {
                          if (
                            this.selectedDatas[j].parentId ==
                            resStandard.obj[i].data[k].id
                          ) {
                            resStandard.obj[i].data[
                              k
                            ].selectedId = this.selectedDatas[j].id;
                            resStandard.obj[i].data[
                              k
                            ].value = this.selectedDatas[j].score;
                          }
                        }
                      }
                    }
                  }
                  this.scoreStandardList = resStandard.obj;
                }
              });
            });
          } else {
            this.standardQueryParams.worksType = resSecond.obj.worksType;
            getStandard(this.standardQueryParams).then((resStandard) => {
              if (resStandard.status == "SUCCESS") {
                if (resStandard.obj.length > 0) {
                  this.gradingId = resStandard.obj[0].data[0].gradingId;
                  //达到二审标准
                  this.standardScore = resStandard.obj[0].data[0].standardScore;
                  for (let i = 0; i < resStandard.obj.length; i++) {
                    resStandard.obj[i].header.push({
                      label: "得分",
                      key: "得分",
                    });
                  }
                }
                this.scoreStandardList = resStandard.obj;
              }
            });
          }
        }
      });
    },
    //点击的单元格改变样式
    cellClick(row, id, value) {
      row.selectedId = id;
      row.value = value;
    },
    standardTableCellStyle(obj) {
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
          if (obj.row.selectedId == obj.row.options[obj.columnIndex - 1].id) {
            return "background-color:#1890ff;color:#fff";
          }
        }
        return "background-color:#fff;";
      }
    },
    //评分标准
    save() {
      let dataArr = [];
      let ids = [];
      let scoreArr = [];
      for (let i = 0; i < this.scoreStandardList.length; i++) {
        dataArr.push(this.scoreStandardList[i].data);
      }
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = 0; j < dataArr[i].length; j++) {
          ids.push(dataArr[i][j].selectedId);
          scoreArr.push(dataArr[i][j].value);
        }
      }
      if (scoreArr.some((item) => item == undefined)) {
        this.msgError("每个维度必选一项!");
        return;
      } else {
        this.score = this.sum(scoreArr);
        if (this.score < this.standardScore) {
          this.$set(this.standardForm, "launchScore", this.score);
          this.$set(this.standardForm, "finishScore", 0);
        }
      }
      this.submitOpen = true;
      this.scoreDetails = ids.map((item) => {
        return { standardId: item };
      });
    },
    submitForm() {
      if (this.score < this.standardScore) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (
              parseInt(this.standardForm.launchScore) +
                parseInt(this.standardForm.finishScore) !=
              this.score
            ) {
              this.msgError(
                "发起人积分与落实人积分总和不等于已选总积分，请核对后重试！"
              );
              return;
            }
            this.standardForm.scoreDetails = this.scoreDetails;
            this.standardForm.gradingId = this.gradingId;
            this.standardForm.id = this.resultId;
            // console.log(this.standardForm);
            submitGrade(this.standardForm).then((res) => {
              if (res.status == "SUCCESS") {
                console.log(res);
                this.msgSuccess("评审成功！");
                this.getList();
                this.submitOpen = false;
                this.standardOpen = false;
                if (this.checkFlag == 0) {
                  this.$router.push({ path: "/proposalManage/firstInstance" });
                } else {
                  this.$router.push({ path: "/proposalManage/secondInstance" });
                }
              } else {
                this.msgError(res.message);
                this.submitOpen = false;
                this.standardOpen = false;
                this.getList();
                this.scoreDetails = [];
              }
            });
          }
        });
      } else {
        this.standardForm.scoreDetails = this.scoreDetails;
        this.standardForm.gradingId = this.gradingId;
        this.standardForm.id = this.resultId;
        submitGrade(this.standardForm).then((res) => {
              if (res.status == "SUCCESS") {
                console.log(res);
                this.msgSuccess("评审成功！");
                this.getList();
                this.submitOpen = false;
                this.standardOpen = false;
                if (this.checkFlag == 0) {
                  this.$router.push({ path: "/proposalManage/firstInstance" });
                } else {
                  this.$router.push({ path: "/proposalManage/secondInstance" });
                }
              } else {
                this.msgError(res.message);
                this.submitOpen = false;
                this.standardOpen = false;
                this.getList();
                this.scoreDetails = [];
              }
            });
      }

      // console.log(this.form)
    },
    standardCancel() {
      this.standardOpen = false;
    },
    //数组求和
    sum(arr) {
      return eval(arr.join("+"));
    },
    //获取分配给发起人的积分
    getLaunchScore(value) {
      // console.log(value);
      this.launchScore = value;
    },
    //获取分配给落实人的积分
    getFinishScore(value) {
      this.finishScore = value;
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
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
/deep/ .el-drawer {
  background: #f9f9f9;
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
    .check-btn {
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      /deep/ .el-button {
        width: inherit;
        color: #fff;
        background: #1890ff;
        padding: 8px 12px;
        &:hover {
          color: #fff;
          background: #46a6ff;
        }
      }
      span {
        margin-right: 20px;
      }
    }
  }
}
/deep/ .el-button {
  padding: 8px 10px;
}
/deep/ .el-button + .el-button {
  margin-left: 5px;
}
/deep/ .el-form--inline .el-form-item {
  margin-right: 4px;
}
/deep/ .el-form-item__label {
  padding-right: 5px;
}
.standard-box {
  /deep/ .el-table--medium th {
    padding: 0;
  }
  /deep/ .el-table .cell {
    padding: 0;
    line-height: 18px;
    cursor: pointer;
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
    margin: 0;
  }
  /deep/ .el-button {
    margin-bottom: 14px;
  }
}

.standard-score-box {
  /deep/ .el-table td {
    &:last-child {
      width: 90px;
    }
  }
  .distribute {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
/deep/ .el-table td {
  padding: 5px;
}
/deep/ .el-input--medium .el-input__inner {
  height: 28px;
  line-height: 28px;
}
</style>
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="看板名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入看板名称"
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
      </el-form-item>
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
            label="看板状态"
            prop="status"
            style="margin-bottom: 10px"
          >
            <el-button-group>
              <el-button
                ref="normal"
                type="primary"
                size="mini"
                :plain="normalPlain"
                @click="searchNormal"
                >正常</el-button
              >
              <el-button
                ref="disable"
                type="primary"
                size="mini"
                :plain="disablePlain"
                @click="searchDisable"
                >停用</el-button
              >
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
          >创建看板</el-button
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
          >批量删除</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>
    <el-table
      v-loading="loading"
      :data="boardList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column
        label="看板名称"
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="按键组" prop="buttonTeamName" align="center" />
      <el-table-column label="区域" prop="areaName" align="center" />
      <el-table-column label="密码" prop="password" align="center" />
      <el-table-column label="链接" prop="link" align="center" class="link">
        <template slot-scope="scope">
          <a id="copyLink" href="javascript:;" @click="copy(scope.row.id)">{{
            scope.row.link
          }}</a>
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status==2"
            size="mini"
            type="text"
            icon="el-icon-folder-add"
            @click="handleUse(scope.row)"
            >启用</el-button
          >
          <el-button
          v-if="scope.row.status==1"
            size="mini"
            type="text"
            icon="el-icon-folder-remove"
            @click="handleForbidden(scope.row)"
            >禁用</el-button
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
    <el-drawer :title="title" :visible.sync="open" size="40%">
      <div>
        <div class="content">
          <el-form ref="form" :model="form" :rules="rules" label-width="125px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="看板名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入看板名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="按键组" prop="screenBts">
                  <el-select
                    v-model="screenBts"
                    placeholder="请选择按键组"
                    style="width: 100%"
                    @change="selectButtonGroup"
                  >
                    <el-option
                      v-for="item in buttonGroupOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="触发时间范围" prop="dateRange">
                  <el-select
                    v-model="form.dateRange"
                    placeholder="请选择按时间范围"
                    clearable
                    size="small"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="type in timeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="访问密码" prop="password">
                  <el-input
                    v-model="form.password"
                    placeholder="请输入看板访问密码"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="字号设置" prop="fontSize">
                  <el-select
                    v-model="form.fontSize"
                    placeholder="请选择看板字体大小"
                    clearable
                    size="small"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="type in fontSizeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.value"
                      >{{ item.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="数据排序类型" prop="sortType">
                  <el-select
                    v-model="form.sortType"
                    placeholder="请选择看板数据排序类型"
                    clearable
                    size="small"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="type in sortTypeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="数据刷新间隔" prop="refreshTime">
                  <el-select
                    v-model="form.refreshTime"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入看板数据刷新间隔时间（秒）"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in refreshTimeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择展示字段" prop="screenColumns">
                  <el-checkbox-group
                    v-model="checkList"
                    @change="handleCheckedColumnsChange"
                  >
                    <el-checkbox
                      v-for="item in columnsOptions"
                      :key="item.value"
                      :label="item.label"
                      :disabled="item.disabled"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="footer">
            <el-row>
              <el-col :span="24">
                <el-button
                  size="medium"
                  type="primary"
                  @click="submitForm()"
                  :loading="loading"
                  >{{ loading ? "提交中 ..." : "确 定" }}</el-button
                >
                <el-button @click="cancel" size="medium">取 消</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      title="生成现场看板链接"
      :visible.sync="linkDialog"
      width="500px"
      append-to-body
    >
      <div class="container">
        <div>
          <label>当前连接为：</label><el-input :value="link"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linkDialogConfirm">确 定</el-button>
        <el-button @click="linkDialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  boardList,
  getButtonGroup,
  addBoard,
  getBoard,
  getColumns,
  deleteBoard,
  userBoard,
  forbiddenBoard
} from "@/api/abnormal/boardManage";
import { getTreeList } from "@/api/system/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
//复制链接js
import ClipboardJS from "clipboard";
export default {
  components: { Treeselect },
  data() {
    return {
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
      boardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //生成链接弹出层
      linkDialog: false,
      //生成的链接
      link: "",
      //按键组下拉选项
      buttonGroupOptions: [],
      //选择的字段
      screenColumns: [],
      //区域下拉选项
      areaOptions: [],
      //时间范围下拉选项
      timeOptions: [
        {
          value: "86400",
          label: "24小时",
        },
        {
          value: "129600",
          label: "36小时",
        },
        {
          value: "172800",
          label: "48小时",
        },
        {
          value: "604800",
          label: "7天",
        },
        {
          value: "1260000",
          label: "14天",
        },
        {
          value: "2592000",
          label: "30天",
        },
        {
          value: "0",
          label: "永久",
        },
      ],
      //刷新间隔时间
      refreshTimeOptions: [
        {
          value: "5",
          label: "5",
        },
        {
          value: "10",
          label: "10",
        },
        {
          value: "15",
          label: "15",
        },
      ],
      //字体大小下拉选项
      fontSizeOptions: [
        {
          value: "32",
          label: "大",
        },
        {
          value: "28",
          label: "中",
        },
        {
          value: "24",
          label: "小",
        },
      ],
      //状态下拉选项
      statusOptions: [
        {
          value: "1",
          label: "正常",
        },
        {
          value: "2",
          label: "停用",
        },
      ],
      sortType: "",
      //看板排序类型
      sortTypeOptions: [
        {
          value: "1",
          label: "发起时间倒序",
        },
        {
          value: "2",
          label: "发起时间正序",
        },
        {
          value: "3",
          label: "重要程度倒序",
        },
        {
          value: "4",
          label: "重要程度正序",
        },
      ],
      //上级区域校验样式
      borderColor: "",
      //复选框
      checkList: [],
      checkArr: [],
      //字段下拉选项
      columnsOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // screenBts: [],
      screenBts: "",
      // 表单校验
      rules: {
        name: [
          { required: true, message: "看板名称不能为空", trigger: "blur" },
        ],
        screenBts: [
          { required: true, message: "请选择按键组", trigger: "change" },
        ],
        areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
        dateRange: [
          {
            required: true,
            message: "请选择异常事件触发时间范围",
            trigger: "change",
          },
        ],
        fontSize: [
          {
            required: true,
            message: "请选择看板展示字体大小",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择看板状态",
            trigger: "change",
          },
        ],
        sortType: [
          {
            required: true,
            message: "请选择看板数据排序类型",
            trigger: "change",
          },
        ],
        refreshTime: [
          {
            required: true,
            message: "请选择看板数据刷新间隔时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.queryParams.status = 1;
    this.getList();
  },
  methods: {
    //查询正常使用看板
    searchNormal() {
      this.normalPlain = false;
      this.disablePlain = true;
      this.queryParams.status = 1;
      this.getList();
    },
    //查询停用看板
    searchDisable() {
      this.normalPlain = true;
      this.disablePlain = false;
      this.queryParams.status = 2;
      this.getList();
    },
    getList() {
      this.loading = true;
      boardList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          for (let i = 0; i < res.obj.records.length; i++) {
            res.obj.records[i].link = "复制链接";
          }
          // console.log(res.obj.records);
          this.boardList = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.msgError("获取看板列表数据失败，请重试！");
        }
      });
      //获取看板展示字段
      getColumns().then((res) => {
        if (res.status == "SUCCESS") {
          this.columnsOptions = res.obj.map((item) => {
            return {
              label: item.columnDesc,
              value: item.columnName,
              disabled: false,
            };
          });
          this.columnsOptions.forEach((item) => {
            if (item.value == "buttonName") {
              item.disabled = true;
              this.checkArr.push(item);
            }
            if (
              item.value == "id" ||
              item.value == "createTime" ||
              item.value == "buttonTypeName" ||
              item.value == "createUserName" ||
              item.value == "status"
            ) {
              this.checkArr.push(item);
            }
          });
          // console.log(this.checkArr)

          this.checkArr.forEach((item) => {
            this.checkList.push(item.label);
          });
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pages = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {};
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      // this.screenBts = [];
      this.screenBts = "";
      this.form = {
        status: "1",
      };
      this.resetForm("form");
    },
    //启用
    handleUse(row){
      userBoard(row.id).then(res=>{
        if(res.status=='SUCCESS'){
          this.msgSuccess('启用看板成功！')
          this.getList()
        }else{
          this.msgError('启用看板失败，请重试！')
        }
      })
    },
    //禁用
    handleForbidden(row){
      forbiddenBoard(row.id).then(res=>{
        if(res.status=='SUCCESS'){
          this.msgSuccess('禁用看板成功！')
          this.getList()
        }else{
          this.msgError('禁用看板失败，请重试！')
        }
      })
    },
    handleAdd() {
      this.borderColor = "";
      this.reset();
      this.open = true;
      this.title = "新增异常事件现场看板配置";
      //获取按键组
      getButtonGroup().then((res) => {
        if (res.status == "SUCCESS") {
          this.buttonGroupOptions = res.obj;
        }
      });
      //获取看板展示字段
      getColumns().then((res) => {
        if (res.status == "SUCCESS") {
          this.columnsOptions = res.obj.map((item) => {
            return {
              label: item.columnDesc,
              value: item.columnName,
              disabled: false,
            };
          });
          this.columnsOptions.forEach((item) => {
            if (item.value == "buttonName") {
              item.disabled = true;
              this.checkArr.push(item);
            }
            if (
              item.value == "id" ||
              item.value == "createTime" ||
              item.value == "buttonTypeName" ||
              item.value == "createUserName" ||
              item.value == "status"
            ) {
              this.checkArr.push(item);
            }
          });
          // console.log(this.checkArr)

          this.checkArr.forEach((item) => {
            this.checkList.push(item.label);
          });
        }
      });
    },
    handleUpdate(row) {
      this.borderColor = "";
      this.reset();
      const id = row.id || this.ids;
      this.open = true;
      this.title = "修改异常事件现场看板配置";
      this.checkList = [];
      getBoard(id).then((res) => {
        if (res.status == "SUCCESS") {
          delete res.obj.areaName;
          this.form = res.obj;
          console.log(this.form);
          this.form.status = res.obj.status.toString();
          // 多选
          // this.screenBts = res.obj.screenBts.map((item) => {
          //   return item.btId;
          // });
          //单选
          this.screenBts = res.obj.screenBts[0].btId;
          if (res.obj.dateRange == 86400) {
            res.obj.dateRange = "24小时";
          } else if (res.obj.dateRange == 129600) {
            res.obj.dateRange = "36小时";
          } else if (res.obj.dateRange == 172800) {
            res.obj.dateRange = "48小时";
          } else if (res.obj.dateRange == 604800) {
            res.obj.dateRange = "7天";
          } else if (res.obj.dateRange == 1260000) {
            res.obj.dateRange = "14天";
          } else if (res.obj.dateRange == 2592000) {
            res.obj.dateRange = "30天";
          } else if (res.obj.dateRange == 0) {
            res.obj.dateRange = "永久";
          }
          if (res.obj.sortType == 1) {
            res.obj.sortType = "发起时间倒序";
          } else if (res.obj.sortType == 2) {
            res.obj.sortType = "发起时间正序";
          } else if (res.obj.sortType == 3) {
            res.obj.sortType = "重要程度倒序";
          } else if (res.obj.sortType == 4) {
            res.obj.sortType = "重要程度正序";
          }
          this.checkList = [];
          res.obj.screenColumns.forEach((item) => {
            this.checkList.push(item.columnDesc);
          });
          this.checkArr = res.obj.screenColumns.map((item) => {
            return { columnName: item.columnName, columnSort: 1 };
          });
        }
      });
      //获取按键组
      getButtonGroup().then((res) => {
        if (res.status == "SUCCESS") {
          this.buttonGroupOptions = res.obj;
        }
      });
    },
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteBoard(id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功!");
        });
    },
    //选择按键组
    selectButtonGroup(buttonGroup) {
      //多选
      // this.screenBts = buttonGroup;
      // this.form.screenBts = buttonGroup.map((item) => {
      //   return { btId: item };
      // });
      // 单选
      this.form.screenBts = this.screenBts
        .toString()
        .split(",")
        .map((item) => {
          return { btId: item };
        });
    },
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.screenColumns.length == 0) {
              this.form.screenColumns = this.checkArr;
            } else {
              console.log(this.checkList);
              this.form.screenColumns = this.screenColumns;
            }
            if (this.form.dateRange == "24小时") {
              this.form.dateRange = 86400;
            } else if (this.form.dateRange == "36小时") {
              this.form.dateRange = 129600;
            } else if (this.form.dateRange == "48小时") {
              this.form.dateRange = 172800;
            } else if (this.form.dateRange == "7天") {
              this.form.dateRange = 604800;
            } else if (this.form.dateRange == "14天") {
              this.form.dateRange = 1260000;
            } else if (this.form.dateRange == "30天") {
              this.form.dateRange = 2592000;
            } else if (this.form.dateRange == "永久") {
              this.form.dateRange = 0;
            }
            if (this.form.sortType == "发起时间倒序") {
              this.form.sortType = 1;
            } else if (this.form.sortType == "发起时间正序") {
              this.form.sortType = 2;
            } else if (this.form.sortType == "重要程度倒序") {
              this.form.sortType = 3;
            } else if (this.form.sortType == "重要程度正序") {
              this.form.sortType = 4;
            }
            // console.log(this.form)
            addBoard(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                console.log(res);
                this.msgSuccess("修改看板成功！");
                this.open = false;
                this.loading = false;
                this.getList();
              } else {
                this.msgError("修改看板失败，请重试！");
                this.open = false;
                this.loading = false;
              }
            });
          } else {
            if (this.screenColumns.length == 0) {
              this.form.screenColumns = this.checkArr.map((item) => {
                return { columnName: item.value, columnSort: 1 };
              });
            } else {
              this.form.screenColumns = this.screenColumns;
            }
            addBoard(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增看板成功");
                this.open = false;
                this.loading = false;
                this.getList();
              } else {
                this.msgError("新增看板失败，请重试！");
                this.open = false;
                this.loading = false;
              }
            });
          }
        } else {
          this.loading = false;
          this.borderColor = "border-color";
        }
      });
    },
    handleCheckedColumnsChange(value) {
      // console.log(value)
      let arr = [];
      this.columnsOptions.forEach((item) => {
        for (let i = 0; i < value.length; i++) {
          if (value[i] == item.label) {
            arr.push(item);
          }
        }
      });
      this.screenColumns = arr.map((item) => {
        return { columnName: item.value, columnSort: 1 };
      });
    },
    //确认复制链接
    linkDialogConfirm() {
      let url = `http://localhost:80/boardList?id=${this.id}`;
      this.linkDialog = false;
    },
    linkDialogCancel() {
      this.linkDialog = false;
    },
    copy(id) {
      let url = `http://localhost:80/boardList?id=${id}`;
      let clipboard = new ClipboardJS("#copyLink", {
        text: function () {
          return url;
        },
      });
      clipboard.on("success", (e) => {
        this.msgSuccess("链接复制到剪切板");
      });
      clipboard.on("error", (e) => {
        this.msgSuccess("链接复制失败，请重试！");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .mb8 {
  margin-bottom: 0;
}
/deep/ .el-drawer__header {
  background: #f8f8f9;
  padding: 15px 20px;
  color: #666;
  margin-bottom: 0;
  border-bottom: 1px solid #f2f2f2;
}
.content {
  padding: 30px;
}
.footer {
  text-align: center;
}
.border-color {
  /deep/ .vue-treeselect__control {
    border-color: #ff4949;
  }
}
/deep/ .el-table .cell{
  a{
    color: #409EFF;
  }
}
</style>
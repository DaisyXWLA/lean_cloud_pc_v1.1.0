<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="评审维度" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入评审维度名称"
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
    </el-form> -->

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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dimensionality"
      @row-click="handleUpdate"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="80">
        <template slot-scope="scope">
          <span>{{
            (queryParams.current - 1) * queryParams.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="评审维度"
        prop="content"
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
            v-if="scope.row.status != 2"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row)"
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
    <el-drawer
      :title="title"
      :visible.sync="open"
      size="42%"
      :with-header="false"
    >
      <div class="header">
        <el-row>
          <el-col :span="22" style="padding: 15px 0 15px 30px">
            <el-row>
              <el-col :span="22">
                <span>{{ title }}</span>
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
      </div>
      <div class="drawer-container">
        <div class="content">
          <el-form ref="form" :model="form" :rules="rules" label-width="90px">
            <div class="box">
              <div class="title">评审维度基本信息</div>
              <div class="box-content">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="维度名称" prop="content">
                      <el-input
                        v-model="form.content"
                        placeholder="请输入评审维度名称"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="options">
                  <el-row class="content">
                    <el-col :span="3">
                      <span class="title">评审细则</span>
                    </el-col>
                    <el-col :span="21">
                      <el-table>
                        <el-table-column
                          label="内容"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          label="分值"
                          align="center"
                          width="100px"
                        ></el-table-column>
                        <!-- <el-table-column label="操作" align="center"></el-table-column> -->
                      </el-table>
                      <el-row
                        class="form"
                        v-for="(item, index) in form.dimensionality"
                        :key="index"
                      >
                        <el-col :span="20"
                          ><el-form-item prop="content"
                            ><el-input
                              v-model="item.content"
                              placeholder="请输入评审细则"
                              @input="change($event)" /></el-form-item
                        ></el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="item.score" readonly />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <!-- <div class="footer">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm()"
            :loading="loading"
            >{{ loading ? "提交中 ..." : "确 定" }}</el-button
          >
          <el-button @click="cancel" size="medium">取 消</el-button>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getDimensionalityList,
  editDimensionality,
  getDimensionalityDetail,
  deleteDimensionality,
} from "@/api/proposal/proposal";
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
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
      dimensionality: [],
      //分数
      score: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //复选框
      checkList: [],
      userBts: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        content: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        content: [
          { required: true, message: "维度名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      // this.loading = true;
      this.queryParams.groupId = this.$route.params.id;
      getDimensionalityList(this.queryParams).then((res) => {
        if (res.status == "SUCCESS") {
          this.dimensionality = res.obj.records;
          this.total = res.obj.total;
          this.loading = false;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 新增维度操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增评审维度";
      this.form.dimensionality = this.$route.params.scores
        .split(",")
        .map((item) => {
          return {
            content: "",
            score: item,
          };
        });
    },
    /** 修改维度操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.title = "修改评审维度";
      let initialOptions = [];
      let getOptions = [];
      initialOptions = this.$route.params.scores.split(",").map((item) => {
        return {
          content: "",
          score: item,
        };
      });

      //获取维度详情
      getDimensionalityDetail(row.id).then((res) => {
        // console.log( res.obj.standards)
        this.form = res.obj;
        // this.form.dimensionality = res.obj.standards.map((item) => {
        //   return { content: item.content, score: item.score };
        // });
        getOptions = res.obj.standards.map((item) => {
          return { content: item.content, score: item.score };
        });
        if (initialOptions.length > getOptions.length) {
          for (let i = 0; i < initialOptions.length; i++) {
            for (let j = 0; j < getOptions.length; j++) {
              if (getOptions[j].score == initialOptions[i].score) {
                initialOptions[i].content = getOptions[j].content;
              }
            }
          }
          this.form.dimensionality = initialOptions;
        } else if (initialOptions.length < getOptions.length) {
            console.log(initialOptions)
            console.log(getOptions)
            this.form.dimensionality = getOptions;
        } else {
          console.log(initialOptions)
          this.form.dimensionality = getOptions;
        }
      });
    },
    /** 删除维度操作 */
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          return deleteDimensionality(id);
        })
        .then((res) => {
          if (res.status == "SUCCESS") {
            this.getList();
            this.msgSuccess("删除成功");
          } else {
            this.getList();
            this.msgError(res.message);
          }
        });
    },
    /** 提交 */
    submitForm() {
      this.loading = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.standards = this.form.dimensionality.map((item) => {
              return {
                groupId: this.$route.params.id,
                content: item.content,
                orderBy: 1,
              };
            });
            console.log(this.form);
            editDimensionality(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("修改维度成功！");
                this.loading = false;
                this.open = false;
                this.getList();
              } else {
                this.loading = false;
                this.open = false;
                console.log(res);
                this.msgError(res.message);
              }
            });
          } else {
            this.form.groupId = this.$route.params.id;
            this.form.orderBy = 1;
            this.form.standards = this.form.dimensionality.map((item) => {
              return {
                groupId: this.$route.params.id,
                content: item.content,
                orderBy: 1,
              };
            });
            // console.log(this.form);
            editDimensionality(this.form).then((res) => {
              if (res.status == "SUCCESS") {
                this.msgSuccess("新增维度成功！");
                this.open = false;
                this.getList();
              } else {
                this.loading = false;
                this.msgError("新增维度失败，请重试！");
              }
            });
          }
        } else {
          this.loading = false;
        }
      });
    },
    //添加行
    addItem() {
      this.form.buttonBts.push({
        buttonId: "",
        color: "#409EFF",
      });
    },
    //删除行
    removeItem(item) {
      let index = this.form.buttonBts.indexOf(item);
      if (index !== -1) {
        this.form.buttonBts.splice(index, 1);
      }
    },
    //input强制渲染
    change(e) {
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table {
  border: 1px solid #ddd;
  border-bottom: 0;
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
/deep/ .el-dialog__body {
  padding-top: 5px;
}
/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 14px;
}
/deep/ .el-drawer {
  background: #f9f9f9;
}
/deep/ .el-drawer__body {
  overflow: auto;
}
/deep/ .el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.drawer-container {
  .content {
    padding: 0 0 0 20px;
    box-sizing: border-box;
    /deep/ .el-table {
      border: 1px solid #ddd;
      border-bottom: 0;
    }
    .box {
      border: 1px solid #e5e5e5;
      background: #fff;
      margin-top: 20px;
      // padding: 30px 15px;
      .title {
        font-size: 16px;
        color: #555;
        padding: 15px;
        font-weight: bold;
        border-bottom: 1px solid #e5e5e5;
      }
      .box-content {
        padding: 20px 20px;
        /deep/ .el-form-item__label {
          color: #999;
        }
        .options {
          .content {
            margin-bottom: 10px;
            line-height: 30px;
            padding: 0;
            .title {
              font-size: 14px;
              color: #999;
              border: none;
              padding: 0;
              margin-left: 20px;
              position: relative;
              &::before {
                content: "*";
                color: #ff4949;
                position: absolute;
                top: -8px;
                left: -8px;
              }
            }
            .form {
              border-left: 1px solid #e5e5e5;
              border-right: 1px solid #e5e5e5;
              border-bottom: 1px solid #e5e5e5;
              text-align: center;
              /deep/ .el-form-item {
                margin-bottom: 0;
              }
              /deep/ .el-form-item__content {
                margin-left: 0 !important;
              }
              /deep/ .el-input--medium .el-input__inner {
                border: none;
                text-align: center;
              }
              /deep/ .el-input-group__append {
                border: none;
                background: none;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    margin: 20px 0;
    text-align: center;
    background: #fff;
  }
}
.empty-box {
  border: 1px solid #f2f2f2;
  border-top: none;
  .empty {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 10px;
  }
}
/deep/ .el-table__empty-block {
  display: none;
}
</style>

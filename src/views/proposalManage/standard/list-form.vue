<template>
  <div class="app-container">
    <div>
      <div class="header">
        <el-row>
          <el-col :span="4"><span>评审维度</span></el-col>
          <el-col :span="18" class="border"><span>选择项</span></el-col>
          <el-col :span="2"> <span>得分</span></el-col>
        </el-row>
      </div>
      <div class="container">
        <div class="box">
          <el-form ref="form" :model="form">
            <el-row v-for="(item, parentIndex) in data" :key="parentIndex">
              <el-col :span="4" class="title"
                ><div :id="item.id">{{ item.name }}</div></el-col
              >
              <el-col :span="18" class="content">
                <div v-for="(option, index) in item.options" :key="index">
                  <el-form-item prop="value"
                    ><el-input
                      readonly
                      type="textarea"
                      v-model="option.title"
                      @click.native="
                        getValue(item.id, index, parentIndex, option.value)
                      "
                      :class="{ active: index === data[parentIndex].showFlag }"
                    ></el-input
                  ></el-form-item>
                </div>
              </el-col>
              <el-col :span="2" class="value">
                <el-form-item prop="value"
                  ><el-input
                    v-model="value"
                  ></el-input
                ></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {},
      loading: false,
      data: [
        {
          showFlag: "0",
          id: "001",
          name: "工具应用",
          options: [
            {
              id: "0",
              title: "有效使用CI基础工具(问题解决、5s、目视化管理、标准作业)",
              value: "10",
            },
            {
              id: "1",
              title: "有效使用CI高级工具 （防错、快换、TPM、看板、TPB）",
              value: "5",
            },
            {
              id: "2",
              title: "成功运用VSM与制约管理，并使用4种以上CI工具",
              value: "20",
            },
            { id: "3", title: "成功运用6 Sigma工具完成", value: "5" },
            {
              id: "4",
              title: "同时运用6 Sigma和CI工具",
              value: "15",
            },
          ],
        },
        {
          showFlag: "0",
          id: "002",
          name: "质量",
          options: [
            {
              id: "11",
              title: "能维持并提高品质",
              value: "10",
            },
            {
              id: "12",
              title: "能防止不良的发生",
              value: "5",
            },
            {
              id: "15",
              title: "不需要检查也能杜绝不良发生",
              value: "20",
            },
            { id: "123", title: "提高了品质或信誉废除了检查工序", value: "5" },
            { id: "111", title: "提高商品价值提高公司形象", value: "15" },
            { id: "156", title: "有效地运用已有的创新或想法", value: "15" },
          ],
        },
      ],
      row: null,
      column: null,
      value: "",
      parentId: "",
      index: "",
    };
  },
  methods: {
    getValue(parentId, index, parentIndex, value) {
      this.data[parentIndex].showFlag = index;
      // this.parentId = parentId;
      // this.index = index;
      // this.value=value
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  border: 1px solid #ddd;
  background: #f2f2f2;
  text-align: center;
  .border {
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  span {
    display: inline-block;
    font-size: 14px;
    color: #666;
    padding: 15px;
  }
}
.container {
  .box {
    border-right: 1px solid #ddd;
    box-sizing: border-box;
    box-sizing: border-box;
    span {
      font-size: 14px;
      color: #666;
      vertical-align: top;
      cursor: pointer;
    }
    .active {
      /deep/ .el-textarea__inner {
        background-color: #1890ff;
        color: #fff;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 0;
      padding: 10px;
    }
    /deep/ .el-input__inner {
      border: none;
      text-align: center;
      line-height: 0.5rem;
    }
    /deep/ .el-form {
      border-left: 1px solid #ddd;
    }
    .value {
      /deep/ .el-form-item--medium .el-form-item__content {
        line-height: 1.6rem;
      }
    }
    /deep/ .el-textarea__inner {
      cursor: pointer;
      resize: none;
      min-height: 1.6rem !important;
    }
    /deep/ .el-row {
      border-bottom: 1px solid #ddd;
    }
    .content {
      display: flex;
      align-items: center;
      padding: 10px;
      border-right: 1px solid #ddd;
      border-left: 1px solid #ddd;
    }
    .title {
      text-align: center;
      font-size: 14px;
      color: #333;
      padding: 10px;
      line-height: 1.6rem;
    }
  }
}
</style>
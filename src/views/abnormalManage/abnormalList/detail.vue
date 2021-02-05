<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="form" label-width="100px">
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
          <el-form-item label="按键组">{{ form.buttonTeamName }}</el-form-item>
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
          <el-form-item label="上报人">{{ form.createUserName }}</el-form-item>
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
          <el-form-item label="响应时间">{{ form.responseTime }}</el-form-item>
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
      <div class="title">事件附加信息</div>
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
              style="width: 80px; height: 80px"
              :src="item"
              fit="cover"
              :preview-src-list="[item]"
            ></el-image
          ></el-form-item>
        </el-col>
      </el-row>
      <div class="title">事件处理状态记录</div>
      <el-row>
        <el-col :span="24">
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

              <span v-if="item.statusName == '未处理'" class="status pending">
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
              <span v-else-if="item.statusName == '已总结'" class="status sum">
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
              <div class="remark" v-if="item.status==1">
                分配人数：{{item.distributionUserCount}}
              </div>
              <div class="allot" v-if="form.processFlows.length==2">
                分配人：{{buttonResponseUsers}}
              </div>
              <div class="remark" v-if="item.statusName=='已总结'">
                总结：{{ item.doRemark }}
              </div>
              <div class="remark" v-else>
                状态描述：{{ item.doRemark }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button type="warning" @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getAbnormal } from "@/api/abnormal/abnormalList";
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      form: {},
      buttonInfo: {},
      buttonChargeUsers: "",
      imgUrl: [],
      baseURL: "",
      buttonResponseUsers:""
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    this.baseURL = process.env.VUE_APP_BASE_API;
  },
  methods: {
    /** 查询商品列表 */
    getData() {
      //获取按键类别
      getAbnormal(this.$route.params.id).then((res) => {
        if (res.status == "SUCCESS") {
          console.log(res);
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
          this.buttonResponseUsers=res.obj.button.buttonResponseUsers.map(item=>{
            return item.userName
          }).join(",")
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //返回异常按键列表页
    back() {
      //   this.$router.push({ path: "/abnormalManage/abnormalButton" });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__title {
  color: #fff;
}
/deep/ .el-form-item__content {
  color: #666;
}
.title {
  font-size: 16px;
  margin: 10px 0;
  color: #409eff;
  padding-left: 5px;
  font-weight: bolder;
  border-left: 3px solid #409eff;
}
.footer {
  text-align: center;
  margin-top: 10px;
}

/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .el-rate {
  line-height: 2;
}
// 流程
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
</style>

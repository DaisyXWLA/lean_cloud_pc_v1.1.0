<template>
  <div id="typePieEcharts" style="height: 650px" />
</template>
<script>
import echarts from "echarts";
import { proposalTypePie } from "@/api/proposal/proposal";
export default {
  data() {
    return {
      data: [],
      names: [],
    };
  },
  methods: {
    getData(deptId, areaId, auditStatus, beginCreateTime, endCreateTime) {
      proposalTypePie(
        deptId,
        areaId,
        auditStatus,
        beginCreateTime,
        endCreateTime
      ).then((res) => {
        if (res.status == "SUCCESS") {
          this.data = res.obj.data;
          this.names = res.obj.names;
          this.initChart();
        } else {
          this.msgError(res.message);
        }
      });
    },
    initChart() {
      let typePieChart = echarts.init(
        document.getElementById("typePieEcharts")
      );
      let option = {
        backgroundColor: "#fff",
        legend: {
          orient: "horizontal",
          x: "center",
          y: "bottom",
          data: this.names,
          textStyle: {
            //图例文字的样式
            color: "#333",
            fontSize: 14,
          },
        },
        tooltip: {
          //提示框，可以在全局也可以在
          trigger: "item", //提示框的样式
          formatter: "{b}: {c} ({d}%)",
          color: "rgba(36,37,41,0.8)", //提示框的背景色
          textStyle: {
            //提示的字体样式
            color: "#fff",
          },
        },
        color: [
          "#37a2da",
          "#32c5e9",
          "#9fe6b8",
          "#ffdb5c",
          "#ff9f7f",
          "#fb7293",
          "#e7bcf3",
          "#8378ea",
        ],
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 700,
                  fontSize: 13, //文字的字体大小
                },
                formatter: function (param) {
                  return param.name + param.percent.toFixed(0) + "%";
                },
              },
            },
            data: this.data,
          },
        ],
      };
      typePieChart.setOption(option, true);
    },
  },
};
</script>
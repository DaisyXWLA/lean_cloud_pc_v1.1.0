<template>
  <div id="numberPieEcharts" style="height: 650px" />
</template>

<script>
import echarts from "echarts";
import { numberPie } from "@/api/abnormal/statistics";
export default {
  data() {
    return {
      innerData: [],
      outerData: [],
    };
  },
  methods: {
    getData(types, bts, beginCreateTime, endCreateTime, isFinish) {
      numberPie(types, bts, beginCreateTime, endCreateTime, isFinish).then(
        (res) => {
          if (res.status == "SUCCESS") {
            // console.log(res);
            this.innerData = res.obj.innerData;
            this.outerData = res.obj.outerData;
            this.$emit("getNum", res.obj.allCount, res.obj.finishGroupCount);
            this.initChart();
          } else {
            this.msgError(res.message);
          }
        }
      );
    },
    initChart() {
      let colorList = [
        "#37a2da",
        "#32c5e9",
        "#9fe6b8",
        "#ffdb5c",
        "#ff9f7f",
        "#fb7293",
        "#e7bcf3",
        "#8378ea",
      ];
      let numberPieChart = echarts.init(
        document.getElementById("numberPieEcharts")
      );
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          formatter: function (param) {
            if (param.data.type == null) {
              return `${param.name}：${param.value} 个 (${param.percent.toFixed(
                1
              )}%)`;
            } else {
              return `${param.data.type}：${param.value} 个 (${param.percent.toFixed(
                1
              )}%)`;
            }
          },
        },

        series: [
          {
            name: "整体分类",
            type: "pie",
            radius: [0, "30%"],
            label: {
              position: "inner",
            },
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 2,
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            selectedMode: "single",
            data: this.innerData,
          },
          {
            name: "招标方式",
            type: "pie",
            radius: ["40%", "55%"],
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              normal: {
                formatter: function (params) {
                  // return (`{icon|●}{name|${params.name}}{percent|${params.percent.toFixed(1)}%}{value|${params.value}}`)
                  return `${params.data.type}：${
                    params.value
                  } 个 (${params.percent.toFixed(1)}%)`;
                  //   return params.data.type + ":" + params.value + "个";
                },
                show: true,
              },
            },
            data: this.outerData,
          },
        ],
      };
      numberPieChart.setOption(option, true);
    },
  },
};
</script>

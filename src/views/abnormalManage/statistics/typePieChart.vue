<template>
  <div id="typePieEcharts" style="height: 650px" />
</template>
<script>
import echarts from "echarts";
import { typePie } from "@/api/abnormal/statistics";
export default {
  data() {
      return {
          data:[]
      }
  },
  methods: {
    getData(types, bts, beginCreateTime, endCreateTime, isFinish) {
      typePie(types, bts, beginCreateTime, endCreateTime, isFinish).then(
        (res) => {
          if (res.status == "SUCCESS") {
            //   console.log(res)
            this.data=res.obj
            this.initChart();
          } else {
            this.msgError(res.message);
          }
        }
      );
    },
    initChart() {
      let typePieChart = echarts.init(
        document.getElementById("typePieEcharts")
      );
      let option = {
        color: ["#ffc770", "#47d6ff","rgba(255,255,255,.5)"],
        tooltip: {
          trigger: "item",
          padding: [10, 10, 10, 10],
          formatter: "{b} :<br/> {d}%",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["36%", "66%"],
            center: ["50%", "50%"],
            label: {
              fontSize: 13,
              color: "#333",
              formatter: function (param) {
                return (
                  param.name +
                  "{per" +
                  param.dataIndex +
                  "|" +
                  param.percent.toFixed(0) +
                  "%}"
                );
              },
              rich: {
                per0: {
                  padding: [0, 0, 0, 5],
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#ffc770",
                },
                per1: {
                  padding: [0, 0, 0, 5],
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#47d6ff",
                },
                per2: {
                  padding: [0, 0, 0, 5],
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#479eff",
                },
              },
            },
            labelLine: {
              show: true,
              // length: 6,
              // length2: 15
            },
            data: this.data,
          },
          {
            type: "pie",
            radius: ["36%", "43%"],
            center: ["50%", "50%"],
            silent: true,
            data: [
              {
                name: "",
                value: 1,
              },
            ],
          },
        ],
      };
      typePieChart.setOption(option, true);
    },
  },
};
</script>
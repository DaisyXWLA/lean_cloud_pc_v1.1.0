<template>
  <div id="numberHistogramEcharts" style="height: 650px" />
</template>
<script>
import echarts from "echarts";
import { numberHistogram } from "@/api/abnormal/statistics";
export default {
  data() {
    return {
      seriesData: [],
      xAxisData: [],
    };
  },
  methods: {
    getData(types, bts, beginCreateTime, endCreateTime, isFinish, dateType) {
      numberHistogram(
        types,
        bts,
        beginCreateTime,
        endCreateTime,
        isFinish,
        dateType
      ).then((res) => {
        if (res.status == "SUCCESS") {
          //   console.log(res);
          this.seriesData = res.obj.series.map((item) => {
            return {
              name: item.name,
              type: "bar",
              stack: "all",
              barWidth: "40%",
              data: item.data,
            };
          });
          this.xAxisData = res.obj.xAxis;
          this.initChart();
        } else {
          this.msgError(res.message);
        }
      });
    },
    initChart() {
      let numberHistogramChart = echarts.init(
        document.getElementById("numberHistogramEcharts")
      );
      let option = {
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
        // title: {
        //   text: "异常数量趋势图",
        //   textStyle: { color: "#000000", fontSize: 20, fontWeight: "normal" },
        //   x: "center",
        //   top: "2%",
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        legend: {
          // width: "60%",
          top: "10%",
        },
        grid: {
          top: "24%",
          bottom: "8%",
          left: "8%",
          right: "8%",
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLine: {
            lineStyle: { color: "#C4C4C4" },
          },
          axisLabel: {
            textStyle: { color: "#333333", fontSize: 13 },
          },
          data: this.xAxisData,
        },
        yAxis: {
          //   name: "个",
          nameTextStyle: { color: "#333333", fontSize: 13 },
          type: "value",
          splitLine: {
            lineStyle: { color: "#C4C4C4", type: "dashed" },
          },
          axisLine: { show: true },
          axisTick: { show: false },
          axisLabel: {
            textStyle: { color: "#333333", fontSize: 13 },
          },
        },
        series: this.seriesData,
      };
      numberHistogramChart.setOption(option, true);
    },
  },
};
</script>
<template>
  <div id="scatterDiagramEcharts" style="height: 650px" />
</template>
<script>
import echarts from "echarts";
import { scatterDiagram } from "@/api/abnormal/statistics";
export default {
  data() {
    return {
      data: [],
    };
  },
  methods: {
    getData(types, buttons, bts, beginCreateTime) {
      scatterDiagram(types, buttons, bts, beginCreateTime).then((res) => {
        if (res.status == "SUCCESS") {
          console.log(res.obj);
          this.data = res.obj;
          this.initChart();
        } else {
          this.msgError(res.message);
        }
      });
    },
    initChart() {
      let scatterDiagramChart = echarts.init(
        document.getElementById("scatterDiagramEcharts")
      );
      let hours = [
        "0时",
        "1时",
        "2时",
        "3时",
        "4时",
        "5时",
        "6时",
        "7时",
        "8时",
        "9时",
        "10时",
        "11时",
        "12时",
        "13时",
        "14时",
        "15时",
        "16时",
        "17时",
        "18时",
        "19时",
        "20时",
        "21时",
        "22时",
        "23时",
      ];
      let days = [
        "第1天",
        "第2天",
        "第3天",
        "第4天",
        "第5天",
        "第6天",
        "第7天",
      ];

      let data = this.data;

      let option = {
        color:['#37a2da','#32c5e9','#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3','#8378ea'],
        tooltip: {
          position: "top",
        },
        title: [],
        singleAxis: [],
        series: [],
      };

      echarts.util.each(days, function (day, idx) {
        option.title.push({
          textBaseline: "middle",
          top: ((idx + 0.5) * 100) / 7 + "%",
          text: day,
        });
        option.singleAxis.push({
          left: 150,
          type: "category",
          boundaryGap: false,
          data: hours,
          top: (idx * 100) / 7 + 5 + "%",
          height: 100 / 7 - 10 + "%",
          axisLabel: {
            interval: 0,
          },
        });
        option.series.push({
          singleAxisIndex: idx,
          coordinateSystem: "singleAxis",
          type: "scatter",
          data: [],
          symbolSize: function (dataItem) {
            return dataItem[1] * 4;
          },
        });
      });

      echarts.util.each(data, function (dataItem) {
        option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
      });
      scatterDiagramChart.setOption(option, true);
    },
  },
};
</script>
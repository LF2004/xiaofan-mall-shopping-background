<template>
  <div class="echarts-box">
    <h1 class="title">用户数据分析</h1>
    <div id="myEcharts" :style="{ width: '1000px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts">
import {onMounted,onUnmounted, ref} from 'vue';
import * as echarts from "echarts";
import {getUserNumberRegistrationsApi} from "@/services/getUserInfoOrEnrollRZ";
export default {
  name: "echartsBox",
  setup() {
    /// 声明定义一下echart
    let echart = echarts;

    onMounted(() => {
      getUserNumberRegistrationsData();
    });

    onUnmounted(() => {
      echart.dispose;
    });

    const UserNumberRegistrationsData = ref([]);
    // 1-12月
    const MonthName = ref([]);
    const MonthCount = ref([]);

    // 获取用户每月注册量
    const getUserNumberRegistrationsData = async () => {
      const res = await getUserNumberRegistrationsApi();
      // @ts-ignore
      const result = res.data.map(entry => entry.MonthCount); // 修改为对应的字段名
      UserNumberRegistrationsData.value = result;
      // @ts-ignore
      MonthName.value = res.data.map(entry => entry.MonthName);
      // @ts-ignore
      MonthCount.value = res.data.map(entry => entry.Count);
      initChart();
    }

    // 基础配置一下Echarts
    function initChart() {
      let chart = echart.init(document.getElementById("myEcharts"));
      // 把配置和数据放这里
      chart.setOption({
        backgroundColor: '#fff',
        textStyle: {
          color: '#000' // 将文本颜色设置为黑色
        },
        xAxis: {
          type: "category",
          data: MonthName.value
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: MonthCount.value, // 使用获取到的数据
            type: "line",
            radius: ['40%', '60%'], // 设置内外半径
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
          }
        ]
      });
      window.onresize = function() {
        //自适应大小
        chart.resize();
      };
    }

    return { initChart };
  }
};
</script>

<style lang="css" scoped>
.title{
  margin-bottom: 50px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 5px black;
}
</style>

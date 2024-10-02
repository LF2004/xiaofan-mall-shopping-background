<template>
  <div class="echarts-box">
    <h1 class="title">订单数据分析</h1>
    <div id="myEcharts" :style="{ width: '1000px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import {onMounted,onUnmounted, ref} from 'vue';
import {getOrderListApi} from '@/services/order';
import * as echarts from "echarts";

/// 声明定义一下echart
let echart = echarts;

const MonthName = ref([]);
const MonthCount = ref([]);
const MonthTotalSalesAmount = ref([]);
const MonthTotalSalesPrice = ref([]);
const MonthGoodsName = ref([]);

const getOrderListData = async () => {
  const res = await getOrderListApi();
  const data = res.result;

  const months = [...new Set(data.map(entry => entry.month))]; // 获取所有不重复的月份

  // 初始化数组
  const count = Array(months.length).fill(0);
  const totalSalesAmount = Array(months.length).fill(0);
  const totalSalesPrice = Array(months.length).fill(0);
  const goodsName = Array(months.length).fill([]);

// 统计数据
  data.forEach(entry => {
    const index = months.indexOf(entry.month);
    count[index]++;
    totalSalesAmount[index] += entry.total_sales_amount;
    totalSalesPrice[index] += entry.total_sales_price;

    // 处理商品名称
    if (goodsName[index].length === 0) {
      goodsName[index].push({ name: entry.goods_name, salesAmount: entry.total_sales_amount });
    } else {
      const existingMax = goodsName[index][0].salesAmount;
      if (entry.total_sales_amount > existingMax) {
        goodsName[index] = [{ name: entry.goods_name, salesAmount: entry.total_sales_amount }];
      } else if (entry.total_sales_amount === existingMax) {
        goodsName[index].push({ name: entry.goods_name, salesAmount: entry.total_sales_amount });
      }
    }
  });

// 保存结果
  MonthName.value = months;
  MonthCount.value = count;
  MonthTotalSalesAmount.value = totalSalesAmount;
  MonthTotalSalesPrice.value = totalSalesPrice;
  MonthGoodsName.value = goodsName.map(names => names[0]);

}

function initChart(data) {
  let chart = echarts.init(document.getElementById("myEcharts"));
  // 将配置和数据放在这里
  chart.setOption({
    backgroundColor: '#fff',
    textStyle: {
      color: '#000' // 将文本颜色设置为黑色
    },
    xAxis: {
      type: "category",
      data: data.MonthName
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let tooltipContent = params[0].name + '月: ' + '<br>';
        for (let i = 0; i < params.length; i++) {
          let value = params[i].value;
          if (params[i].seriesName === '订单总数') {
            value += '件';
          } else if (params[i].seriesName === '销售总价') {
            value += '元';
          }
          tooltipContent += params[i].marker + ' ' + params[i].seriesName + ': ' + value + '<br>';
        }
        return tooltipContent;
      }
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: '订单总数',
        data: data.MonthCount,
        type: "line",
        radius: ['40%', '60%'],
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
      },
      {
        name: '当月畅销',
        data: data.ProductName,
        type: "bar",
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
      },
      {
        name: '销售总价',
        data: data.AllPrice,
        type: "bar",
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
      }
    ]
  });
  window.onresize = function() {
    chart.resize();
  };
}

// 假设这是你的订单数据
const orderData = {
  MonthName: ['January', 'February', 'March'],
  MonthCount: [100, 120, 90],
  ProductName: ['Product A', 'Product B', 'Product C']
};





onMounted(() =>{
  getOrderListData().then(() => {
    var productNames = MonthGoodsName.value.map(function(item) {
      return item.name;
    });

    // 使用示例
    initChart({MonthName:MonthName.value,MonthCount:MonthTotalSalesAmount.value,ProductName:productNames,AllPrice:MonthTotalSalesPrice.value});
  });
})

onUnmounted(() => {
  echart.dispose;
});
</script>

<style lang="scss" scoped>
.title{
  margin-bottom: 50px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 5px black;
}
</style>

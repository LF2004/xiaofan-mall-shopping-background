<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" />
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="uName" label="姓名" width="80" />
      <el-table-column prop="orderId" label="订单号" width="190" />
      <el-table-column prop="amount" label="订单金额" :formatter="formatPrice" width="80"></el-table-column>
      <el-table-column prop="order_name" label="订单名称" width="140" />
      <el-table-column prop="orderTime" label="订单时间" width="170"/>
      <el-table-column prop="orderType" label="订单类型" width="80">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>类型: {{ scope.row.orderType === 0 ? '充值兑换' : '积分兑换' }}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.orderType === 0 ? 'warning' : 'success'">{{ scope.row.orderType === 0 ? '充值兑换' : '积分兑换' }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="payStatus" label="订单状态" width="80">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>状态: {{ scope.row.payStatus === 0 ? '未完成' : '已完成' }}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.payStatus === 0 ? 'error' : 'success'">{{ scope.row.payStatus === 0 ? '未完成' : '已完成' }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <span style="line-height: 28px; font-size: 13px;color: #ffffff;text-shadow: 2px 2px 5px black;">共 {{ total }} 条记录 第 {{ currentPage }} /{{ pageSize }} 页</span>
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10,50,100, 200, 300, 400]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

</template>

<script lang="ts" setup>
import {onMounted,computed, ref } from 'vue';
import {getUserExchangeMemberApi} from '@/services/UserExchangeMember';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import {ElMessage} from "element-plus";


const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const search = ref('');
const isLoginStatus = ref(false)
// 分页
const pageParams:PageParams = {
  pageNum: 1,
  pageSize: 20
}

// 获取用户信息
const u = ref<UserInfo[]>([]);
const getUserExchangeMemberData = async () => {
  const res = await getUserExchangeMemberApi(pageParams);
  // @ts-ignore
  if(res.code !== 200) {
    // @ts-ignore
    ElMessage({ type: 'error', message: res.msg })
  }else {
    u.value.length = 0
    res.data.forEach((v)=>{
      // @ts-ignore
      u.value.push(v);
    })
    // @ts-ignore
    total.value = res.data[0].alltotal;
    // @ts-ignore
    ElMessage({ type: 'success', message: res.msg })
  }
}


// 通过姓名过滤数据
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.uName.toLowerCase().includes(search.value.toLowerCase())))
// 保留两位小数
const formatPrice = (row:any, column:number)=>{
  return row.amount.toFixed(2);
}
const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserExchangeMemberData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserExchangeMemberData()
}

onMounted(()=>{
  getUserExchangeMemberData()
})
</script>

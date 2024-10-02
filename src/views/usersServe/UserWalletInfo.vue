<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" />
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="uName" label="姓名" width="80" />
      <el-table-column prop="ClassName" label="班级" width="120" />
      <el-table-column prop="Num_of_uses" label="刷课次数" width="100" />
      <el-table-column prop="InvitationNum" label="邀请人数" width="80"/>
      <el-table-column prop="integral" label="总积分" width="80" />
      <el-table-column prop="isexchange_member" label="是否兑换过会员" width="130">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>状态: {{ scope.row.isexchange_member === 0 ? '未兑换' : '已兑换' }}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.isexchange_member === 0 ? 'error' : 'success'">{{ scope.row.isexchange_member === 0 ? '未兑换' : '已兑换' }}</el-tag>
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
import {getUserWalletInfoApi} from '@/services/UserWallet';
import type {PageParams} from '@/type/UserInfo';
import type {userWalletInfo} from '@/type/userWallet'
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
const u = ref<userWalletInfo[]>([]);
const getUserWalletInfoData = async () => {
  const res = await getUserWalletInfoApi(pageParams);
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
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.uName.toLowerCase().includes(search.value.toLowerCase())));
const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserWalletInfoData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserWalletInfoData()
}

onMounted(()=>{
  getUserWalletInfoData()
})
</script>

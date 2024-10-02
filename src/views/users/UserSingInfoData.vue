<template>
  <div class="ifnoDivClass" style="transform: translateX(400px) !important;">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" style="width: 20%"/>
    <el-table :data="filterUserInfoTableData" style="width: 20%;height: 550px">
      <el-table-column fixed prop="uName" label="姓名" width="80" />
      <el-table-column prop="singNum" label="签到次数" width="120" />
    </el-table>
  </div>

</template>

<script lang="ts" setup>
import {onMounted,computed, ref } from 'vue';
import {ChangeUserIdentityApi, ChangeUserIsLoginStatausApi} from '@/services/users';
import { CloseBold,Check,Postcard } from '@element-plus/icons-vue';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import type { TableColumnCtx, TableInstance } from 'element-plus';
import {ElMessage} from "element-plus";
import {getUserSingInfoApi} from "@/services/getUserSingInfoRz";


const search = ref('');
const isLoginStatus = ref(false)


// 获取用户信息
const u = ref<UserInfo[]>([]);
const getUserInfoData = async () => {
  const res = await getUserSingInfoApi();
  // @ts-ignore
  if(res.code !== 200) {
    ElMessage({ type: 'error', message: '获取用户签到日志信息失败!' })
  }else {
    u.value.length = 0
    res.data.forEach((v)=>{
      // @ts-ignore
      u.value.push(v);
    })
    ElMessage({ type: 'success', message: '获取用户签到日志信息成功!' })
  }
}


// 通过姓名过滤数据
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.uName.toLowerCase().includes(search.value.toLowerCase())))

onMounted(()=>{
  getUserInfoData()
})
</script>

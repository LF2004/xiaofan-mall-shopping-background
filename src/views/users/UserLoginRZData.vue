<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" />
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="uName" label="姓名" width="80" />
      <el-table-column prop="className" label="班级" width="140" />
      <el-table-column prop="UserAddress" label="所在地" width="160" />
      <el-table-column prop="user_ip" label="IP" width="140" />
      <el-table-column prop="login_time" label="登录时间" width="180"/>
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
import {getUserLoginInfoApi} from '@/services/getUserLoginRz';
import {ChangeUserIdentityApi, ChangeUserIsLoginStatausApi} from '@/services/users';
import { CloseBold,Check,Postcard } from '@element-plus/icons-vue';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import type { TableColumnCtx, TableInstance } from 'element-plus';
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
const getUserInfoData = async () => {
  const res = await getUserLoginInfoApi(pageParams);
  // @ts-ignore
  if(res.code !== 200) {
    ElMessage({ type: 'error', message: '获取用户登录日志信息失败!' })
  }else {
    u.value.length = 0
    res.data.forEach((v)=>{
      // @ts-ignore
      u.value.push(v);
    })
    total.value = res.data[0].alltotal;
    ElMessage({ type: 'success', message: '获取用户登录日志信息成功!' })
  }
}


// 通过姓名过滤数据
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.uName.toLowerCase().includes(search.value.toLowerCase())))


const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserInfoData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserInfoData()
}

onMounted(()=>{
  getUserInfoData()
})
</script>

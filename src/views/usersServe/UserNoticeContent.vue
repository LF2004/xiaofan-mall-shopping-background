<template>
  <div class="ifnoDivClass">
    <el-table :data="u" style="width: 100%;height: 550px">
      <el-table-column fixed prop="notice_content" label="姓名" width="500" />
      <el-table-column prop="type" label="公告类型" width="130">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>公告类型: {{ getNoticeContentText(scope.row.type) }}</div>
            </template>
            <template #reference>
              <el-tag :type="getNoticeContentTextType(scope.row.type)">{{ getNoticeContentText(scope.row.type) }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed prop="notice_time" label="公告时间" width="180" />
      <el-table-column label="操作功能">
        <template #default="scope">
          <el-button color="#626aef" @click="changeNoticeContent(scope.row.id,scope.row.type)">修改公告内容</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script lang="ts" setup>
import {onMounted,computed, ref } from 'vue';
import {changeNoticeContentApi, getNoticeContentApi} from '@/services/noticeContent';
import type {PageParams} from '@/type/UserInfo';
import {ElMessage,ElMessageBox } from "element-plus";

const isLoginStatus = ref(false)

// 获取用户信息
const u = ref([]);
const getNoticeContentData = async () => {
  const res = await getNoticeContentApi();
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
    ElMessage({ type: 'success', message: res.msg })
  }
}

const getNoticeContentText = (status:number)=> {
  switch (status) {
    case 0:
      return '登录页公告';
    case 1:
      return 'Home页公告1';
    case 2:
      return 'Home页公告2';
    default:
      return '';
  }
}

const getNoticeContentTextType = (status:number)=> {
  switch (status) {
    case 0:
      return 'success';
    case 1:
      return 'warning';
    case 2:
      return 'error';
    default:
      return '';
  }
}

// 修改公告
const changeNoticeContent = (id:number,type:number) =>{
  ElMessageBox.prompt('请输入修改的公告内容', '确认修改?', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputErrorMessage: 'Invalid Email',
  })
      .then(async ({ value }) => {
        const res = await changeNoticeContentApi(id,type,value);
        // @ts-ignore
        if(res.code === 200) {
          ElMessage({
            type: 'success',
            // @ts-ignore
            message: res.msg,
          })
          getNoticeContentData();
        }else {
          ElMessage({
            type: 'error',
            // @ts-ignore
            message: res.msg,
          })
        }

      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
}

onMounted(()=>{
  getNoticeContentData();
})
</script>

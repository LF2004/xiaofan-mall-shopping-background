<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" />
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="uName" label="姓名" width="80" />
      <el-table-column prop="uid" label="用户id" width="80" />
      <el-table-column prop="ClassName" label="班级" width="160" />
      <el-table-column prop="content" label="内容" width="200" />
      <el-table-column label="提交类型" width="80">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>类型: {{ scope.row.contentType === 0 ? 'Bug' : '建议'}}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.contentType === 0 ? 'error' : 'success'">{{ scope.row.contentType === 0 ? 'Bug' : '建议'}}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="bug图片" width="100">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>上传的bug图片</div>
            </template>
            <template #reference>
             <img  v-if="scope.row.imgUrl" :src="scope.row.imgUrl" style="width :50px;height: 50px" @click="BugImgPreview(scope.row.imgUrl)"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="uplodaTime" label="提交时间" width="180"/>
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>状态: {{ scope.row.suggestionStatus === 0 ? '未处理' : '已处理'}}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.suggestionStatus === 0 ? 'error' : 'success'">{{ scope.row.suggestionStatus === 0 ? '未处理' : '已处理'}}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否查看" width="100">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>状态: {{ scope.row.isView === 0 ? '未查' : '已查'}}</div>
            </template>
            <template #reference>
              <el-tag :type="scope.row.isView === 0 ? 'error' : 'success'">{{ scope.row.isView === 0 ? '未查' : '已查'}}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="ReplyContent" label="回复内容" width="200" />
      <el-table-column prop="repairTime" label="审批时间" width="180"/>
      <el-table-column label="操作功能" width="200">
        <template #default="scope">
          <el-button color="#626aef" @click="ChangShowReplyDialog(scope.row.id)">审批提交</el-button>
          <el-button color="#626aef" @click="deleteUserSuggestion(scope.row.id)">删除</el-button>
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

  <el-dialog v-model="isShowBugImgPreview" title="bug图片预览">
   <img :src="bugImgUrl"/>
  </el-dialog>

  <el-dialog v-model="isShowReplyDialog" title="请输入回复内容">
    <el-input v-model="ReplyContent"/>
    <el-button type="primary" @click="changeUserNotice">确认</el-button>
  </el-dialog>

</template>

<script lang="ts" setup>
import {onMounted,computed, ref } from 'vue';
import {ChangUserSuggestion, getUserSuggestionApi,deleteUserSuggestionApi} from '@/services/UserSuggestion';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import {ElMessage, ElMessageBox} from "element-plus";


const bugImgUrl = ref('');
// 回复用户的内容
const ReplyContent = ref('');
const ReplyId = ref(0);
const isShowBugImgPreview = ref(false);
const isShowReplyDialog = ref(false);
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

// 获取用户提交信息
const u = ref<UserInfo[]>([]);
const getUserSuggestionData = async () => {
  const res = await getUserSuggestionApi(pageParams);
  // @ts-ignore
  if(res.code !== 200) {
    ElMessage({ type: 'error', message: '获取用户提交信息失败!' })
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


// bug图片预览
const BugImgPreview = (imgUrl:string)=>{
  bugImgUrl.value = imgUrl;
  isShowBugImgPreview.value = true;

}
const ChangShowReplyDialog = (id:number)=>{
  isShowReplyDialog.value = true;
  ReplyId.value = id;
}

// 审批用户提交的bug或建议
const changeUserNotice = async ()=>{
  const res = await ChangUserSuggestion(ReplyId.value,ReplyContent.value);
  // @ts-ignore
  if(res.code !== 200){
    isShowReplyDialog.value = false;
  }else {
    isShowReplyDialog.value = false;
    ElMessage({ type: 'success', message: '审批用户提交的bug或建议成功!' });
    getUserSuggestionData()
  }
}

// 删除用户提交的bug或建议
const deleteUserSuggestion = async (id:number)=>{
  const res = await deleteUserSuggestionApi(id);
  ElMessageBox.confirm(
      '是否执行该操作?',
      '危险',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        // @ts-ignore
        if(res.code === 200){
          // @ts-ignore
          ElMessage({ type: 'success', message: '删除用户提交的bug或建议成功!' });
          getUserSuggestionData();
        }else {
          ElMessage({ type: 'error', message: '删除用户提交的bug或建议失败!' });
        }

      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        })
      })
}

const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserSuggestionData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserSuggestionData()
}

onMounted(()=>{
  getUserSuggestionData()
})
</script>

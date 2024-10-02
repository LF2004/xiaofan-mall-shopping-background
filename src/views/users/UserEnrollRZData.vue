<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入姓名查询用户" style="width: 30%;" />
    <el-button v-if="IsShowAddRootUserBtn == 1" type="warning" size="large" @click="dialog = true" style="margin-left: 20px">添加管理员账号</el-button>
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="NickName" label="姓名" width="120" />
      <el-table-column prop="uid" label="用户Id" width="110" />
      <el-table-column prop="fullLocation" label="地址" width="160" />
      <el-table-column prop="telPhone" label="手机号" width="120" />
      <el-table-column prop="enrollTime" label="注册时间" width="180"/>
      <el-table-column prop="gender" label="性别" width="60" >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto" v-if="scope.row.gender !== null">
            <template #default>
              <div>性别: {{ scope.row.gender == '男' ? '男' : '女' }}</div>
            </template>
            <template #reference>
              <el-tag v-if="scope.row.gender == '男'">男</el-tag>
              <el-tag type="warning" v-else>女</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="picUrl" label="头像" width="80" >
        <template #default="scope">
          <el-avatar v-if="scope.row.avatar !== 'null' && scope.row.avatar !== ''" shape="square" :size="60" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="MemberStatus" label="身份" width="80" >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>身份: {{ scope.row.profession }}</div>
            </template>
            <template #reference>
              <el-tag type="success">{{ scope.row.profession }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
<!--      <el-table-column prop="gender" label="账号状态" width="80" >-->
<!--        <template #default="scope">-->
<!--          <el-popover effect="light" trigger="hover" placement="top" width="auto" v-if="scope.row.isLoginStatus !== null">-->
<!--            <template #default>-->
<!--              <div>状态: {{ scope.row.isLoginStatus === 0 ? '正常' : '封禁' }}</div>-->
<!--            </template>-->
<!--            <template #reference>-->
<!--              <el-tag type="success" v-if="scope.row.isLoginStatus === 0">正常</el-tag>-->
<!--              <el-tag type="danger" v-else>封禁</el-tag>-->
<!--            </template>-->
<!--          </el-popover>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="left" label="操作" width="300">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.isLoginStatus === 0 ? '封禁用户登陆' : '解封用户登陆'"
              placement="top-start"
          >
            <el-button
                :type="scope.row.isLoginStatus === 0 ? 'danger' : 'success'"
                :icon="scope.row.isLoginStatus === 0 ? CloseBold : Check"
                @click="ChangeUserIsLoginStataus(scope.row.uid,scope.row.isLoginStatus)"
            />

          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="会员权限修改"
              placement="top-start"
          >

          </el-tooltip>

          <el-popconfirm
              confirm-button-text="Yes"
              cancel-button-text="No"

              icon-color="#626AEF"
              :title="scope.row.MemberStatus === 0 ? '是否修改用户为会员?' : '是否修改会员为用户?'"
              @confirm="ChangeUserMemberStatus(scope.row.uid,scope.row.MemberStatus)"
              @cancel="cancelEvent"
          >
            <template #reference>
              <el-button :icon="Postcard" :type="scope.row.MemberStatus === 0 ? 'warning' : 'primary'">{{scope.row.MemberStatus === 0 ? '修改用户为会员' : '修改会员为用户'}}</el-button>
            </template>
          </el-popconfirm>
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


  <el-drawer
      ref="drawerRef"
      v-model="dialog"
      title="添加管理员账号!"
      :before-close="handleClose"
      direction="ltr"
      class="demo-drawer"
  >

    <div class="demo-drawer__content">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.NickName" placeholder="请输入账号" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.uPwd" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer" style="margin-left: 80px">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" :loading="loading" @click="addRootUser">{{
            loading ? 'Submitting ...' : '确认'
          }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import {onMounted,computed, ref } from 'vue';
import {getAllUserInfoApi} from '@/services/users';
// @ts-ignore
import { CloseBold,Check,Postcard } from '@element-plus/icons-vue';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import type { TableColumnCtx, TableInstance,ElDrawer } from 'element-plus';
import {ElMessage,ElMessageBox} from "element-plus";
const formLabelWidth = '80px'
let timer: number | undefined

const table = ref(false)
const dialog = ref(false)
const loading = ref(false)

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
  const res = await getAllUserInfoApi();
  // @ts-ignore
  if(res.code !== 200) {

  }else {
    u.value.length = 0;
    // @ts-ignore
    res.result.forEach((v)=>{
      u.value.push(v);
    })

  }
}
const IsShowAddRootUserBtn = localStorage.getItem('identity');

const getisLoginStatus = (status:number)=> {
  switch (status) {
    case 0:
      return false;
    case 1:
      return true;
    default:
      return '';
  }
}

// 通过姓名过滤数据
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.NickName.toLowerCase().includes(search.value.toLowerCase())))


const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserInfoData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserInfoData()
}

// 用户操作功能-修改用户登录状态
const ChangeUserIsLoginStataus = async (uid:string) => {
  const res = await ChangeUserIsLoginStatausApi(uid);
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
          ElMessage({ type: 'success', message: res.msg });
          getUserInfoData();
        }else {
          ElMessage({ type: 'error', message: '未知错误!' })
        }

      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        })
      })
}

const ChangeUserMemberStatus = async (uid:string,type:number) =>{
  const prams = {
    uid,
    type:type === 0 ? 1 : 0
  }
  const res = await ChangeUserIdentityApi(prams);
  // @ts-ignore
  if(res.code === 200){
    // @ts-ignore
    ElMessage({ type: 'success', message: res.msg });
    getUserInfoData();
  }else {
    ElMessage({ type: 'error', message: '操作失败!' })
  }
}


const form = ref({
  NickName: '',
  uPwd: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})


const drawerRef = ref<InstanceType<typeof ElDrawer>>();

const addRootUserMesh = async ()=>{
  const res = await AddRootUserApi(form.value.NickName,form.value.uPwd);
  loading.value = true
  // @ts-ignore
  if(res.code == 200) {

    // @ts-ignore
    ElMessage({ type: 'success', message: res.msg });
    loading.value = false
  }
}
const addRootUser = () => {
  addRootUserMesh();
  drawerRef.value!.close();
}

const handleClose = (done: () => void) => {
  if (loading.value) {
    return
  }
  ElMessageBox.confirm('是否确认添加?')
      .then(() => {
        loading.value = true
          done()
          // 动画关闭需要一定的时间
          // 添加管理员账号
        addRootUserMesh();
      })
      .catch(() => {
        // catch error
      })
}

const cancelForm = () => {
  loading.value = false
  dialog.value = false
}
onMounted(()=>{
  getUserInfoData()
})
</script>

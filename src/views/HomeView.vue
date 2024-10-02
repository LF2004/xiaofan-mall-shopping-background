<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/image/favicon.png">
        <span>小帆购物商品后台</span>
      </div>


      <!-- 我的 -->
      <div class="myInfo">
        <img :src="rootInfo?.avatar" style="border-radius: 30px">
        <span>尊敬的{{ rootInfo?.NickName }}管理员您好</span>
      </div>
      <el-button type="warning" class="el-btn" @click="quitLogin">退出登录</el-button>
    </el-header>

    <!-- 页面主体区 -->
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu
              active-text-color="#ffd04b"
              background-color="#333744"
              class="el-menu-vertical-demo"
              default-active="1"
              :collapse="isCollapse"
              @open="handleOpen"
              @close="handleClose"
              text-color="#fff"
              :router="true"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item-group title="功能1">
                <el-menu-item index="/users/UserEnrollRZData">所有用户信息</el-menu-item>
              </el-menu-item-group>
<!--              <el-menu-item-group title="功能3">-->
<!--                <el-menu-item index="/users/consultation">用户咨询</el-menu-item>-->
<!--              </el-menu-item-group>-->
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Notification /></el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item-group title="功能1">
                <el-menu-item index="/goods/goods">所有商品信息</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="功能2">
                <el-menu-item index="/goods/orderList">订单管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><setting /></el-icon>
                <span>数据分析</span>
              </template>
              <el-menu-item index="/dataAnalysis/orders">订单数据分析</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted,reactive,ref,toRefs } from 'vue'
import {useRouter} from "vue-router";
import { Menu as IconMenu,Location,User, Message, Setting,Notification } from '@element-plus/icons-vue';

const router = useRouter()
// 退出登录
const quitLogin = ()=>{
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  router.push('/login')
}

// 管理员信息
const rootInfo = ref();

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

onMounted(() =>{
  rootInfo.value = JSON.parse(localStorage.getItem('userInfo'));
})
</script>

<style lang="scss" scoped>
.myInfo{
  position: relative;
  left: 20%;
}
.home-container {
  height: 100%;
}

.el-btn {
  background-color: #fff;
  border: 1px solid #fff;
  color: #333744;
  font-weight: 700;
}

.el-btn:hover {
  background-color: #FFFFF0;
  border: 1px solid #fff;
  color: #333744;
  font-weight: 700;
}

.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 5px black;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-header img {
  width: 60px;
}

.el-aside {
  background-color: #333744;
  overflow-y: hidden;
  height: 100%;
  .el-menu {
    border: none;
    background-color: #333744;

  }
}
.el-main {
  background: transparent url('@/assets/image/home_bg.jpg') center center
  no-repeat;
  background-size: 100% 100%;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>

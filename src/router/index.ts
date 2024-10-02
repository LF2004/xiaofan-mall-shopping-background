import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomeView from '../views/HomeView.vue';

import LoginView from "@/views/LoginView.vue";

import UserEnrollRZData from '@/views/users/UserEnrollRZData.vue';

import UserLoginRZData from '@/views/users/UserLoginRZData.vue';

import UserSingInfoData from '@/views/users/UserSingInfoData.vue';

import UserConsultation from '@/views/usersServe/UserConsultation.vue';

import UserExchangeMember from '@/views/usersServe/UserExchangeMember.vue';

import UserWalletInfo from '@/views/usersServe/UserWalletInfo.vue';

import UserNoticeContent from '@/views/usersServe/UserNoticeContent.vue';

import usersDataAnalysis from  '@/views/dataAnalysis/usersDataAnalysis.vue';

import ordersDataAnalysis from '@/views/dataAnalysis/ordersDataAnalysis.vue';

import AllGoods from '@/views/goods/AllGoods.vue';

import AddSku from '@/views/goods/AddSku.vue';

import orderList from '@/views/goods/orderList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    component:LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children:[
      {
        path:'/users/UserEnrollRZData',
        component:UserEnrollRZData,
      },{
        path:'/users/UserLoginRZData',
        component:UserLoginRZData
      },{
        path:'/users/UserSignInfoData',
        component:UserSingInfoData
      },{
        path:'/users/consultation',
        component:UserConsultation
      },{
        path:'/users/UserExchangeMember',
        component:UserExchangeMember
      },{
        path:'/users/UserWalletInfo',
        component:UserWalletInfo
      },{
        path:'/users/UserNoticeContent',
        component:UserNoticeContent
      },{
        path:'/dataAnalysis/users',
        component:usersDataAnalysis
      },
      {
        path:'/dataAnalysis/orders',
        component:ordersDataAnalysis
      },
      {
        path:'/goods/goods',
        component:AllGoods
      },
      {
        path:'/goods/addSku',
        component:AddSku
      },
      {
        path:'/goods/orderList',
        component:orderList
      }
    ],
    beforeEnter:(to,form,next)=> {
      if (!localStorage.getItem('token')) {
        if (to.name == "login") {
          next();
        } else {
          router.push('login')
        }
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]




const router = createRouter({
  // @ts-ignore
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router

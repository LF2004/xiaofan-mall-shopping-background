<template>
  <div class="ifnoDivClass">
    <el-table :data="orderList" height="550" style="width: 100%">
      <el-table-column fixed  prop="NickName" label="用户名" width="120"/>
      <el-table-column fixed  prop="telPhone" label="手机号" width="120"/>
      <el-table-column fixed prop="creatTime" label="创建时间" width="165"></el-table-column>
      <el-table-column prop="orderId" label="订单id" width="200"/>
      <el-table-column label="商品信息" width="200">
        <el-table-column label="商品名称" width="200" fixed>
          <template #default="scope">
            <div v-for="(item,index) in scope.row.goodsName" :key="index">
              <div v-if="scope.row.goodsName.length > 1">
                第{{ index + 1 }}件商品/{{ item.name }}
              </div>
              <div v-else>
                {{ item.name }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="规格名称" width="200" fixed>
          <template #default="scope">
            <div v-for="(item,index) in scope.row.skuName" :key="index">
              <div v-if="scope.row.skuName.length > 1">
                第{{ index + 1 }}个{{ item.name }}
              </div>
              <div v-else>
                {{ item.name }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品价格" width="200" fixed>
          <template #default="scope">
            <div v-for="(item,index) in scope.row.price" :key="index">
              <div v-if="scope.row.skuName.length > 1">
                第{{ index + 1 }}件商品的价格{{ dynamicProp(item.name) }}
              </div>
              <div v-else>
                {{  dynamicProp(item.name) }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="购买数量" width="100" fixed>
          <template #default="scope">
            <div v-for="(item,index) in scope.row.count" :key="index">
              <div v-if="scope.row.skuName.length > 1">
               {{ item.name }}
              </div>
              <div v-else>
                {{  item.name }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品图片" width="120" fixed>
          <template #default="scope">
            <div v-for="(item,index) in scope.row.goodsImg" :key="index">
              <img :src="item.imgUrl" style="width: 100px;height: 100px" @click="showBigPictrue(item.imgUrl)">
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column  label="总价格" width="100">
        <template #default="scope">
          {{dynamicProp(scope.row.allPirce)}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="success" :icon="Position" @click="ChangeOrderStatus(scope.row.orderId)">发货</el-button>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" fixed="right">
        <template #default="scope">
          <el-tag type="warning" size="large" style="margin-left: 20px">{{ getOrderStatusTitle(scope.row.payStatus) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="原因" prop="remark" width="100" fixed="right">

      </el-table-column>
    </el-table>

    <!-- 商品图片预览 -->
    <el-dialog
        v-model="centerDialogVisible"
        title="图片预览"
        width="500"
        align-center
    >
      <img :src="BigPictrue" class="goodsImg"/>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import {onMounted, ref} from 'vue';
import {getUserOrderApi,ChangeOrderStatusApi} from '@/services/order';
import {Position} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const orderList = ref([])

const centerDialogVisible = ref(false);

const BigPictrue = ref('')



const getUserOrder = async () => {
  const res = await getUserOrderApi();
  orderList.value = res.result;
}

// 大图预览
const showBigPictrue = (src:string)=>{
  centerDialogVisible.value = true;
  BigPictrue.value = src;
}

const dynamicProp = (propName)=>{
  return `${propName}元`;
}
// { orderState: 1, title: '待付款' },
// { orderState: 2, title: '待发货' },
// { orderState: 3, title: '待收货' },
// { orderState: 4, title: '待评价' },
const getOrderStatusTitle = (orderId:string) =>{
  switch (orderId){
    case 1:
      return '待付款'
    case 2:
      return '待发货'
    case 3:
      return '待收货'
    case 4:
      return '待评价'
    case 6:
      return '已取消'
    default:
      break;
  }
}


const ChangeOrderStatus = async (orderId:string)=>{
  const res = await ChangeOrderStatusApi(orderId);
  getUserOrder()

}
onMounted(() => {
  getUserOrder()
})
</script>

<style scoped>
.goodsImg{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="ifnoDivClass">
    <el-input v-model="search" size="large" placeholder="输入商品名称查找" style="width: 30%;" />

    <el-button type="warning" size="large" style="margin-left: 20px" @click="openAddGoodsPreview">添加商品</el-button>
    <el-table :data="filterUserInfoTableData" style="width: 100%;height: 550px">
      <el-table-column fixed prop="goodsName" label="商品名称" width="250" />
      <el-table-column prop="goodsType" label="类型" width="60" >
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>类型: {{ getGoodsClassify(scope.row.goodsType) }}</div>
            </template>
            <template #reference>
              <el-tag type="warning">{{ getGoodsClassify(scope.row.goodsType) }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="picUrl" label="商品图片" width="80" >
        <template #default="scope">
          <el-avatar v-if="scope.row.picture !== 'null' && scope.row.picture !== ''" shape="square" :size="60" :src="scope.row.picture" @click="showBigPictrue(scope.row.picture)"/>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="100">
        <template #default="scope">
          {{dynamicProp(scope.row.price)}}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="create_time" label="上架时间" width="180"/>
      <el-table-column align="left" label="操作" width="300">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="商品预览"
              placement="top-start"
          >
            <el-button color="#626aef" :icon="Shop" @click="clickPreview(scope.row.goodsId)"/>

          </el-tooltip>

          <el-tooltip
              class="box-item"
              effect="dark"
              content="查看评论"
              placement="top-start"
          >
            <el-button type="warning" :icon="ChatLineSquare" @click="clickCommentPreview(scope.row.goodsId)"/>

          </el-tooltip>

          <el-tooltip
              class="box-item"

              effect="dark"
              content="添加商品规格"
              placement="top-start"
          >
            <router-link :to="`/goods/addSku?goodsId=${scope.row.goodsId}`">
              <el-button type="primary" :icon="Sell" style="margin-left: 15px"/>
            </router-link>


          </el-tooltip>

          <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.isEffective === 1 ? '上架商品' : '下架商品'"
              placement="top-start"
          >
            <el-button :type="scope.row.isEffective === 1 ? 'success' : 'danger'" style="margin-left: 15px" :icon="scope.row.isEffective === 1 ? Select : Close" @click="ShelvesOrUnShelvesGoods(scope.row.goodsId)"/>

          </el-tooltip>

        </template>
      </el-table-column>

    </el-table>
    <span style="line-height: 28px; font-size: 13px;color: #ffffff;text-shadow: 2px 2px 5px black;">共 {{ u[0]?.total_count }} 条记录 第 {{ currentPage }} /{{ pageSize }} 页</span>
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10,20,50,100, 200, 300, 400]"
        layout="sizes, prev, pager, next, jumper"
        :total="u[0]?.total_count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

  <!-- 商品图片预览 -->
  <el-dialog
      v-model="centerDialogVisible"
      title="图片预览"
      width="500"
      align-center
  >
    <img :src="BigPictrue" class="goodsImg"/>
  </el-dialog>


  <!-- 商品预览 -->
  <el-dialog
      v-model="goodsPreview"
      @close="hideGoodsPreview"
      title="商品预览"
      width="500"
      align-center
  >
    <iframe v-if="flushedGoodsPreview" :src="`http://193.112.123.10:81/#/pages/goods/goods?id=${goodsId}`" style="width: 100%;height: 1000px"></iframe>
  </el-dialog>

  <!-- 查看评论 -->
  <el-dialog
      v-model="commentsPreview"
      @close="hideCommentsPreview"
      title="评论预览"
      width="500"
      align-center
  >
    <iframe v-if="flushedCommentsPreview" :src="`http://193.112.123.10:81/#/pages/comments/components/userCommentsPlane?goodsId=${goodsId}`" style="width: 100%;height: 1000px"></iframe>
  </el-dialog>

  <!-- 添加商品 -->
  <el-dialog
      v-model="addGoodsPreview"
      title="添加商品"
      width="500"
      align-center
  >

    <el-form :model="goodsForm" label-width="120px">
      <el-form-item label="商品名称">
        <el-input v-model="goodsForm.gooodsName" />
      </el-form-item>
      <el-form-item label="商品类型">
        <el-cascader placeholder="请选择类型" v-model="goodsForm.goodsClassify" :options="goodsClassify" @change="settingGoodsType(goodsForm.goodsClassify)" />
      </el-form-item>
      <el-form-item label="是否为预售商品">
        <el-switch v-model="goodsForm.limitedStatus" />
      </el-form-item>
      <el-form-item label="开始时间" v-if="goodsForm.limitedStatus">
        <el-col :span="11">
          <el-date-picker
              v-model="goodsForm.date1"
              type="date"
              placeholder="开始年月日"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker
              v-model="goodsForm.date2"
              placeholder="开始时间段"
              style="width: 100%"
              value-format="HH:mm:ss"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="结束时间" v-if="goodsForm.limitedStatus">
        <el-col :span="11">
          <el-date-picker
              v-model="goodsForm.date3"
              type="date"
              placeholder="结束年月日"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker
              v-model="goodsForm.date4"
              placeholder="结束时间段"
              style="width: 100%"
              value-format="HH:mm:ss"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="设置商品库存数">
        <el-input-number v-model="goodsForm.stock" :min="1" :max="10000" @change="handleChange" />
      </el-form-item>
      <el-form-item label="设置商品现价格">
        <el-input-number v-model="goodsForm.price" :precision="2" :step="1" :max="10000" />
      </el-form-item>
      <el-form-item label="设置商品历史价">
        <el-input-number v-model="goodsForm.oldPrice" :precision="2" :step="1" :max="10000" />
      </el-form-item>
      <el-form-item label="上传商品封面照">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:9000/upload/Upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
        >
          <img v-if="goodsForm?.picture" :src="goodsForm?.picture" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addGoods">添加商品</el-button>
        <el-button @click="addGoodsPreview = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script lang="ts" setup>
// @ts-nocheck
import {onMounted,computed, ref } from 'vue';
import { getGoodsInfoApi,getGoodsClassifyInfoApi,addGoodsApi,ShelvesOrUnShelvesApi } from '@/services/goods';
import { CloseBold,Check,Postcard,Shop,ChatLineSquare,Plus,Sell,Close,Select } from '@element-plus/icons-vue';
import type {UserInfo,PageParams} from '@/type/UserInfo';
import type { TableColumnCtx, TableInstance,ElDrawer } from 'element-plus';
import {ElMessage,ElMessageBox,UploadProps} from "element-plus";
import PrviewGoods from '@/components/PreviewGoods.vue';
const formLabelWidth = '80px'
let timer: number | undefined

const table = ref(false)
const centerDialogVisible = ref(false);
const flushedGoodsPreview = ref(false);
const flushedCommentsPreview = ref(false);
const addGoodsPreview = ref(false);
const goodsPreview = ref(false);
const commentsPreview = ref(false);

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const search = ref('');

const dynamicProp = (propName)=>{
  return `${propName}元`;
}

// 需要添加的商品信息
const goodsForm = ref({
  gooodsName: '',
  date1: '',
  date2: '',
  date3: '',
  date4: '',
  stock:0,
  price:0,
  picture:'',
  oldPrice:0,
  goodsClassify:'',
  goodsType:0,
  limitedStatus:false,
})

// 商品分类数据
const goodsClassify = ref([]);
// 分页
const pageParams:PageParams = {
  pageNum: 1,
  pageSize: 20
}


// 获取商品数据
const u = ref<UserInfo[]>([]);
const getUserInfoData = async () => {
  const res = await getGoodsInfoApi(pageParams.pageNum,pageParams.pageSize);
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

// 获取商品分类名称
const getGoodsClassify = (Type:number)=> {
  switch (Type) {
    case 0:
      return '数码';
    case 1:
      return '周边';
    case 2:
      return '服装';
    case 3:
      return '潮鞋'
    default:
      return '';
  }
}

const getGoodsTpye = (Type:string)=> {
  switch (Type) {
    case '数码':
      return 0;
    case '周边':
      return 1;
    case '服装':
      return 2;
    case '潮鞋':
      return 3
    default:
      return '';
  }
}

// 通过商品名称过滤数据
const filterUserInfoTableData = computed(() => u.value.filter((data) => !search.value || data.goodsName.toLowerCase().includes(search.value.toLowerCase())))


const handleSizeChange = (val: number) => {
  pageParams.pageSize = val;
  getUserInfoData()
}
const handleCurrentChange = (val: number) => {
  pageParams.pageNum = val;
  getUserInfoData()
}


const BigPictrue = ref('');

const goodsId = ref();

// 大图预览
const showBigPictrue = (src:string)=>{
  centerDialogVisible.value = true;
  BigPictrue.value = src;
}


// 商品预览
const clickPreview = (id:string)=>{
  goodsPreview.value = true;
  goodsId.value = id;
  flushedGoodsPreview.value = true;

}

const hideGoodsPreview = ()=>{
  flushedGoodsPreview.value = false;
}

const hideCommentsPreview = ()=>{
  flushedCommentsPreview.value = false;
}


// 评论预览
const clickCommentPreview = (id:string)=>{
  flushedCommentsPreview.value = true;
  commentsPreview.value = true;
  goodsId.value = id;
}

// 打开添加商品页面
const openAddGoodsPreview = async ()=>{
  addGoodsPreview.value = true;
  const res = await getGoodsClassifyInfoApi();
  const classifyMap = new Map();
  // 遍历原始数据并按照 classify_parent_name 进行分类
  res.result.forEach(v => {
    const parentName = v.classify_parent_name;
    const childName = v.classify_child_name;
    if (!classifyMap.has(parentName)) {
      classifyMap.set(parentName, { value: parentName, label: parentName, children: [] });
    }
    const parent = classifyMap.get(parentName);
    if (!parent.children.some(child => child.value === childName)) {
      parent.children.push({ value: childName, label: childName });
    }
  });
  // 将分类后的数据转化为数组形式
  goodsClassify.value = Array.from(classifyMap.values());
}


// 进行添加商品操作
const addGoods = async ()=> {
  const {
    date1,
    date2,
    date3,
    date4,
    ...item
  } = goodsForm.value;
  const newGoodsForm = {limted_time: (date1 + date2).replace(/(\d{4})-(\d{2})-(\d{2})/,'$1-$2-$3 '),limted_over_time:(date3 + date4).replace(/(\d{4})-(\d{2})-(\d{2})/,'$1-$2-$3 '), ...item};
  const res = await addGoodsApi(newGoodsForm);
  if(res.code === 200){
    addGoodsPreview.value = false;
    getUserInfoData();
  }
}

// 上传商品图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  goodsForm.value.picture = response?.imgUrl;
}

// 设置商品类型
const settingGoodsType = (type:string)=>{
  goodsForm.value.goodsType = getGoodsTpye(type[0]);
}

const ShelvesOrUnShelvesGoods = async (id:string)=>{
  const res = await ShelvesOrUnShelvesApi(id);
  getUserInfoData()
}

onMounted(()=>{
  getUserInfoData();
})
</script>


<style lang="scss" scoped>
.goodsImg{
  position: relative;
  width: 100%;
  height: 100%;
}

.el-icon.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar{
  position: relative;
  width: 100%;
  height: 100%;
}

.el-icon.avatar-uploader-icon {
  border: 1px dashed #8c939d;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border-radius: 15px;
}
</style>

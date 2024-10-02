<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="规格名称">
    <el-input v-model="form.skuName" size="large" placeholder="请输入规格名称" style="width: 30%;" />
    </el-form-item>
    <el-form-item label="规格图片">
      <el-upload
          class="avatar-uploader"
          action="http://localhost:9000/upload/Upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="规格值">
      <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="w-20"
          size="small"
          style="width: 5%;"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + 新规格
      </el-button>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="addSku">添加规格</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="tableData" height="500" style="width: 100%">
    <el-table-column prop="skuName" label="规格名称" width="180" />
    <el-table-column prop="skuNameInfo" label="规格属性值" width="180" />
    <el-table-column  prop="price" label="价格">
      <template #default="scope">
        <el-input v-model="scope.row.PriceInpVal" :value="scope.row.skuPrice" type="number" placeholder="请输入价格" @blur="changSkuPrice(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column prop="inventory" label="库存">
      <template #default="scope">
        <el-input v-model="scope.row.InventoryInpVal" :value="scope.row.skuStock" placeholder="请输入库存" @blur="changSkuInventory(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column prop="picture" label="图片">
      <template #default="scope">
        <el-image
            style="width: 100px; height: 100px;"
            :src="scope.row.picture"
            :preview-src-list="[scope.row.picture]"
            fit="cover"
        />
      </template>
    </el-table-column>
  </el-table>


</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted,nextTick,reactive,ref } from 'vue';
import { useRouter } from 'vue-router'
import { getGoodsSkuDataApi,addGoodsSkuApi } from '@/services/goods';
import { Plus } from '@element-plus/icons-vue';
import { ElInput } from 'element-plus'
import type { UploadProps } from 'element-plus'

const route = useRouter();


// do not use same name with ref
const form = reactive({
  skuName: '',
  region: '',
  price:'',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})


const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    // @ts-ignore
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const tableData = ref([]);

const getGoodsSkuData = async ()=>{
  const res = await getGoodsSkuDataApi(route.currentRoute.value.query.goodsId);
  for(let i = 0; i < res.result.convertedData.spec_list.length; i++) {
    for(let k = 0; k < res.result.convertedData.spec_list[i].list.length; k++) {
      tableData.value.push({
        skuId:res.result.convertedData.sku_list[i]?._id,
        skuName:res.result.convertedData.spec_list[i].name,
        skuPrice:res.result.convertedData.sku_list[i]?.price,
        skuStock:res.result.convertedData.sku_list[i]?.stock,
        skuNameInfo:res.result.convertedData.spec_list[i].list[k].name,
        picture:res.result.convertedData.sku_list[k].image,
      })
    }
  }
  console.log(tableData.value)
}


const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}


// 添加规格
const addSku = async ()=>{
  // 向tableData添加新的sku
  tableData.value.push({
    skuName:form.skuName,
    skuNameInfo:dynamicTags.value,
  })
  const res = await addGoodsSkuApi({
    skuName:form.skuName,
    skuVal:dynamicTags.value,
    skuInventory:100,
    organization_name:'台',
    skuPicture:''
  });
}

// 修改规格价格
const changSkuPrice = (data:any)=>{
  console.log(tableData.value)
}

const changSkuInventory = (data:any)=>{
  console.log(data)
}

onMounted(() =>{
  getGoodsSkuData();
  for(let i = 0; i < tableData.value.length; i++){
    tableData.value.forEach(v => {
      v.PriceInpVal = '';
      v.InventoryInpVal = 0;
    })
  }
})

</script>

<style lang="scss" scoped>

.el-icon.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar{
  position: relative;
  width: 300px;
  height: 300px;
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

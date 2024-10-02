import service from ".";
import {GoodsInfo} from '../type/goods';

// 获取商品信息
export const getGoodsInfoApi = (pageNum:string,pageSize:string)=>{
    return service<[GoodsInfo]>({
        url:`/root/goods?pageNum=${pageNum}&pageSize=${pageSize}`,
        method:'GET',
    })
}

// 获取分类商品信息
export const getGoodsClassifyInfoApi = ()=>{
    return service({
        url:'/root/goods/classify',
        method:'GET',
    })
}

// 添加商品
export const addGoodsApi = (data:any)=>{
    return service({
        url:'/root/goods/add',
        method:'POST',
        data
    })
}

// 获取商品sku数据
export const getGoodsSkuDataApi = (goodId:string)=>{
    return service({
        url:`/api/goods/detail?goodId=${goodId}`,
        method:'GET',
    })
}

interface skuParams {
    skuName:string
    skuVal:string
    skuInventory:string
    organization_name:string
    skuPicture:string

}

// 添加商品sku规格
export const addGoodsSkuApi = (data:skuParams)=>{
    return service({
        url:'/root/goods/add/sku',
        method:'POST',
        data
    })
}

// 上架商品或下架商品
export const ShelvesOrUnShelvesApi = (orderId:string)=>{
    return service({
        url:'/root/goods/ShelvesOrUnShelves',
        method:'POST',
        data:{orderId}
    })
}

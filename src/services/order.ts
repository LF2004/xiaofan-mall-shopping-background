import service from "@/services/index";

export const getUserOrderApi = ()=>{
    return service({
        url:'/root/goods/order/list',
        method:'GET',
    })
}

export const getOrderListApi = () => {
    return service<[]>({
        method: 'GET',
        url: '/root/order/dataAnalysis',
    })
}

// 订单发货
export const ChangeOrderStatusApi = (orderId:string) => {
    return service({
        method: 'POST',
        url: '/root/goods/order/shipments',
        data:{orderId}
    })
}

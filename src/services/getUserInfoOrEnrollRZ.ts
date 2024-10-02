import service from ".";
import {UserInfo,PageParams} from '../type/UserInfo';

export const getUserInfoApi = (data:PageParams) => {
    return service<UserInfo[]>({
        method: 'GET',
        url: `/users/getUserEnrollRZData?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
}

// 获取每月用户注册量
export const getUserNumberRegistrationsApi = ()=>{
    return service({
        method:'GET',
        url:'/users/getUserNumberRegistrations'
    })
}


import service from ".";
import {UserInfo} from '../type/UserInfo';

// 获取所有用户信息
export const getAllUserInfoApi = ()=>{
    return service<[UserInfo]>({
        url:'/root/userInfo',
        method:'GET',
    })
}

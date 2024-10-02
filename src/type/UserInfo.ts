// 注册的用户信息
import {ChangUserSuggestion} from "@/services/UserSuggestion";

export type UserInfo = {
    // 用户uid
    uid: string,
    // 用户姓名
    xiaofan_name: string,
    // 用户身份
    identity: string,
    // 注册时间
    enrollTime: string,
    gender:string,
    NickName: string,
    birthday: string,
    // 用户所在地
    fullLocation: string,
    // 用户身份
    profession: string,
    // 用户绑定的手机号
    telPhone: string,
    // 用户头像
    avatar: number
}

export type PageParams = {
    pageNum: number,
    pageSize: number
}


// 修改用户身份参数定义
export type ChangeUserIdentity = {
    uid: string,
    type: number
}

// 用户登录日志参数
export type UserLoginRZData = {
    // 用户姓名
    uName:string,
    // 用户班级姓名
    className:string,
    // 用户所在地
    UserAddress:string,
    // 用户IP
    user_ip:string,
    // 登录时间
    login_time:string,
    // 总条数
    alltotal:number
}

import service from ".";
import {PageParams} from '../type/UserInfo';
export const getUserSuggestionApi = (data:PageParams) => {
    return service<[]>({
        method: 'GET',
        url: `/users/userSuggestion?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
}

// 审批用户提交的bug或建议

export const ChangUserSuggestion = (id:number,ReplyContent:string) => {
    return service<[]>({
        method: 'POST',
        url: '/users/changUserSuggestion',
        data:{
            id,
            ReplyContent
        }
    })
}

// 删除用户提交的bug或建议
export const deleteUserSuggestionApi = (id:number) =>{
    return service({
        method: 'GET',
        url: `/users/deleteUserSuggestion?id=${id}`,
    })
}

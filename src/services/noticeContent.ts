import service from ".";

// 获取公告
export const getNoticeContentApi = () => {
    return service<[]>({
        method: 'GET',
        url: '/users/noticeContent?pageNum',
    })
}

// 修改公告
export const changeNoticeContentApi = (id:number,type:number,notice_content:string) =>{
    return service({
        url:'/users/changeNoticeContent',
        method:'post',
        data:{
            noticeId:id,
            type,
            noticeContent:notice_content
        }
    })
}

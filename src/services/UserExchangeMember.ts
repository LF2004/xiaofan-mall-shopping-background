import service from ".";
import {PageParams} from '../type/UserInfo';
import {orderInfo} from  '../type/order';
export const getUserExchangeMemberApi = (data:PageParams) => {
    return service<orderInfo[]>({
        method: 'GET',
        url: `/users/userExchangeMember?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
}

import service from ".";
import {UserLoginRZData,PageParams} from '../type/UserInfo';

export const getUserLoginInfoApi = (data:PageParams) => {
    return service<UserLoginRZData[]>({
        method: 'GET',
        url: `/users/getUserLoginRZData?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
}

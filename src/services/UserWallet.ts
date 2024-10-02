import service from ".";
import {userWalletInfo} from '../type/userWallet';
import {PageParams} from "@/type/UserInfo";
export const getUserWalletInfoApi = (data:PageParams) => {
    return service<userWalletInfo[]>({
        method: 'GET',
        url: `/users/userWallet?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
}

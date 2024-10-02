import service from ".";
import {UserInfoRz} from '../type/UserInfoRz';

export const getUserInfoApi = () => {
    return service<UserInfoRz>({
        method: 'GET',
        url: '/users/getUserInfoRz',
    })
}

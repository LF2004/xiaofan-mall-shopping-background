import service from ".";
import {LoginFormInt} from '../type/login';
export function login(data:LoginFormInt){
    return service({
        url:'/api/root/login',
        method:'post',
        data
    })
}

import service from ".";

export const getUserSingInfoApi = () => {
    return service<[]>({
        method: 'GET',
        url: '/users/userSingInfo',
    })
}

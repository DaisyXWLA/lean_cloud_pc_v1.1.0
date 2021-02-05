import request from '@/utils/request'


//判断打开看板是否需要密码
export function verify(id){
    return request({
        url:`/screen/index?id=${id}`,
        method:'get',
        headers:{isToken:false}
    })
}

//看板列表
export function getList(query){
    return request({
        url:`/abnormal/getScreenData`,
        method:'post',
        params:query,
        headers:{isToken:false}
    })
}


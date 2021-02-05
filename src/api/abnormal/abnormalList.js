import request from '@/utils/request'


//查询异常记录列表
export function abnormalList(query){
    return request({
        url:'/abnormal/getList',
        method:'post',
        params:query
    })
}

//异常记录详情
export function getAbnormal(id){
    return request({
        url:`/abnormal/allInfo?id=${id}`,
        method:'get'
    })
}
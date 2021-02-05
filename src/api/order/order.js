import request from '@/utils/request'

// 查询订单列表
export function orderList(query){
    return request({
        url:'/order/list',
        method:'get',
        params:query
    })
} 

// 改变订单状态
export function changeStatus(id){
    return request({
        url:'/order/batchConfirmDstribution?ids='+id,
        method:'get'
    })
}
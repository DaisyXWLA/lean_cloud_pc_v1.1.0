import request from '@/utils/request'


//公告列表
export function noticeList(query){
    return request({
        url:'/report/getReportPageList',
        method:'post',
        params:query
    })
}

//新增修改公告
export function addNotice(data){
    return request({
        url:'/report/saveOrUpdate',
        method:'post',
        data:data
    })
}

//删除公告
export function deleteNotice(id){
    return request({
        url:`/report/delete?ids=${id}`,
        method:'get'
    })
}

//公告详情
export function getNotice(id){
    return request({
        url:`/report/detail?reportId=${id}`,
        method:'get'
    })
}
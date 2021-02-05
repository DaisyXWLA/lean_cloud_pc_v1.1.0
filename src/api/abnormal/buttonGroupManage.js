import request from '@/utils/request'

//获取按钮组列表
export function buttonGroupList(query){
    return request({
        url:'/buttonTeam/getButtonTeamList',
        method:'post',
        params:query
    })
}

//新增/修改按钮组
export function addButtonGroup(data){
    return request({
        url:'/buttonTeam/saveOrUpdate',
        method:'post',
        data:data
    })
}

//获取按钮组详情
export function getButtonGroup(id){
    return request({
        url:`/buttonTeam/allInfo?id=${id}`,
        method:'get'
    })
}

//删除按钮组
export function deleteButtonGroup(id){
    return request({
        url:`/buttonTeam/delete?ids=${id}`,
        method:'get'
    })
}

//获取按键组类别
export function getButtonGroupType(){
    return request({
        url:'/btType/getBtTypeAll',
        method:'get'
    })
}

//获取按键
export function getAllButton(){
    return request({
        url:'/button/getAll',
        method:'get'
    })
}
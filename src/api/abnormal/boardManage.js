import request from '@/utils/request'

//看板列表
export function boardList(query){
    return request({
        url:'/screen/getAbnormalScreenList',
        method:'post',
        params:query
    })
}

//按钮组
export function getButtonGroup(){
    return request({
        url:'/buttonTeam/getAll',
        method:'get'
    })
}


//新增/修改看板
export function addBoard(data){
    return request({
        url:'/screen/saveOrUpdate',
        method:'post',
        data:data
    })
}


//看板详情
export function getBoard(id){
    return request({
        url:`/screen/allInfo?id=${id}`,
        method:'get'
    })
}


//看板展示字段
export function getColumns(){
    return request({
        url:'/screen/getScreenColumns',
        method:'get'
    })
}

//删除看板
export function deleteBoard(id){
    return request({
        url:`/screen/delete?ids=${id}`,
        method:'get'
    })
}

//启用看板
export function userBoard(id){
    return request({
        url:`/screen/enable?id=${id}`,
        method:'get'
    })
}


//禁用看板
export function forbiddenBoard(id){
    return request({
        url:`/screen/disEnable?id=${id}`,
        method:'get'
    })
}




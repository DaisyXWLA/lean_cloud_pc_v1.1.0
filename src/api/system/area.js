import request from '@/utils/request'

// 查询区域列表
export function areaList(query){
    return request({
        url:'/area/getAreaList',
        method:'post',
        params:query
    })
}  

// 新增/修改区域
export function addArea(data){
    return request({
        url:'/area/saveOrUpdateArea',
        method:'post',
        data:data
    })
}


//删除区域 
export function deleteArea(id){
    return request({
        url:'/area/deleteArea?ids='+id,
        method:'get'
    })
}

// 获取区域详情
export function getArea(id){
    return request({
        url:'/area/info?id='+id,
        method:'get'
    })
}

//获取上级区域
export function getParentArea(){
    return request({
        url:'/area/getList',
        method:'get'
    })
}

//获取区域详情及负责人列表
export function getAreaAndPrincipal(id){
    return request({
        url:`/area/allInfo?id=${id}`,
        method:'get'
    })
}


//选择上级区域下拉选项
export function getTreeList(id){
    if(id==undefined){
        return request({
            url:`/area/getTreeList`,
            method:'get'
        })
    }else{
        return request({
            url:`/area/getTreeList?excludeId=${id}`,
            method:'get'
        })
    }
}

//选择上级区域下拉选项
export function getTreeAreaList(id){
    if(id==undefined){
        return request({
            url:`/area/getTreeList?needTop=true`,
            method:'get'
        })
    }else{
        return request({
            url:`/area/getTreeList?excludeId=${id}&needTop=true`,
            method:'get'
        })
    }
}


//归档
export function areaPigeonhole(id){
    return request({
        url:`/area/logicDelete?id=${id}`,
        method:'get'
    })
}


//禁用
export function areaForbidden(id){
    return request({
        url:`/area/disable?id=${id}`,
        method:'get'
    })
}

//启用
export function areaEnable(id){
    return request({
        url:`/area/enable?id=${id}`,
        method:'get'
    })
}

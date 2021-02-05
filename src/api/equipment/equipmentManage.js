import request from '@/utils/request'

//获取设备列表
export function equipmentList(query){
    return request({
        url:'/equipment/getEquipmentList',
        method:'post',
        params:query
    })
}

//新增修改设备信息
export function addEquipment(data){
    return request({
        url:'/equipment/saveOrUpdate',
        method:'post',
        data:data
    })
}

//获取设备信息
export function getEquipment(id){
    return request({
        url:`/equipment/info?id=${id}`,
        method:'get'
    })
}

//删除设备
export function deleteEquipment(id){
    return request({
        url:`/equipment/delete?ids=${id}`,
        method:'get'
    })
}
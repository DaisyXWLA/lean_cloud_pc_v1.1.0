import request from '@/utils/request'

// 查询按键组类别列表
export function buttonGroupTypeList(query) {
    return request({
      url: '/btType/getBtTypeList',
      method: 'get',
      params: query
    })
}

// 新增/修改按键组类别
export function addButtonGroupType(data){
    return request({
        url:'/btType/saveOrUpdate',
        method:'post',
        data:data
    })
}

//获取按键组类别
export function getButtonGroupType(id){
    return request({
        url:'/btType/info?id='+id,
        method:'get'
    })
}

//删除按键组类别
export function deleteButtonGroupType(id){
    return request({
        url:'/btType/delete?ids='+id,
        method:'get'
    })
}
  
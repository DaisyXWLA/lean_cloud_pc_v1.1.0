import request from '@/utils/request'

// 查询按键类别列表
export function buttonTypeList(query) {
    return request({
      url: '/buttonType/getButtonTypeList',
      method: 'get',
      params: query
    })
}

// 新增/修改按键类别
export function addButtonType(data){
    return request({
        url:'/buttonType/saveOrUpdate',
        method:'post',
        data:data
    })
}


//获取按键类别
export function getButtonType(id){
    return request({
        url:'/buttonType/info?id='+id,
        method:'get'
    })
}

//删除按键类别
export function deleteButtonType(id){
    return request({
        url:'/buttonType/delete?ids='+id,
        method:'get'
    })
}
  

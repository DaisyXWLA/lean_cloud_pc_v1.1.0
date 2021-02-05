import request from "@/utils/request"


// 获取按键列表
export function buttonList(query){
    return request({
        url:'/button/getButtonList',
        method:'post',
        params:query
    })
}

//新增/修改按键
export function addButton(data){
    return request({
        url:'/button/saveOrUpdate',
        method:'post',
        data:data
    })
}

//获取按键详情
export function getButton(id){
    return request({
        url:`/button/allInfo?id=${id}`,
        method:'get'
    })
}

//删除按键
export function deleteButton(id){
    return request({
        url:`/button/delete?ids=${id}`,
        method:'get'
    })
}

//获取按键类别
export function getButtonType(){
    return request({    
        url:`/buttonType/getButtonTypeAll`,
        method:'get'
    })
}
import request from '@/utils/request'

// 查询商品列表
export function commodityList(query){
    return request({
        url:'/prize/list',
        method:'get',
        params:query
    })
}  

// 新增/修改商品
export function addOrUpdateCommodity(data){
    return request({
        url:'/prize/saveOrUpdatePrize',
        method:'post',
        data:data
    })
}


//删除商品或下架商品
export function deleteCommodity(id,status){
    return request({
        url:`/prize/batchSetStatus?ids=${id}&status=${status}`,
        method:'get'
    })
}


//获取商品信息
export function getCommodity(id){
    return request({
        url:'/prize/getById?id='+id,
        method:'get'
    })
}

//上传图片
export function uploadImg(data){
    return request({
        url:'/file/fileUploadList',
        method:'post',
        headers:{'Content-Type':'multipart/form-data'},
        data:data
    })
}
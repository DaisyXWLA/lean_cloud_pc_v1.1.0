import request from "@/utils/request"

//配置列表
export function configList(query){
    return request({
        url:'/conf/getConfigList',
        method:'post',
        params:query
    })
}

//异常配置修改
export function modifyAbnormalConfig(data){
    return request({
        url:`/conf/abnormal/update`,
        method:'post',
        data:data
    })
}

//异常配置详情
export function getAbnormalConfig(){
    return request({
        url:`/conf/abnormal/info`,
        method:'get'
    })
}


//合理化建议配置修改
export function modifyProposalConfig(data){
    return request({
        url:`/conf/proposal/update`,
        method:'post',
        data:data
    })
}

//合理化建议配置详情
export function getProposalConfig(){
    return request({
        url:`/conf/proposal/info`,
        method:'get'
    })
}
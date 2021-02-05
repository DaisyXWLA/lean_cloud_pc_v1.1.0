import request from "@/utils/request"


// 异常数量饼图
export function numberPie(types,bts,beginCreateTime,endCreateTime,isFinish){
    return request({
        url:`/abnormalStatistics/count?types=${types}&bts=${bts}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&isFinish=${isFinish}`,
        method:'get'
    })
}

//异常数量趋势
export function numberHistogram(types,bts,beginCreateTime,endCreateTime,isFinish,dateType){
    return request({
        url:`/abnormalStatistics/countByDate?types=${types}&bts=${bts}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&isFinish=${isFinish}&dateType=${dateType}`,
        method:'get'
    })
}

//异常类型分布饼图
export function typePie(types,bts,beginCreateTime,endCreateTime,isFinish){
    return request({
        url:`/abnormalStatistics/countByType?types=${types}&bts=${bts}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&isFinish=${isFinish}`,
        method:'get'
    })
}

//异常触发时间散点图
export function scatterDiagram(types,buttons,bts,beginCreateTime){
    return request({
        url:`/abnormalStatistics/countByTime?types=${types}&buttons=${buttons}&bts=${bts}&beginCreateTime=${beginCreateTime}`,
        method:'get'
    })
}

//获取按键
export function getButtons(types){
    return request({
        url:`/button/getAll?types=${types}`,
        method:'get'
    })
}
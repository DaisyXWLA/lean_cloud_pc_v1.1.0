import request from '@/utils/request'


//查询合理化建议列表
export function proposalList(query){
    return request({
        url:'/proposal/pageList',
        method:'get',
        params:query
    })
}

//获取合理化建议详情
export function getDetail(id){
    return request({
        url:`/proposal/info?proposalId=${id}`,
        method:'get'
    })
}


//获取提案类别选项
export function  getType(){
    return request({
        url:'/proposalType/list',
        method:'get'
    })
}

//评分标准分组列表草稿
export function groupList(){
    return request({
        url:`/grading/groupList?worksType=1&status=2`,
        method:'get'
    })
}

//启用评分标准草稿
export function startUse(data){
    return request({
        url:`/grading/enable?worksType=${data.worksType}&standardScore=${data.standardScore}`,
        method:'get'
    })
}

//新增/修改分组草稿
export function editGroup(data){
    return request({
        url:`/grading/groupSaveOrUpdate`,
        method:'post',
        data:data
    })
}

//获取分组详情
export function getGroupDetail(id){
    return request({
        url:`/grading/groupInfo?groupId=${id}`,
        method:'get'
    })
}

//删除分组
export function deleteGroup(id){
    return request({
        url:`/grading/groupDelete?groupId=${id}`,
        method:'get'
    })
}


//查询维度列表
export function getDimensionalityList(query){
    return request({
        url:'/grading/dimensionList',
        method:'get',
        params:query
    })
}

//新增/修改维度
export function editDimensionality(data){
    return request({
        url:'/grading/dimensionSaveOrUpdate',
        method:'post',
        data:data
    })
}

//获取维度详情
export function getDimensionalityDetail(id){
    return request({
        url:`/grading/dimensionInfo?dimensionId=${id}`,
        method:'get'
    })
}

//删除维度
export function deleteDimensionality(id){
    return request({
        url:`/grading/dimensionDelete?dimensionId=${id}`,
        method:'get'
    })
}

//获取评分标准
export function getStandard(query){
    return request({
        url:'/grading/getGrading',
        method:'get',
        params:query
    })
}

//获取版本下拉选项
export function getVersion(){
    return request({
        url:'/grading/getVersions?worksType=1',
        method:'get'
    })
}

//提交评审结果
export function submitGrade(data){
    return request({
        url:'/proposal/grading',
        method:'post',
        data:data
    })
}

//评审列表
export function getCheckList(query){
    return request({
        url:'/proposal/gradingList',
        method:'get',
        params:query
    })
}


//获取评审结果
export function getCheckResult(resultId){
    return request({
        url:`/grading/result?resultId=${resultId}`,
        method:'get'
    })
}


//提案状态分布饼图
export function proposalStatusPie(deptId,areaId,proposalTypes,beginCreateTime,endCreateTime){
    return request({
        url:`/proposalStatistics/countByStatus?deptId=${deptId}&areaId=${areaId}&proposalTypes=${proposalTypes}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}`,
        method:'get'
    })
}


//提案类别分布饼状图
export function proposalTypePie(deptId,areaId,auditStatus,beginCreateTime,endCreateTime){
    return request({
        url:`/proposalStatistics/countByProposalType?deptId=${deptId}&areaId=${areaId}&auditStatus=${auditStatus}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}`,
        method:'get'
    })
}

//提案数量趋势图
export function propsoalNumLine(deptId,beginCreateTime,endCreateTime,dateType){
    return request({
        url:`/proposalStatistics/countByDate?deptId=${deptId}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&dateType=${dateType}`,
        method:'get'
    })
}

//参与率趋势图
export function proposalParticipateLine(deptId,beginCreateTime,endCreateTime,dateType){
    return request({
        url:`/proposalStatistics/countByUser?deptId=${deptId}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&dateType=${dateType}`,
        method:'get'
    })
}

//人均提案趋势图
export function proposalIdeaLine(deptId,beginCreateTime,endCreateTime,dateType){
    return request({
        url:`/proposalStatistics/countByUserAvg?deptId=${deptId}&beginCreateTime=${beginCreateTime}&endCreateTime=${endCreateTime}&dateType=${dateType}`,
        method:'get'
    })
}

//员工排行
export function staffRank(query){
    return request({
        url:`/statistics/userProposalStatistics`,
        method:'post',
        params:query
    })
}

//部门排行
export function deptRank(query){
    return request({
        url:`/statistics/deptProposalStatistics`,
        method:'post',
        params:query
    })
}
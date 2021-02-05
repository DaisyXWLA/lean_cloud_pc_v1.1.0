import request from '@/utils/request'

// 查询列表
export function listType(query) {
  return request({
    url: '/proposalType/getProposalTypeList',
    method: 'get',
    params:query
  })
}

// 新增/修改合理化建议类别
export function addProposalType(data) {
  return request({
    url: '/proposalType/saveOrUpdateProposalType',
    method: 'post',
    data: data
  })
}

//删除合理化建议类别
export function deleteProposalType(categoryId) {
  return request({
    url: '/proposalType/deleteProposalType?ids='+categoryId,
    method: 'get'
  })
}

//获取类别详情
export function getProposalType(categoryId) {
  return request({
    url: '/proposalType/getProposalTypeDetail?id='+categoryId,
    method: 'get'
  })
}
import { request } from './common.js'

const API = {
    // 选择消息模板接口
    selectEmailTemplateInfoList(data) {
        return request('/emailTemplate/selectEmailTemplateInfoList', data)
    },
    // 新增消息模板
    addTemplate(data) {
        return request('/emailTemplate/addTemplate', data)
    },
    // 查询消息模板list
    queryEmailTemplateInfoList(data) {
        return request('/emailTemplate/queryEmailTemplateInfoList', data)
    },
    // 编辑消息模板
    updateTemplate(data) {
        return request('/emailTemplate/updateTemplate', data)
    },
    // 删除消息模板
    deleteTemplate(data) {
        return request('/emailTemplate/deleteTemplate', data)
    },
    // 添加新的邮件分类
    add(data) {
        return request('/mailitem/add', data)
    },
    // 删除邮件分类
    delete(data) {
        return request('/mailitem/delete', data)
    },
    // 获取邮件分类详情
    detail(id) {
        return request(`/mailitem/detail/${id}`, '', 'get')
    },
    // 查询邮件分类列表
    list(data) {
        return request('/mailitem/list', data, 'get')
    },
    // 更新邮件分类
    update(data) {
        return request('/mailitem/update', data)
    },
    // 查询邮件分发规则列表
    mailitemruleList(data) {
        return request('/mailitemrule/list', data, 'get')
    },
    // 查询邮件分发规则列表
    mailitemruleUpdate(data) {
        return request('/mailitemrule/update', data)
    },
    // 获取邮件分发规则详情
    mailitemruleDetail(id) {
        return request(`/mailitemrule/detail/${id}`, '', 'get')
    },
    //删除邮件分发规则
    mailitemruleDelete(id) {
        return request('/mailitemrule/delete', id)
    },
    //添加新的邮件规则
    mailitemruleAdd(data) {
        return request('/mailitemrule/add', data)
    },
    //获取当前用户下绑定的邮箱列表
    queryAllBoxInfo() {
        return request('/box/queryAllBoxInfo', '', 'get')
    },
    // 简单查询邮件分类，用于下拉列表
    simpList() {
        return request('/mailitem/simpList', '', 'get')
    },
    //新增投诉分类类目
    addCategory(data) {
        return request('/emailCategory/addCategory', data)
    },
    //查询所有邮件投诉类目
    queryAllCategory(data) {
        return request('/emailCategory/queryAllCategory', data)
    },
    //更新投诉邮件类目
    updateCategory(data) {
        return request('/emailCategory/updateCategory', data)
    },
    //删除投诉邮件类目
    deleteCategory(data) {
        return request('/emailCategory/deleteCategory', data)
    },
    //查询所有邮件投诉类目（权限）
    queryAllCategoryRule(data) {
        return request('/emailCategory/queryAllCategoryRule', data)
    },
    // 查询邮箱列表
    queryBoxInfoByPage(data) {
        return request('/box/queryBoxInfoByPage', data)
    },
    // 查询所有客服
    queryAllUserList() {
        return request('/user/queryAllUserList', '', 'get')
    },
    // 绑定邮箱
    addBox(data) {
        return request('/box/addBox', data)
    },
    // 测试邮箱状态
    checkBoxStatus(data) {
        return request('/box/checkBoxStatus', data)
    },
    // 邮箱编辑反显  GET
    query4UpdateBox(id) {
        return request(`/box/query4UpdateBox/${id}`, '', 'get')
    },
    // 编辑邮箱
    updateBox(data) {
        return request('/box/updateBox', data)
    },
    // 设置客服
    updateCustomer(data) {
        return request('/box/updateCustomer', data)
    },
    // 邮件标记为已读
    markRead(data) {
        return request('/mail/markRead', data)
    },
    //邮件标记为未读
    markUnRead(data) {
        return request('/mail/markUnRead', data)
    },
    // 标记为已在平台内回复
    markReplyOnPlatform(data) {
        return request('/mail/markReplyOnPlatform', data)
    },
    // 发送邮件（新邮件、草稿箱发送邮件）
    sendMail(data) {
        return request('/mail/sendMail', data)
    },
    // 存草稿
    saveDraft(data) {
        return request('/mail/saveDraft', data)
    },
    // 支持单条、批量删除草稿邮件
    batchDelDraft(data) {
        return request('/mail/batchDelDraft', data)
    },
    // 查询草稿箱列表
    queryDraftEmailByPage(data) {
        return request('/mail/queryDraftEmailByPage', data)
    },
    // 查询草稿箱邮件详情
    queryDraftEmailById(id) {
        return request(`/mail/queryDraftEmailById/${id}`, '', 'get')
    },
    // 查询店铺列表
    queryShopNameList() {
        return request('/box/queryShopNameList', '', 'get')
    },
    // 根据店铺shopid名称查询邮箱列表
    queryBoxInfoByShopId(data) {
        return request('/box/queryBoxInfoByShopId', data)
    },
    // 获取所有的店铺列表
    queryAllShopNameList() {
        return request('/box/queryAllShopNameList', '', 'get')
    },
    // 同步邮件
    syncMail(boxId) {
        return request(`/mail/syncMail/${boxId}`, '', 'get')
    },
    // 邮件消息-获取左侧分类列表
    queryItemList(boxId) {
        return request(`/mail/queryItemList/${boxId}`, '', 'get')
    },
    // 查询分类下的邮件列表
    queryEmailByPage(data) {
        return request('/mail/queryEmailByPage', data)
    },
    // 查询对话框邮件详情
    queryChatRoom(messageId) {
        return request(`/mail/queryChatRoom/${messageId}`, '', 'get')
    },
    // 查询邮件详情（非对话框邮件）
    queryEmailDetails(messageId) {
        return request(`/mail/queryEmailDetails/${messageId}`, '', 'get')
    },
    // 保存邮件订单
    saveEmailOrder(data) {
        return request('/mail/saveEmailOrder', data)
    },
    // 回复非站内信邮件(普通邮件)
    replyNormalMail(data) {
        return request('/mail/replyNormalMail', data)
    },
    // 回复站内信邮件(对话框模式回复)
    replyInsideMail(data) {
        return request('/mail/replyInsideMail', data)
    },
    //移动邮件分类
    moveEmailItem(data) {
        return request('/mail/moveEmailItem', data)
    },
     //选择一级投诉消息模板接口
     selectEmailTemplateLevelOne() {
        return request(`/emailTemplate/selectEmailTemplateLevelOne`, '', 'get')
    },
}

export default API
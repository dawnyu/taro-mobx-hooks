import Taro from '@tarojs/taro'
import request from './base'

/**
 * 获取app配置
 * @param data
 */
export const getConfig = (): Promise<any> =>
  request.post({
    action: 'getConfig',
    data: {},
  })
/**
 * 获取用户详情
 * @param data
 */
export const getUser = (): Promise<any> => 
  request.post({
    action: 'getUser',
    data: {},
  })
/**
 * 获取好友
 * @param data
 */
export const getFriend = (data): Promise<any> =>
  request.post({
    action: 'getFriend',
    data,
  })


/**
* 登录
* @param data
*/
export const login = (data): Promise<any> =>
  request.post({
    action: 'login',
    data,
  })

/**
 * 保存用户信息
 * @param data
 */
export const update = (data): Promise<any> =>
  request.post({
    action: 'update',
    data,
  })

/**
 * 获取红包列表
 */

export const redPacket = (): Promise<any> =>
  request.post({
    action: 'redPacket',
    data: {},
  })

/**
 * 交易
 * @param data
 */
export const trade = (data): Promise<any> =>
  request.post({
    action: 'trade',
    data,
  })

/**
 * 获取订单记录
 */
export const getOrderList = (data): Promise<any> =>
  request.post({
    action: 'getOrderList',
    data,
  })


/**
 * 获取兑换记录
 */
export const geTexchangeList = (data): Promise<any> =>
  request.post({
    action: 'exchangeList',
    data,
  })

/**
 * 获取所有类目
 * @param data 
 */
export const getLangs = (data): Promise<any> =>
  request.post({
    action: 'getLangs',
    data,
  })


/**
 * 获取所有类目
 * @param data 
 */
export const getCat = (data): Promise<any> =>
  request.post({
    action: 'getCat',
    data,
  })

/**
 * 获取商品列表
 * @param data 
 */
export const getGoods = (data): Promise<any> =>
  request.post({
    action: 'getGoods',
    data,
  })

/**
 * 获取商品详情
 * @param data 
 */
export const getGood = (data): Promise<any> =>
  request.post({
    action: 'getGood',
    data,
  })

/**
* 收藏操作
* @param data 
*/
export const updateCollect = (data): Promise<any> =>
  request.post({
    action: 'updateCollect',
    data,
  })

/**
* 兑换课程
* @param data 
*/
export const buy = (data): Promise<any> =>
  request.post({
    action: 'buy',
    data,
  })


/**
 * 排行榜
 */

export const rank = (data): Promise<any> =>
  request.post({
    action: 'rank',
    data,
  })

/**
* 系统时间
*/
export const systemTime = (): Promise<any> =>
  request.post({
    action: 'systemTime',
    data: {},
  })

/**
* 获得好友列表
*/
export const getFriends = (data): Promise<any> =>
  request.post({
    action: 'getFriends',
    data,
  })

/**
* 获得签到详情
*/
export const getSign = (): Promise<any> =>
  request.post({
    action: 'getSign',
    data: null,
  })

/**
* 签到
*/
export const sign = (data): Promise<any> =>
  request.post({
    action: 'sign',
    data,
  })

/**
* 兑换
*/
export const getWithdraw = (): Promise<any> =>
  request.post({
    action: 'getWithdraw',
    data: null,
  })

/**
* 查询商品是否被收藏
*/
export const getCollectById = (data): Promise<any> =>
  request.post({
    action: 'getCollectById',
    data,
  })


/**
* 收礼物
*/
export const receiveGood = (data): Promise<any> =>
  request.post({
    action: 'receiveGood',
    data,
  })

/**
* 是否拒绝过
*/
export const isReject = (data): Promise<any> =>
  request.post({
    action: 'isReject',
    data,
  })

/**
* 领取开门红包
*/
export const openRedEnvelope = (data): Promise<any> =>
  request.post({
    action: 'openRedEnvelope',
    data,
  })

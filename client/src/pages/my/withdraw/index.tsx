import Taro, { useState, useDidShow, useShareAppMessage, useContext } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getWithdraw } from '@/service/cloud'
import { TradeEnum } from '@/enum'
import './index.scss'

function Index() {
  const { userInfo } = useContext(store) as any

  useShareAppMessage(res => {
    if (res.from === 'button') {
      const target: any = res.target
      const record: any = records.find(item => item.id === +target.id)
      return {
        title: '我刚免费兑换了这门教程，分享给你吧~',
        path: `/pages/index/index?superior=${userInfo.openid}&goodId=${record.goodId}&share=1`,
        imageUrl: 'http://cdn.geekbuluo.com/res/share.jpg'
      }
    }
  })
  const [records, setRecords] = useState()

  useDidShow(async () => {
    const res: any = await getWithdraw()
    setRecords(res.data)
  })
  const setClipboardData = (data) => {
    Taro.showModal({
      title: '温馨提示',
      content: '下载地址复制成功',
      confirmText: '我知道了',
      confirmColor: 'red',
    })
    Taro.setClipboardData({ data}).then(() => {
      Taro.hideToast()
    })
  }
  
   return (
    <View className='container'>
      <View className='body'>
        {records && records.map(item =>
          <View key={item.id}>
            <View className='trade-time'>{item.tradeTime}</View>
            <View className='record-item'>
              <View className='left'>
                <View>获取方式：{item.type === 5 ? `好友@${item.benefactorNickName}分享` : TradeEnum[item.type]}</View>
                <View>金额：{item.value}资源币</View>
                <View>资源名称：《{item.name}》</View>
              </View>
              <View className='right'>
                <Button
                  className='button share'
                  id={item.id}
                  openType='share'>
                  赠送好友
                </Button>
                <Button
                  className='button down'
                  onClick={() => setClipboardData(item.resource)}>
                    下载地址
                </Button>
              </View>
            </View>
        </View>)}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的资源'
}

export default observer(Index)
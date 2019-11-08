import Taro, { useDidShow, useState, useContext, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getFriends } from '@/service/cloud'
import './index.scss'

function Index() {
  const { userInfo } = useContext(store) as any
  const [list, setList] = useState()
  useShareAppMessage(res => {
    {
      if (res.from === 'button') {
      }
      return {
        title: '一起来答题吧',
        path: `/pages/index/index?id=${userInfo.openid}`,
        imageUrl: 'http://cdn.geekbuluo.com/share_image%20%281%29.jpg'
      }
    }
  })
  
  useDidShow(async () => {
    Taro.showLoading()
    const { data } = await getFriends({ openid: userInfo })
    Taro.hideLoading()
    setList([...data])
  })
  return (
    <View className='container'>
      <View className='header-line'>
        <Text>好友昵称</Text>
        <Text>带来收益</Text>
      </View>
      <View className='body'>
        {list && list.length > 0 && list.map((item, index) => 
        <View
          className='record-item'
          key={item}
        >
          <View className='left'>
            <View>{index + 1}</View>
            <Image src={item.avatarUrl} />
            <View>{item.nickName}</View>
          </View>
          <View className='right'>
            <View>
                <Text className='iconfont icon-yuanbao' />{item.balance}
            </View>
            </View>
        </View>)}
        {list && list.length === 0 &&
        <View className='nofriends'>
          <View> 还没有好友哦~ </View>
          <Button openType='share'>添加好友</Button>
        </View>}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '好友列表'
}

export default observer(Index)
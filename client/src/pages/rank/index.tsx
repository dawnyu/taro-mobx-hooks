import Taro, { useDidShow, useState } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import {rank} from '@/service/cloud'
import './index.scss'

function Index() {
  const [list, setList] = useState()
  const [lastList, setLastList] = useState()
  useDidShow(async () => {
    Taro.showLoading()
    const { data } = await rank({})
    Taro.hideLoading()
    setList([...data])
    setLastList([...data.slice(3,10)])
  }) 
  return (
    <View className='container'>
      {list && list.length > 0 && 
        <View className='header'>
          <View className='three'>
            <Image src={list && list[0] && list[0].avatarUrl} />
            <View>{list[0].nickName}</View>
            <View className='nickName'><Text className='iconfont icon-yuanbao' />{list[0].balance}</View>
          </View>
          <View className='three'>
            <Image src={list && list[1] && list[1].avatarUrl} />
            <View>{list[1].nickName}</View>
            <View className='nickName'><Text className='iconfont icon-yuanbao' />{list[1].balance}</View>
          </View>
          <View className='three'>
            <Image src={list && list[2] && list[2].avatarUrl} />
            <View>{list[2].nickName}</View>
            <View className='nickName'><Text className='iconfont icon-yuanbao' />{list[2].balance}</View>
          </View>
        </View>}
      <View className='body'>
        {lastList && lastList.map((item, index) => 
        <View
          className='user-item'
          key={item}
        >
          <View className='left'>
            <View>{index + 3}</View>
            <Image src={item.avatarUrl} />
            <View>{item.nickName}</View>
          </View>
          <View className='right'><Text className='iconfont icon-yuanbao' />{item.balance}</View>
        </View>)}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '排行榜'
}

export default Index
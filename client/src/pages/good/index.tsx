import Taro, { useRouter, useDidShow, useState, useContext, useShareAppMessage } from '@tarojs/taro'
import store from '@/store/index'
import { getGood, updateCollect, buy, getCollectById } from '@/service/cloud'
import { observer } from '@tarojs/mobx'
import { getUserinfo } from '@/utils'
import { View, Text, Image, Button, Swiper, SwiperItem} from '@tarojs/components'
import './index.scss'

function Good() {
  const { getUser } = useContext(store) as any
  const router = useRouter()
  const [good, setGood] = useState()
  const [collect, setCollect] = useState(1)
  useShareAppMessage(() => {
    const openid = Taro.getStorageSync('openid')
    return {
      title: `这个${good.category}资源找好久了，一起来看看吧`,
      path: `/pages/index/index?superior=${openid}`,
      imageUrl: 'http://cdn.geekbuluo.com/res/share.jpg'
    }
  })
  useDidShow(async() => {
    Taro.showLoading({
      title: '加载中'
    })
    const { data } = await getGood({ goodId: router.params.id })
    Taro.hideLoading()
    setGood(data)
    getCollectById({ goodId: router.params.id }).then(res => {
      setCollect(res.data)
    })
    Taro.setNavigationBarTitle({
      title: data.title
    })
  })
  const buyHandle = async(userinfo) => {
    
    const user = await getUser()
    user.userid ? tradeHandle() : getUserinfo(userinfo, tradeHandle)
  }
  const tradeHandle = async() => {
    Taro.showLoading({
      title: '加载中'
    })
    try {
      if (!good.id) {
        Taro.showToast({
          title: '未查询到课程详情',
          icon: 'none'
        })
        return
      }
      const { status, data, message } = await buy({ goodId: good.id})
      Taro.hideLoading()
      if (status === 0) {
        Taro.showToast({
          title: '兑换成功',
          icon: 'none'
        })
        Taro.showModal({
          title: '兑换成功',
          content: '下载链接已复制到粘贴板，快去下载吧，在兑换记录里面可以再次复制链接哦',
          confirmText: '我知道了',
          confirmColor: 'red',
        })
        Taro.setClipboardData({
          data,
        }).then(() => {
          Taro.hideToast()
        })
      } else {
        Taro.showToast({
          title: message,
          icon: 'none'
        })
      }
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none',
      })
    }
  }
  const previewImage = (current) => {
    Taro.previewImage({
      urls: good.images,
      current
    })
  }
  const collectHandle = async() => {
    const col = Math.abs(collect - 1)
    const { status, message } = await updateCollect({
      status: col,
      goodId: good.id,
    })
    if (status === 0) {
      setCollect(col)
      Taro.showToast({
        title: ['收藏成功', '已取消收藏'][col],
        icon: 'none'
      })
    } else {
      Taro.showToast({
        title: message,
        icon: 'none'
      })
    }
  }
  return (
    <View className='container'>
      <View className='swiper'>
        <Swiper
          indicatorColor='#999'
          className='swiper'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay>
          {good && good.images && good.images.map((item) => (
            <SwiperItem key={item}>
              <Image src={item}
                onClick={() => previewImage(item)}
              />
            </SwiperItem>
          ))}
        </Swiper>
      </View>
      <View className='good'>
        <View className='left'>
          <View className='price'>
            <Text className='newprice'>{good.price * good.discount}</Text>{' '}资源币
            <Text className='oldprice'>{good.price}资源币</Text>
          </View>
          <View className='title'>{good.title}</View>
          
        </View>
        
      </View>
      <View className='good-detail'>
        简介
        <View className='good-detail-info'>
          {good.goodDetails}
        </View>
      </View>
      <View className='bottom'>
        <View className='share'>
          <View className='at-icon at-icon-external-link'></View>
          <View>分享</View>
          <Button
            className='share-btn'
            openType='share' />
        </View>
        <View
          onClick={() => collectHandle()}
          className='collect'>
          <View
            className='at-icon at-icon-star-2'
            style={collect === 0 ? 'color: rgb(253, 207, 2);' : ''}></View>
          <View>收藏</View>
        </View>
        <Button
          className='buy'
          openType='getUserInfo'
          onGetUserInfo={buyHandle}
          type='primary'
          lang='zh_CN'
        >
          立即兑换
        </Button>
      </View>
    </View>
  )
}
Good.options = {
  addGlobalClass: true
}
Good.config = {
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
}
export default observer(Good);
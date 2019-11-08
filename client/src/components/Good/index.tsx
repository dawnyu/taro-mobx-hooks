import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

function Good({ data }) {
  const navigateTo = () => {
    Taro.navigateTo({
      url: `/pages/good/index?id=${data.id}`
    })
  }
  return (
    <View
      onClick={navigateTo}
      className='good-container'
    >
      <View className='left'>
        <Image
          className='image'
          src={data.images[0]}></Image>
      </View>
      <View className='center'>
        <View className='title'>{data.title}</View>
        <View className='tags'>
          {data && data.tags && data.tags.map(item => (
            <Text key={item}>{item}</Text>
        ))}</View>
      </View>
      <View className='right'>
        <View className=''>{data.price * data.discount}
        <Text className='iconfont icon-jifenshangcheng'/>
        </View>
      </View>
    </View>
  )
}
Good.options = {
  addGlobalClass: true
}
export default Good;
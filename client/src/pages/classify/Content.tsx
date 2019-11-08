import Taro, { useState } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default function Index(props) {
  const { cat = [], index, lang } = props
  const [cats, setCats] = useState()
  setCats(cat.filter(item => item.type === index))
  const navigateTo = (index) => {
    Taro.navigateTo({
      url: `/pages/cat/index?index=${index}&lang=${lang}&cat=${JSON.stringify(cats)}`
    })
  }
  return (
    <View className='content'>
      {cats && cats.map((item, i) => (
        <View
          onClick={() => navigateTo(i)}
          className='item'
          key={item.id}>
          <Image
            className='image'
            src={'http://res.geekbuluo.com/res/' + item.image} />
          <View className='title'>{item.title}</View>
        </View>
      ))}
    </View>
  )
}

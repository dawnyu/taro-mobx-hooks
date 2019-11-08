import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import Good from '@/components/Good'
import './index.scss';

function Record({ good }) {
  
  return (
    <View>
      {
        good && good.map(item =>
          <View
            className='good-item'
            key={item.id}>
            <Good data={item} />
          </View>)
      }
    </View>
  )
}
Good.options = {
  addGlobalClass: true
}
export default Record;
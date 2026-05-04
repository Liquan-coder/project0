import "./global.css"; 
import { Text, View } from 'react-native';

// 2. 把 SafeAreaProvider 也一起引入
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; 
export default function App() {
  return (
<SafeAreaProvider>
      
      <SafeAreaView className="flex-1 bg-blue-300 items-center justify-center">
        <View className="bg-white p-6 rounded-2xl shadow-lg">
          <Text className="text-black text-3xl font-bold text-center">
            雙平台完全制霸！🚀
          </Text>
          <Text className="text-gray-600 text-lg mt-4 text-center">
            手機和網頁都完美顯示啦！
          </Text>
        </View>
      </SafeAreaView>

    </SafeAreaProvider>
  );
}
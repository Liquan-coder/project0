import { Text, View, StyleSheet } from 'react-native';

export default function App() {
   return (
      <View 
        style={styles.container}
      >
        <Text style={styles.Text}>Hello expo.</Text>
      </View>
   );
  }
   const styles = StyleSheet.create({
      container:{ 
        flex: 1,
        justifyContent: 'Center',
        alignItems: 'Center',
        backgroundColor: "#cdabab",
      },
      Text:{
        fontSize: 32,
        color: "#ffff"
      }
   })
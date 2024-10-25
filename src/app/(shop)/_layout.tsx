import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontAwesome} from '@expo/vector-icons'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} {...props} style={{ color: '#D9D5EC' }} />;
}

const TabsLayout = () => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea} >
      <Tabs 
        screenOptions={{
          tabBarActiveTintColor: '#D9D5EC',
          // Change out the gray color scheme later
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            // headerShown: false,
            title: 'shop',
            tabBarIcon(props) {
              return <TabBarIcon {...props} name='shopping-cart' />
            }
          }} 
        />
        <Tabs.Screen 
          name="orders" 
          options={{
            // headerShown: false,
            title: 'orders',
            tabBarIcon(props) {
              return <TabBarIcon {...props} name='book' />
            }
          }} 
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  }
})
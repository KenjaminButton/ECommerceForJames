import {View, Text, StyleSheet, Alert, Platform, TouchableOpacity, FlatList, Image} from 'react-native';
import { useCartStore } from '../store/cart-store';
import { StatusBar } from 'expo-status-bar';

type CartItemType = {
  id: number;
  title: string;
  image: any;
  price: number;
  quantity: number;
}

type CartItemProps = {
  item: CartItemType
  onRemove: (id: number) => void
  onIncrement: (id: number) => void
  onDecrement: (id: number) => void
}

const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemove
}: CartItemProps) => {
  console.log('ITEM:::', item);
  return (
    <View style={styles.cartItem}>
      <Image 
        source={item.heroImage} 
        style={styles.itemImage} 
        onError={(error) => console.log('Error loading image:', error.nativeEvent.error)}

      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetails}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}></View>
        <TouchableOpacity
          onPress={ () => onDecrement(item.id)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
        

}

export default function Cart() {
  const {
    items, 
    removeItem, 
    incrementItem, 
    decrementItem, 
    getTotalPrice,
  } = useCartStore();

  const handleCheckout = () => {
    Alert.alert('Proceeding to Checkout', `Total amount: $${getTotalPrice()}`)
  }

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto" }/>
      
      <FlatList 
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={ ( {item}) => (
          <CartItem 
            item={item} 
            onRemove={removeItem} 
            onIncrement={incrementItem} 
            onDecrement={decrementItem}
          />
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity
          onPress={handleCheckout}
          style={styles.checkoutButton}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* <Text>
        Eric Cartman is a fictional character from the animated television series "South Park," created by Trey Parker and Matt Stone. Voiced by Parker, Cartman is known for his outrageous behavior, dark humor, and manipulative personality. Often portrayed as selfish, bigoted, and politically incorrect, he frequently engages in schemes that reflect his desire for power and control. Despite his flaws, Cartman's character often serves as a satirical representation of societal issues, making him both controversial and memorable. Over the years, he has become an iconic figure in pop culture, embodying the show's sharp critique of American life and values.
      </Text> */}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cartList: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#D9D5EC', 
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
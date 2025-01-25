// --- BASE ---
import { createContext, ReactNode, useState } from 'react';

// --- INTERFACES ---
import { ICartItem } from './Interfaces';

interface IProps {
	children: ReactNode;
}

type TCartContext = (value: ICartItem[]) => void;

export const CartContext = createContext<ICartItem[]>([]);
export const CartUpdateContext = createContext<TCartContext>(() => () => []);

const CartProvider = (props: IProps) => {
	const storedItems = localStorage.getItem('items');

	let defaultItems: ICartItem[] = [];

	if (typeof storedItems === 'string' && storedItems !== null) {
		defaultItems = JSON.parse(storedItems);
	}

	const [cartItems, setCartItems] = useState<ICartItem[]>(defaultItems);

	function updateCart(items: ICartItem[]) {
		console.log({ items });

		// if (items !== null) {
		localStorage.setItem('items', JSON.stringify(items));
		// } else {
		// localStorage.removeItem('items');
		// }

		setCartItems(items);
	}

	// function addToCart(item: ICartItem) {
	// console.log(item);
	// 	const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

	// 	if (isItemInCart) {
	// 		setCartItems(
	// 			cartItems.map((cartItem) =>
	// 				cartItem.id === item.id
	// 					? { ...cartItem, quantity: cartItem.quantity + 1 }
	// 					: cartItem
	// 			)
	// 		);
	// 	} else {
	// 		setCartItems([...cartItems, { ...item, quantity: 1 }]);
	// }
	// }

	// const removeFromCart = (item) => {
	// 	const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

	// 	if (isItemInCart.quantity === 1) {
	// 		setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
	// 	} else {
	// 		setCartItems(
	// 			cartItems.map((cartItem) =>
	// 				cartItem.id === item.id
	// 					? { ...cartItem, quantity: cartItem.quantity - 1 }
	// 					: cartItem
	// 			)
	// 		);
	// 	}
	// };

	// const clearCart = () => {
	// 	setCartItems([]);
	// };

	// const getCartTotal = () => {
	// 	return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
	// };

	// useEffect(() => {
	// 	localStorage.setItem("cartItems", JSON.stringify(cartItems));
	// }, [cartItems]);

	// useEffect(() => {
	// 	const cartItems = localStorage.getItem("cartItems");
	// 	if (cartItems) {
	// 		setCartItems(JSON.parse(cartItems));
	// 	}
	// }, []);

	return (
		<CartContext.Provider value={cartItems}>
			<CartUpdateContext.Provider value={updateCart}>{props.children}</CartUpdateContext.Provider>
		</CartContext.Provider>
	);
};

export { CartProvider };

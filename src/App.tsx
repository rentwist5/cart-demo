// --- BASE ---
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// --- ASSETS ---
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

// --- CONTEXTS ---
import { CartProvider } from './CartContext.tsx';

// --- PAGES ---
import Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import ErrorNotFound from './pages/ErrorNotFound.tsx';
import Index from './pages/Index.tsx';
import People from './pages/People.tsx';
import Products from './pages/Products.tsx';
import Search from './pages/Search.tsx';
import Summary from './pages/Summary.tsx';

function App() {
	return (
		<CartProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/cart"
						element={<Cart />}
					/>
					<Route
						path="/checkout"
						element={<Checkout />}
					/>
					<Route
						path="/people"
						element={<People />}
					/>
					<Route
						path="/products"
						element={<Products />}
					/>
					<Route
						path="/search"
						element={<Search />}
					/>
					<Route
						path="/summary"
						element={<Summary />}
					/>
					<Route
						path="/"
						element={<Index />}
					/>
					<Route
						path="*"
						element={<ErrorNotFound />}
					/>
				</Routes>
			</BrowserRouter>
		</CartProvider>
	);
}

export default App;

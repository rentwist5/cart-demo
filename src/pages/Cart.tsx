// --- BASE ---
import { ReactNode, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Breadcrumb, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

// --- ASSETS ---

// --- COMPONENTS ---
import Footer from '../components/Footer.tsx';
import Navigation from '../components/Navigation.tsx';
import ProductModal from '../components/ProductModal.tsx';

// --- CONTEXTS ---
import { CartContext, CartUpdateContext } from '../CartContext.tsx';

// --- INTERFACES ---
import { ICartItem } from '../Interfaces.ts';

const Cart = () => {
	const cartItems = useContext(CartContext);
	const cartUpdate = useContext(CartUpdateContext);

	const navigate = useNavigate();

	// --- STATES ---
	const [alertMessage, setAlertMessage] = useState<ReactNode | string>('');
	const [alertShown, setAlertShown] = useState<boolean>(false);
	const [alertStatus, setAlertStatus] = useState<string>('info');

	const [modalShown, setModalShown] = useState<boolean>(false);

	const [product, setProduct] = useState<ICartItem | null>(null);

	function drawCart() {
		let subTotal = 0;

		const tBodyContent: ReactNode[] = [];

		if (cartItems.length === 0) {
			tBodyContent.push(
				<tr key="cart-row-0">
					<td
						className="text-center"
						colSpan={6}>
						<div className="mb-3 mt-2">No products in your cart.</div>
						<Button
							className="mb-2"
							onClick={() => navigate('/products')}
							variant="primary">
							View Products
						</Button>
					</td>
				</tr>
			);
		} else {
			let i = 1;

			// We could do this in an .map function, but it's not a simple list, and may change if requested.  As such, we'll use a traditional for loop to make it easier to read for now.
			for (const cartItem of cartItems) {
				const ext = cartItem.price * cartItem.qty;

				// Destructure the object so we can call each property as a value. Makes it easier to change code later. We don't HAVE to do it this way, but it makes it easier to read.
				const { id, price, qty, stock, thumbnail, title } = cartItem;

				subTotal += ext;

				tBodyContent.push(
					<tr key={`cart-row-${i}`}>
						<td className="text-center">
							<Button
								onClick={() => deleteItem(id)}
								size="sm"
								title={`Delete item #${i} - ${title}.`}
								variant="danger">
								X
							</Button>
						</td>
						<td>
							<img
								className="img-responsive"
								src={thumbnail}
								style={{ height: '2em', width: 'auto' }}
							/>
							<Button
								onClick={() => viewProduct(cartItem)}
								style={{ padding: '0 1em' }}
								title={`View product ${title}.`}
								variant="link">
								{title}
							</Button>
						</td>
						<td className="text-center">
							{/* Make a minimum width for the select dropdown for mobile version. */}
							<Form.Select
								defaultValue={qty}
								onChange={(e) => updateCartQty(id, e.currentTarget.value)}
								style={{ minWidth: '4em' }}>
								{drawQtyDropdown(stock)}
							</Form.Select>
						</td>
						<td className="text-end">
							<NumericFormat
								displayType={'text'}
								prefix={'$'}
								thousandSeparator={true}
								value={price.toFixed(2) ?? ''}
							/>
						</td>
						<td className="text-end">
							<NumericFormat
								displayType={'text'}
								prefix={'$'}
								thousandSeparator={true}
								value={ext.toFixed(2)}
							/>
						</td>
					</tr>
				);

				i++;
			}
		}

		return (
			<>
				<Table
					bordered
					responsive
					striped>
					<thead>
						<tr>
							<th className="text-center">#</th>
							<th>Title</th>
							<th className="text-center">Qty</th>
							<th className="text-end">Price</th>
							<th className="text-end">Ext</th>
						</tr>
					</thead>
					<tbody>{tBodyContent}</tbody>
					<tfoot>
						<tr>
							<td>&nbsp;</td>
							<td colSpan={3}>Sub-Total</td>
							<td className="text-end">
								<NumericFormat
									displayType={'text'}
									prefix={'$'}
									thousandSeparator={true}
									value={subTotal.toFixed(2)}
								/>
							</td>
						</tr>
					</tfoot>
				</Table>

				{cartItems.length > 0 && (
					<>
						<div>Shipping and taxes are not calculated for this exercise.</div>

						<div className="mb-4 text-end">
							<Button
								onClick={() => navigate('/checkout')}
								variant="success">
								Check Out
							</Button>
						</div>
					</>
				)}
			</>
		);
	}

	function drawQtyDropdown(qty: number) {
		const quantities: ReactNode[] = [];

		for (let i = 1; i <= qty; i++) {
			quantities.push(
				<option
					key={`option-qty-${i}`}
					value={i}>
					{i}
				</option>
			);
		}

		return quantities;
	}

	function deleteItem(cartItemId: number) {
		console.log(cartItemId);

		let deletedTitle = '';
		let foundFlag = false;

		const newCartItems = [];

		for (const cartItem of cartItems) {
			const { id, title } = cartItem;

			if (id === cartItemId) {
				foundFlag = true;

				deletedTitle = title;
			} else {
				newCartItems.push(cartItem);
			}
		}

		if (!foundFlag) {
			setAlertMessage(<>Product not deleted.</>);

			setAlertStatus('danger');
		} else {
			setAlertMessage(
				<>
					Product <strong>{deletedTitle}</strong> was deleted.
				</>
			);
			setAlertStatus('success');

			cartUpdate(newCartItems);
		}

		setAlertShown(true);
	}

	function handleClose() {
		setModalShown(false);
	}

	function updateCartQty(cartItemId: number, inputQty: string) {
		// Make the input quantity a number, since by default, it's a string when passed in.
		const qty = parseInt(inputQty, 10);

		// Store a title so we can show it on the message later.
		let title = '';

		// Start a new empty array of cart items.
		const newCartItems: ICartItem[] = [];

		// See if the item is already in the cart and update the qty.  We could use a filter to find the value and a self update, but we'll keep it simple and easier to follow.
		for (const oldItem of cartItems) {
			if (oldItem.id === cartItemId) {
				oldItem.qty = qty;

				title = oldItem.title;
			}

			newCartItems.push(oldItem);
		}

		// Push the new cart to replace the old one saved in the context.
		cartUpdate(newCartItems);

		setAlertMessage(
			<>
				Product <strong>{title}</strong> quantity was updated to <strong>{qty.toString()}</strong>!
			</>
		);
		setAlertShown(true);
		setAlertStatus('success');
	}

	function viewProduct(item: ICartItem) {
		setProduct(item);

		setModalShown(true);
	}

	return (
		<>
			<Navigation />

			<Alert
				dismissible
				onClose={() => setAlertShown(false)}
				show={alertShown}
				variant={alertStatus}>
				<Container>{alertMessage}</Container>
			</Alert>

			<ProductModal
				cartItems={cartItems}
				handleClose={handleClose}
				product={product}
				setShow={setModalShown}
				show={modalShown}
			/>

			<Container className="mt-3">
				<h2>Cart</h2>

				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/' }}>
								Home
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Cart</Breadcrumb.Item>
						</Breadcrumb>
					</Col>
				</Row>

				{/* For a full-blown mobile application, we would build a collapsing responsive table, where in desktop, it stretches the size of the screen, but on mobile, it tiles. For this simple version, we will just use a normal table. */}
				{drawCart()}
			</Container>

			<Footer />
		</>
	);
};

export default Cart;

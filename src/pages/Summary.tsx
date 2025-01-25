// --- BASE ---
import { ReactNode, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Breadcrumb, Button, Col, Container, Card, Row, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

// --- CLASSES ---
import User from '../classes/User.ts';

// --- COMPONENTS ---
import Navigation from '../components/Navigation.tsx';
import Footer from '../components/Footer.tsx';

// --- CONTEXTS ---
import { CartUpdateContext } from '../CartContext.tsx';

// --- INTERFACES ---
import { IUser } from '../classes/User.ts';

const Summary = () => {
	// --- CLASSES --- ---
	const userClass = new User();

	// Get the stored user, which may return null.
	const storedUser = localStorage.getItem('user');

	// If the stored user is an object, the we can parse it.  We should run this through a function that does a check on each property of the class.
	const finalUser: IUser | null = storedUser !== null && typeof storedUser === 'string' ? (JSON.parse(storedUser) as IUser) : null;

	const user: IUser = finalUser ?? userClass;

	// Order is passed via session here, where normally, we just pass the ID and get the order from the API.
	const storedOrder = sessionStorage.getItem('order');

	const order = storedOrder !== null && typeof storedOrder === 'string' ? JSON.parse(storedOrder) : null;

	// Format the order date into something a typical American would understand.
	const orderDate = new Date(order?.date_created ?? null).toLocaleDateString('en', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	// --- CONTEXTS ---
	const cartUpdate = useContext(CartUpdateContext);

	const navigate = useNavigate();

	// --- STATES ---
	const [alertMessage, setAlertMessage] = useState<ReactNode | string>('');
	const [alertShown, setAlertShown] = useState<boolean>(false);
	const [alertStatus, setAlertStatus] = useState<string>('info');

	// The cart is stored in the order since we are going to erase the cart, which will mean it won't show on the summary page. So we get the cart here.
	const cartItems = order.cart;

	function drawSummary() {
		console.log(cartItems);

		let subTotal = 0;

		const tBodyContent: ReactNode[] = [];

		if (cartItems.length === 0) {
			tBodyContent.push(
				<tr key="cart-row-0">
					<td
						className="text-center"
						colSpan={6}>
						<div className="mb-3">No products in your cart.</div>
						<Button
							onClick={() => navigate('/products')}
							variant="outline-primary">
							View Products
						</Button>
					</td>
				</tr>
			);
		} else {
			let i = 1;

			for (const cartItem of cartItems) {
				const ext = cartItem.price * cartItem.qty;

				subTotal += ext;

				tBodyContent.push(
					<tr key={`cart-row-${i}`}>
						<td className="text-center">{i}</td>
						<td>{cartItem.title}</td>
						<td className="text-center">{cartItem.qty}</td>
						<td className="text-end">
							<NumericFormat
								displayType={'text'}
								prefix={'$'}
								thousandSeparator={true}
								value={cartItem?.price?.toFixed(2) ?? ''}
							/>
						</td>
						<td className="text-end">
							<NumericFormat
								displayType={'text'}
								prefix={'$'}
								thousandSeparator={true}
								value={ext?.toFixed(2) ?? ''}
							/>
						</td>
					</tr>
				);

				i++;
			}
		}

		return (
			<Table
				bordered
				responsive
				striped>
				<thead>
					<tr>
						<th className="text-center">#</th>
						<th>Title/SKU</th>
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
		);
	}

	// Normally here, we would make a call to a backend API to get the order information (which also gives us confirmation that the order was saved).  Since we're doing everything in sessions and localStorage, we will only simulate the message.
	useEffect(() => {
		// We make a fetch, and if it is ok, we show the message, otherwise an error.
		if (true === true) {
			setAlertMessage('Thank you for your purchase!');
			setAlertStatus('success');
		} else {
			setAlertMessage('There was an error with your order.');
			setAlertStatus('danger');
		}

		cartUpdate([]);

		setAlertShown(true);
	}, []);

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

			<Container className="mt-3">
				<h2>Order Summary</h2>

				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/' }}>
								Home
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Order Summary</Breadcrumb.Item>
						</Breadcrumb>
					</Col>
					<Col></Col>
				</Row>

				<p>Thank you for your purchase! Below is a summary of your order.</p>

				<h4>Information</h4>
				<Row>
					<Col
						className="mb-3"
						md={6}>
						<Card>
							<Card.Body>
								<Card.Title>Order Info</Card.Title>
								<Card.Text>
									Order Num: {order?.id ?? ''}
									<br />
									Order Date: {orderDate.toString()}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col
						className="mb-3"
						md={6}>
						<Card>
							<Card.Body>
								<Card.Title>Your Info</Card.Title>
								<Card.Text>
									<strong>
										{user?.first_name ?? ''} {user?.last_name ?? ''}
									</strong>
									<br />
									{user?.street_address ?? ''}
									<br />
									{user?.city ?? ''} {user?.state ?? ''} {user?.zip_code ?? ''}
									<br />
									<span>Email:</span> {user?.email ?? ''}
									<br />
									<span>Phone:</span> {user?.phone ?? ''}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<h4>Purchased Products</h4>
				{drawSummary()}

				<div className="mb-3 text-end">
					<Button
						onClick={() => window.print()}
						variant="success">
						Print Order
					</Button>
				</div>
			</Container>

			<Footer />
		</>
	);
};

export default Summary;

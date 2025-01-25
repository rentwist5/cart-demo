// --- BASE ---
import { ReactNode, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Breadcrumb, Button, Col, Container, FloatingLabel, Form, Row, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

// --- DEBUG --- This should not be here normally. It's just here to allow faker on the web site for Sean.
import { faker } from '@faker-js/faker';

// --- CLASSES ---
import CreditCard from '../classes/CreditCard.ts';
import User from '../classes/User.ts';

// --- COMPONENTS ---
import Navigation from '../components/Navigation.tsx';
import Footer from '../components/Footer.tsx';

// --- CONTEXTS ---
import { CartContext } from '../CartContext.tsx';

// --- INTERFACES ---
import { ICreditCard, ICreditCardErrors } from '../classes/CreditCard.ts';
import { IUser, IUserErrors } from '../classes/User.ts';

const Checkout = () => {
	// --- CLASSES --- ---
	const creditCardClass = new CreditCard();
	const creditCardFieldDisplayMap = creditCardClass.propToDisplayMap();
	const userClass = new User();
	const userFieldDisplayMap = userClass.propToDisplayMap();

	// Get the stored user, which may return null.
	const storedUser = localStorage.getItem('user');

	// If the stored user is an object, the we can parse it.  We should run this through a function that does a check on each property of the class.
	const finalUser: IUser | null = storedUser !== null && typeof storedUser === 'string' ? (JSON.parse(storedUser) as IUser) : null;

	const cartItems = useContext(CartContext);

	// --- ROUTER ---
	const navigate = useNavigate();

	// --- STATES ---
	const [alertMessage, setAlertMessage] = useState<ReactNode | string>('');
	const [alertShown, setAlertShown] = useState<boolean>(false);
	const [alertStatus, setAlertStatus] = useState<string>('info');

	const [creditCard, setCreditCard] = useState<ICreditCard | null>(creditCardClass);
	const [user, setUser] = useState<IUser | null>(finalUser ?? userClass);

	/* ---
	Store errors for the user and credit card. Normally, we would have a configuration of the types of errors and conditions each property. Here, for the sake of time, we're just going to save the field and a boolean of if we should show an error or not.
	--- */
	const [errorsCreditCard, setErrorsCreditCard] = useState<ICreditCardErrors>({});
	const [errorsUser, setErrorsUser] = useState<IUserErrors>({});

	// --- FUNCTIONS ---
	// function buildOptsExpMonths() {
	// 	const months: ReactNode[] = [];

	// 	months.push(
	// 		<option
	// 			key={`option-exp-month-0`}
	// 			value={0}>
	// 			-&gt;
	// 		</option>
	// 	);

	// 	for (let month = 1; month <= 12; month++) {
	// 		months.push(
	// 			<option
	// 				key={`option-exp-month-${month}`}
	// 				value={month}>
	// 				{month}
	// 			</option>
	// 		);
	// 	}

	// 	return months;
	// }

	// function buildOptsExpYears() {
	// 	const years: ReactNode[] = [];

	// 	const currentYear = new Date().getFullYear();

	// 	years.push(
	// 		<option
	// 			key={`option-exp-year-0`}
	// 			value={0}>
	// 			-&gt;
	// 		</option>
	// 	);

	// 	for (let year = currentYear; year <= currentYear + 10; year++) {
	// 		years.push(
	// 			<option
	// 				key={`option-exp-year-${year}`}
	// 				value={year}>
	// 				{year}
	// 			</option>
	// 		);
	// 	}

	// 	return years;
	// }

	function drawSummary() {
		let subTotal = 0;

		const tBodyContent: ReactNode[] = [];

		if (cartItems.length === 0) {
			tBodyContent.push(
				<tr>
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
					<tr key={`cart-row-${cartItem.id}`}>
						<td className="text-center">{i}</td>
						<td>
							<img
								className="img-responsive"
								src={cartItem.thumbnail}
								style={{ height: '2em', width: 'auto' }}
							/>
							<span className="ms-2">{cartItem.title}</span>
						</td>
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
			<>
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
			</>
		);
	}

	/* ---
	This function would normally be inside a debug folder where it is imported in for testing only. It should not be part of the source code. For this exercise, we're going to treat it like a normal function.
	--- */
	function fillValues(isIncorrect: boolean = false) {
		const currentYear = new Date().getFullYear();

		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();

		if (isIncorrect) {
			setCreditCard({
				card_cvv: faker.string.alpha(3),
				card_number: faker.string.alpha(24),
				exp_date: faker.string.alpha(2) + '/' + faker.string.alpha(4),
				name_on_card: `${firstName} ${lastName}`
			});

			setUser({
				city: faker.location.city(),
				email: faker.internet.email() + faker.number.int(100),
				first_name: faker.person.firstName(),
				last_name: faker.person.lastName(),
				phone: faker.phone.number(),
				state: faker.location.state(),
				street_address: faker.location.streetAddress(),
				zip_code: faker.location.zipCode()
			});
		} else {
			setCreditCard({
				card_cvv: faker.finance.creditCardCVV(),
				card_number: faker.finance.creditCardNumber(),
				exp_date: (faker.number.int(11) + 1).toString() + '/' + (faker.number.int(10) + currentYear + 1).toString(),
				name_on_card: `${firstName} ${lastName}`
			});

			setUser({
				city: faker.location.city(),
				email: faker.internet.email(),
				first_name: firstName,
				last_name: lastName,
				phone: faker.phone.number(),
				state: faker.location.state(),
				street_address: faker.location.streetAddress(),
				zip_code: faker.location.zipCode()
			});
		}
	}

	function handleSetCardValue(field: string, value: string): void {
		const newCard = creditCard !== null ? { ...creditCard } : new CreditCard();

		newCard[field as keyof typeof newCard] = value.toString();

		setCreditCard(newCard);
	}

	function handleSetUserValue(field: string, value: string): void {
		const newUser = user !== null ? { ...user } : new User();

		newUser[field as keyof typeof newUser] = value;

		setUser(newUser);
	}

	function isValidEmail(mail: string): boolean {
		const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

		return regex.test(mail);
	}

	// Check that the user fields are valid. We could do this in the class, with field type checks. But this is really out of scope for this exercise.
	function validateForm() {
		let errorMessage: string | null = null;
		let errorsFlag = false;

		// Since everything is required and is a string for users, we'll check for nulls. Normally, we would have a type and rule configuration for each property and run automated checks this way.
		const newErrorsUser: IUserErrors = {};
		for (const prop in user) {
			if (user[prop as keyof typeof user] === null) {
				errorsFlag = true;

				errorMessage = userFieldDisplayMap[prop as keyof typeof userFieldDisplayMap] + ' is required.';
			} else {
				errorMessage = null;
			}
			newErrorsUser[prop as keyof typeof newErrorsUser] = errorMessage;
		}

		setErrorsUser(newErrorsUser);

		// Here we do some manual checks, since we don't have a configuration setup on the user class since it's way beyond the scape of this exercise.
		if (user !== null) {
			if (user.email !== null && !isValidEmail(user.email)) {
				errorsFlag = true;

				setErrorsUser((prevState) => ({
					...prevState,
					email: userFieldDisplayMap.email + ' is invalid.'
				}));
			}
		}

		const newErrorsCreditCard: ICreditCardErrors = {};
		for (const prop in creditCard) {
			if (creditCard[prop as keyof typeof creditCard] === null) {
				errorsFlag = true;

				errorMessage = creditCardFieldDisplayMap[prop as keyof typeof creditCardFieldDisplayMap] + ' is required.';
			} else {
				errorMessage = null;
			}

			newErrorsCreditCard[prop as keyof typeof newErrorsCreditCard] = errorMessage;
		}

		setErrorsCreditCard(newErrorsCreditCard);

		/* ---
		Do manual checks on the credit card since we don't have a configuration setup on the card class since it's way beyond the scape of this exercise.

		We only check for the simple stuff, since all credit card payment processors have a very robust way of checking for credit card validation errors.

		Here, we do simple checks to make sure the card is a number, that the dates are numbers, and other obvious red flags. This way, we're not wasting resources on API calls to a 3rd party but also not
		--- */
		if (creditCard !== null) {
			// Check the card so it only has digits, spaces, and dashes.
			const ccNumberRegex = /^(?=.*[\d])[- \d]+$/;
			if (creditCard.card_number !== null && !ccNumberRegex.test(creditCard.card_number)) {
				errorsFlag = true;

				setErrorsCreditCard((prevState) => ({
					...prevState,
					card_number: creditCardFieldDisplayMap.card_number + ' is invalid.'
				}));
			}

			/* ---
			We can also use an external library such as validator to check for a valid credit card. But for this exercise, we are going to do it ourselves.
			if (!validator.isCreditCard(creditCard.card_number)) {
				setErrorsCreditCard((prevState) => ({
					...prevState,
					card_number: creditCardFieldDisplayMap.card_number + ' is invalid.'
				}));
			}
			*/

			// Check the expiration date.
			const ccExpDateRegex = /\d{1,2}\/\d{2,4}/;
			if (creditCard.exp_date !== null && !ccExpDateRegex.test(creditCard.exp_date)) {
				errorsFlag = true;

				setErrorsCreditCard((prevState) => ({
					...prevState,
					exp_date: creditCardFieldDisplayMap.exp_date + ' is invalid.'
				}));
			}

			// Check the CVV.
			const cvvRegex = /\d{3,4}/;
			if (creditCard.card_cvv !== null && !cvvRegex.test(creditCard.card_cvv)) {
				errorsFlag = true;

				setErrorsCreditCard((prevState) => ({
					...prevState,
					card_cvv: creditCardFieldDisplayMap.card_cvv + ' is invalid.'
				}));
			}
		}

		// Guard clause to see if we passed error checking. If we don't, we stop processing here and display a message to the user.
		if (errorsFlag) {
			setAlertMessage(<>There were errors checking out. Please see fields below in red.</>);
			setAlertShown(true);
			setAlertStatus('danger');

			return;
		}

		/* ---
		Here, we would do some sort of API call to a third party provider, using the address, credit card, and cart information.  If we get an error, we would set up the alert here to display it.

		However, we will assume payment went through, we got back some sort of reference ID, and we will let the user know via an email.
		--- */
		// fetch('https://authorize.net')
		// 	.then((result) => result.json())
		// 	.then((result) => {});

		// Get the transaction ID here. We will just randomly get one, but this is normally returned by the API.
		const transactionId = faker.string.alphanumeric(10);

		// Store the order in a database or API. We would get back a primary key of the order in the local database.  We will use a GUID for this example.
		const insertId = faker.string.uuid();

		// We will use the current time.
		const insertDate = new Date();

		// const formattedDate = insertDate.toISOString();
		// console.log(formattedDate);

		// Dispatch email to the user here.

		// Store the user's information to display on the thank you page.
		localStorage.setItem('user', JSON.stringify(user));

		const order = {
			date_created: insertDate,
			id: insertId,
			transaction_id: transactionId,
			cart: cartItems
		};

		sessionStorage.setItem('order', JSON.stringify(order));

		/* ---
		Note, we do not store the credit card information as we assume it was correctly processed via the payment processor, so there is no reason to store it.

		We might store the last 4 digits of the card for display purposes, but here, we will not do this for this exercise.
		--- */

		// Redirect to the summary page using the navigate function in react-router-dom. This is so RRD knows where we are so it can automatically keep track of what page we are on.
		navigate('/summary');
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

			<Container className="mt-3">
				<h2>Checkout</h2>

				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/' }}>
								Home
							</Breadcrumb.Item>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/cart' }}>
								Cart
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Checkout</Breadcrumb.Item>
						</Breadcrumb>
					</Col>
					<Col></Col>
				</Row>

				<p>Below is a summary of your cart items.</p>

				<h4>Order Summary</h4>

				<div className="mb-3">{drawSummary()}</div>

				<Row>
					<Col
						className="mb-3"
						lg={6}>
						<h4>Your Info</h4>

						<p>
							Please fill out the following form. Fields marked with a <span className="required">*</span> are required.
						</p>

						<FloatingLabel
							label="Email"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'email' in errorsUser && errorsUser.email !== null}
								maxLength={150}
								name="email"
								onChange={(e) => handleSetUserValue('email', e.target.value)}
								placeholder="Email"
								type="email"
								value={user?.email ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.email ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="Phone"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'phone' in errorsUser && errorsUser.phone !== null}
								maxLength={50}
								name="phone"
								onChange={(e) => handleSetUserValue('phone', e.target.value)}
								placeholder="Phone"
								type="tel"
								value={user?.phone ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.phone ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="First Name"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'first_name' in errorsUser && errorsUser.first_name !== null}
								maxLength={50}
								name="first_name"
								onChange={(e) => handleSetUserValue('first_name', e.target.value)}
								placeholder="First Name"
								value={user?.first_name ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.first_name ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="Last Name"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'last_name' in errorsUser && errorsUser.last_name !== null}
								maxLength={50}
								name="last_name"
								onChange={(e) => handleSetUserValue('last_name', e.target.value)}
								placeholder="Last Name"
								value={user?.last_name ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.last_name ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="Street Address"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'street_address' in errorsUser && errorsUser.street_address !== null}
								maxLength={100}
								name="street_address"
								onChange={(e) => handleSetUserValue('street_address', e.target.value)}
								placeholder="Street Address"
								value={user?.street_address ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.street_address ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="City"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'city' in errorsUser && errorsUser.city !== null}
								maxLength={50}
								name="city"
								onChange={(e) => handleSetUserValue('city', e.target.value)}
								placeholder="City"
								value={user?.city ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.city ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="State"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'state' in errorsUser && errorsUser.state !== null}
								maxLength={50}
								name="state"
								onChange={(e) => handleSetUserValue('state', e.target.value)}
								placeholder="State"
								value={user?.state ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.state ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="Zip Code"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'zip_code' in errorsUser && errorsUser.zip_code !== null}
								maxLength={10}
								name="zip_code"
								onChange={(e) => handleSetUserValue('zip_code', e.target.value)}
								placeholder="Zip Code"
								value={user?.zip_code ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsUser?.zip_code ?? ''}</Form.Control.Feedback>
						</FloatingLabel>
					</Col>
					<Col
						className="mb-3"
						lg={6}>
						<h4>Credit Card</h4>

						<p>Enter your credit card information below.</p>

						<FloatingLabel
							label="Card Number"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'card_number' in errorsCreditCard && errorsCreditCard.card_number !== null}
								maxLength={50}
								name="card_number"
								onChange={(e) => handleSetCardValue('card_number', e.target.value)}
								placeholder="Card Number"
								value={creditCard?.card_number ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsCreditCard?.card_number ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<FloatingLabel
							label="Name on Card"
							className="mb-3 form-required">
							<Form.Control
								isInvalid={'name_on_card' in errorsCreditCard && errorsCreditCard.name_on_card !== null}
								maxLength={100}
								name="name_on_card"
								onChange={(e) => handleSetCardValue('name_on_card', e.target.value)}
								placeholder="Name on Card"
								value={creditCard?.name_on_card ?? ''}
							/>
							<Form.Control.Feedback type="invalid">{errorsCreditCard?.name_on_card ?? ''}</Form.Control.Feedback>
						</FloatingLabel>

						<Row>
							{/* <Col md={6}>
								<FloatingLabel
									label="Expiration Month"
									className="mb-3 form-required">
									<Form.Select
										isInvalid={'exp_month' in errorsCreditCard && errorsCreditCard.exp_month !== null}
										name="exp_month"
										onChange={(e) => handleSetCardValue('exp_month', e.target.value)}
										value={creditCard?.exp_month ?? ''}>
										{buildOptsExpMonths()}
									</Form.Select>
									<Form.Control.Feedback type="invalid">{errorsCreditCard?.exp_month ?? ''}</Form.Control.Feedback>
								</FloatingLabel>
							</Col>
							<Col md={6}>
								<FloatingLabel
									label="Expiration Year"
									className="mb-3 form-required">
									<Form.Select
										isInvalid={'exp_year' in errorsCreditCard && errorsCreditCard.exp_year !== null}
										name="exp_year"
										onChange={(e) => handleSetCardValue('exp_year', e.target.value)}>
										{buildOptsExpYears()}
									</Form.Select>
									<Form.Control.Feedback type="invalid">{errorsCreditCard?.exp_year ?? ''}</Form.Control.Feedback>
								</FloatingLabel>
							</Col> */}
						</Row>

						<Row>
							<Col md={6}>
								<FloatingLabel
									label="Expiration Date"
									className="mb-3 form-required">
									<Form.Control
										isInvalid={'exp_date' in errorsCreditCard && errorsCreditCard.exp_date !== null}
										maxLength={5}
										name="exp_date"
										onChange={(e) => handleSetCardValue('exp_date', e.target.value)}
										placeholder="Expiration Date"
										value={creditCard?.exp_date ?? ''}
									/>
									<Form.Control.Feedback type="invalid">{errorsCreditCard?.exp_date ?? ''}</Form.Control.Feedback>
									<div className="form-notes">Card expiration in MM/YY format.</div>
								</FloatingLabel>
							</Col>
							<Col md={6}>
								<FloatingLabel
									label="CVV"
									className="mb-3 form-required">
									<Form.Control
										isInvalid={'card_cvv' in errorsCreditCard && errorsCreditCard.card_cvv !== null}
										maxLength={3}
										name="card_cvv"
										onChange={(e) => handleSetCardValue('card_cvv', e.target.value)}
										placeholder="CVV"
										value={creditCard?.card_cvv ?? ''}
									/>
									<Form.Control.Feedback type="invalid">{errorsCreditCard?.card_cvv ?? ''}</Form.Control.Feedback>
								</FloatingLabel>
							</Col>
						</Row>

						<div className="debug box">
							<p className="debug notes">
								The <strong>Fill</strong> buttons below would normally not be here. Automated testing is done via another outside tool (I prefer{' '}
								<a
									href="https://playwright.dev/"
									target="_blank">
									Playwright
								</a>
								), so this is unnecessary and is likely to cause problems as someone will forget to remove it.
								<br />
								<br />
								<p className="demo-text">These buttons are here to simulate entering in correct and incorrect data for Sean to test quickly.</p>
							</p>
							<Button
								className="me-2"
								onClick={() => fillValues(false)}
								variant="info">
								Fill Correct Test Values
							</Button>

							<Button
								className="me-2"
								onClick={() => fillValues(true)}
								variant="danger">
								Fill Incorrect Test Values
							</Button>
						</div>

						<div className="mt-3 mb-3 text-end">
							<Button
								onClick={() => validateForm()}
								variant="success">
								Complete Order
							</Button>
						</div>
					</Col>
				</Row>
			</Container>

			<Footer />
		</>
	);
};

export default Checkout;

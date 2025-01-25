// --- BASE ---
import { ReactNode, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, Col, Container, Dropdown, Pagination, Row } from 'react-bootstrap';

// --- COMPONENTS ---
import Footer from '../components/Footer.tsx';
import Navigation from '../components/Navigation.tsx';
import ProductItem from '../components/ProductItem.tsx';
import ProductModal from '../components/ProductModal.tsx';

// --- CONTEXTS ---
import { CartContext, CartUpdateContext } from '../CartContext.tsx';

// --- INTERFACES ---
import { IProduct, ICartItem } from '../Interfaces.ts';

const Products = () => {
	// --- CONTEXTS ---
	const cartItems = useContext(CartContext);
	const cartUpdate = useContext(CartUpdateContext);

	// --- STATES ---
	const [alertMessage, setAlertMessage] = useState<ReactNode | string>('');
	const [alertShown, setAlertShown] = useState<boolean>(false);
	const [alertStatus, setAlertStatus] = useState<string>('info');

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [modalShown, setModalShown] = useState<boolean>(false);
	const [product, setProduct] = useState<IProduct | null>(null);
	const [products, setProducts] = useState<IProduct[]>([]);

	// Paging, limiting, and other parameters to move around the products.
	const [limit, setLimit] = useState<number>(12);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);

	// Add a product to the cart using the ID.
	function addToCart(productId: number) {
		const qty = (document.getElementById(`qty-value-${productId}`) as HTMLInputElement).value;

		let foundFlag = false;

		/* ---
		Loop through the products to match the ID. This way, we don't have to do another fetch. If there are additional props in the fetch ID, then yes, we would have to do it by a fetch.
		--- */
		for (const product of products) {
			const { brand, description, id, images, price, returnPolicy, sku, stock, thumbnail, title, warrantyInformation } = product;

			if (id === productId) {
				// console.log('found product', product);
				foundFlag = true;

				// Make a copy of the cart, but not referencing the old cart contents, hence the spread operator.
				// const newCartItems = structuredClone(cartItems);
				const newCartItems: ICartItem[] = [];

				let foundOld = false;

				// See if the item is already in the cart. If yes, increment, if no, add.
				for (const oldItem of cartItems) {
					if (oldItem.id === productId) {
						foundOld = true;

						oldItem.qty = parseInt(qty, 10) + oldItem.qty;
					}

					newCartItems.push(oldItem);
				}

				if (!foundOld) {
					const productToAdd: ICartItem = {
						brand: brand,
						description: description,
						id: id,
						images: images,
						price: price,
						qty: 1,
						returnPolicy: returnPolicy,
						sku: sku,
						stock: stock,
						thumbnail: thumbnail,
						title: title,
						warrantyInformation: warrantyInformation
					};

					newCartItems.push(productToAdd);
				}

				cartUpdate(newCartItems);

				setAlertMessage(
					<>
						Product <strong>{title}</strong> <small>({sku})</small> was added to your cart!
					</>
				);
				setAlertShown(true);
				setAlertStatus('success');
			}
		}

		if (!foundFlag) {
			setAlertMessage(<>Product not found</>);
			setAlertShown(true);
			setAlertStatus('danger');
		}
	}

	function buildPagesDropdown() {
		// Store an empty array of dropdown objects.
		const items: JSX.Element[] = [];

		// Loop through the total pages, allow user to select the dropdown to change the page number.
		for (let i = 1; i <= totalPages; i++) {
			items.push(
				<Dropdown.Item
					active={i === page ? true : false}
					key={`dropdown-page-${i}`}
					onClick={() => handlePage(i)}>
					{i}
				</Dropdown.Item>
			);
		}

		// Since this a direct call, we will return the objects.
		return items;
	}

	function buildPagination() {
		// Guard clause to return something useful if there are no pages.  We might do some further error checking by calling an error log server, or some other notification system.
		if (totalPages <= 0) {
			return [<Pagination.Item key="err">-</Pagination.Item>];
		}

		// Store an empty array of pagination objects.
		const items: JSX.Element[] = [];

		// Show a Prev button if the page number we're on is > 1.
		if (page > 1) {
			items.push(
				<Pagination.Item
					onClick={() => handlePage(page - 1)}
					key={'prev'}>
					Prev
				</Pagination.Item>
			);
		}

		// Loop through total pages to create an array of elements, which will be rendered by React.
		for (let i = 1; i <= totalPages; i++) {
			items.push(
				<Pagination.Item
					active={i === page}
					onClick={() => handlePage(i)}
					key={i}>
					{i}
				</Pagination.Item>
			);
		}

		// Show a next button if the page number we're on is less than the total pages.
		if (page < totalPages) {
			items.push(
				<Pagination.Item
					onClick={() => handlePage(page + 1)}
					key={'next'}>
					Next
				</Pagination.Item>
			);
		}

		// Since this a direct call, we will return the objects.
		return items;
	}

	function drawProducts() {
		const cols: Array<JSX.Element> = [];

		if (Array.isArray(products) && products.length > 0) {
			for (const product of products) {
				// The product can sometimes be empty or null. Do a quick check and skip the product if there are obvious errors.
				if (typeof product !== 'object' || product === null) {
					// Do some sort of notification call here, store number of errors for example using a counter, and then make a call to an error API or some other backend service to alert the administrators that something bad is happening.
					continue;
				}

				cols.push(
					<ProductItem
						addToCart={addToCart}
						key={`product-col-${product.id}`}
						openMoreInfo={openMoreInfo}
						product={product}
					/>
				);
			}
		}

		return <Row>{cols}</Row>;
	}

	function handleClose() {
		setModalShown(false);
	}

	function handleLimit(perPage: number) {
		// Set the limit to the new value.  React will re-render when necessary.
		setLimit(perPage);

		// Set the page to 1, since if they're on page 20, and there is no page 20 from changing the limit, strange things happen.
		setPage(1);

		setAlertMessage(
			<span>
				Setting per page to <strong>{perPage}</strong>.
			</span>
		);
		setAlertShown(true);
		setAlertStatus('info');
	}

	function handlePage(pg: number) {
		setPage(pg);

		setAlertMessage(
			<span>
				Jumped to page <strong>{pg}</strong>.
			</span>
		);
		setAlertShown(true);
		setAlertStatus('info');
	}

	function openMoreInfo(id: number) {
		console.log(id);

		fetch(`https://dummyjson.com/products/${id}`)
			.then((result) => result.json())
			.then((result) => {
				console.log(result);

				setProduct(result);

				setModalShown(true);
			})
			.catch((result) => {
				console.error(result);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function removeFromCart(id: number) {
		let deletedTitle = '';
		let foundFlag = false;

		const newCartItems = [];

		for (const cartItem of cartItems) {
			if (cartItem.id === id) {
				foundFlag = true;

				deletedTitle = cartItem.title;
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

	useEffect(() => {
		const skip = page * limit - limit;

		// Set loading to true, which will turn on a spinner or something.
		setIsLoading(true);

		fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
			.then((result) => result.json())
			.then((result) => {
				const products = result?.products ?? [];
				const total: number = result?.total ?? 0;

				if (total > 0) {
					// The number of pages is the total divided by per page.
					const numPages = Math.ceil(total / limit);

					// Set the total pages so it will display nicely in the drop down.
					setTotalPages(numPages);

					setProducts(products);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [page, limit]);

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
				addToCart={addToCart}
				cartItems={cartItems}
				controls={true}
				handleClose={handleClose}
				product={product}
				removeFromCart={removeFromCart}
				setShow={setModalShown}
				show={modalShown}
			/>

			<Container className="mt-3">
				<h2>Products</h2>

				<Row>
					<Col sm={6}>
						<Breadcrumb>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/' }}>
								Home
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Products</Breadcrumb.Item>
						</Breadcrumb>
					</Col>
					<Col
						className="mb-3"
						sm={6}>
						<Dropdown className="float-end ms-2">
							<Dropdown.Toggle
								id="per-page-dropdown"
								size="sm"
								variant="outline-secondary">
								Show {limit} Per Page
							</Dropdown.Toggle>

							<Dropdown.Menu>
								{[12, 24, 48].map((perPage) => {
									return (
										<Dropdown.Item
											active={perPage === limit ? true : false}
											key={`per-page-${perPage}`}
											onClick={() => handleLimit(perPage)}>
											{perPage}
										</Dropdown.Item>
									);
								})}
							</Dropdown.Menu>
						</Dropdown>

						<Dropdown className="float-end">
							<Dropdown.Toggle
								disabled={totalPages === 0 ? true : false}
								id="page-dropdown"
								size="sm"
								variant="outline-secondary">
								Page {page} of {totalPages}
							</Dropdown.Toggle>

							<Dropdown.Menu>{buildPagesDropdown()}</Dropdown.Menu>
						</Dropdown>
					</Col>
				</Row>

				{isLoading && <div className="mb-3 mt-3 loading-div">Loading...</div>}

				{drawProducts()}

				<div className="debug notes mb-3">The pagination should really have 5-6 pages showing, with a ...skip which allows the user to jump page numbers and make this list more manageable. This is out of scope for this exercise so a full list is shown.</div>

				<Pagination className="table-responsive">{buildPagination()}</Pagination>
			</Container>

			<Footer />
		</>
	);
};

export default Products;

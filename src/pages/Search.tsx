// --- BASE ---
import { ReactNode, useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
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

const Search = () => {
	const location = useLocation();

	const cartItems = useContext(CartContext);
	const cartUpdate = useContext(CartUpdateContext);

	const [searchParams] = useSearchParams();
	console.log(searchParams);

	const queryParams = new URLSearchParams(window.location.search);
	const searchValue = queryParams.get('q');
	console.log({ searchValue });

	// --- STATES ---
	const [alertMessage, setAlertMessage] = useState<ReactNode | string>('');
	const [alertShown, setAlertShown] = useState<boolean>(false);
	const [alertStatus, setAlertStatus] = useState<string>('info');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [modalShown, setModalShown] = useState<boolean>(false);
	const [product, setProduct] = useState<IProduct | null>(null);
	const [products, setProducts] = useState<IProduct[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);

	// Paging, limiting, and other parameters to move around the products.
	// const [limit, setLimit] = useState<number>(12);
	const limit = 12;
	const [page, setPage] = useState<number>(1);

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
				foundFlag = true;

				// Make a copy of the cart, but not referencing the old cart contents, which removes the reference.
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

	function buildDropdowns() {
		// Store an empty array of dropdown objects.
		const items: JSX.Element[] = [];

		// Loop through the total pages, allow user to select the dropdown to change the page number.
		for (let i = 1; i <= totalPages; i++) {
			items.push(
				<Dropdown.Item
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

	function handleClose() {
		setModalShown(false);
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

		fetch(`https://dummyjson.com/products/search?q=${searchValue}&limit=${limit}&skip=${skip}`)
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
			});
	}, [limit, page, searchValue, location]);

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
				<h2>Search</h2>

				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item
								linkAs={Link}
								linkProps={{ to: '/' }}>
								Home
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Search</Breadcrumb.Item>
						</Breadcrumb>
					</Col>
					<Col>
						<Dropdown className="float-end">
							<Dropdown.Toggle
								disabled={totalPages === 0 ? true : false}
								id="page-dropdown"
								size="sm"
								variant="outline-secondary">
								Page {page} of {totalPages}
							</Dropdown.Toggle>

							<Dropdown.Menu>{buildDropdowns()}</Dropdown.Menu>
						</Dropdown>
					</Col>
				</Row>

				<div className="mb-3">
					Showing search results for <strong>{searchValue}</strong>.
				</div>

				{isLoading && <div className="mb-3 mt-3 loading-div">Loading...</div>}

				{drawProducts()}

				<Pagination>{buildPagination()}</Pagination>
			</Container>

			<Footer />
		</>
	);
};

export default Search;

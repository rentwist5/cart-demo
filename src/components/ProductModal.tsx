// --- BASE ---
import { ReactNode } from 'react';
import { Button, Modal, ListGroup, Image } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

// --- INTERFACES ---
import { ICartItem, IProduct, IProductReview } from '../Interfaces.ts';

interface IProps {
	addToCart?: (id: number) => void;
	cartItems?: ICartItem[] | null;
	controls?: boolean;
	handleClose: () => void;
	product: IProduct | ICartItem | null;
	removeFromCart?: (id: number) => void;
	setShow: (show: boolean) => void;
	show: boolean;
}

const ProductModal = (props: IProps) => {
	// Expand the properties into their own variables.
	const { addToCart, cartItems, controls, handleClose, product, removeFromCart, setShow, show }: IProps = props;

	let foundFlag = false;
	let qtyInCart: number = 0;

	// Check if a product is passed in. If not, ignore completely.
	if (product !== null && typeof product === 'object' && 'id' in product && typeof product.id === 'number' && product.id !== null) {
		// If the cart is passed through, and the item is found in the cart, change the button to remove it.
		if (typeof cartItems === 'object' && Array.isArray(cartItems) && cartItems?.length > 0) {
			for (const cartItem of cartItems) {
				if (cartItem.id === product.id) {
					foundFlag = true;
					qtyInCart = cartItem.qty;
				}
			}
		}
	}

	function buildImages(images: string[]): ReactNode {
		const items: ReactNode[] = [];

		if (images !== null && Array.isArray(images) && images.length > 0) {
			// Set a counter for the key and ALT tag for the image.
			let i = 0;

			for (const image of images) {
				items.push(
					<Image
						alt={`Image ${i}`}
						className="mb-3"
						key={`product-image=${i}`}
						src={image}
						thumbnail
					/>
				);

				i++;
			}
		}

		return <>{items}</>;
	}

	function buildReviews(reviews: IProductReview[] | null): ReactNode {
		const items: ReactNode[] = [];

		if (reviews !== null && Array.isArray(reviews) && reviews.length > 0) {
			let i = 0;

			for (const review of reviews) {
				const date = new Date(review.date);

				items.push(
					<ListGroup.Item key={`review-${i}`}>
						<div className="float-end">{date.toLocaleDateString('en')}</div>

						<div>
							<strong>{review?.reviewerName ?? ''}</strong> <small>({review?.reviewerEmail ?? ''})</small>
						</div>

						<div>{review?.comment ?? ''}</div>

						<div>Rating: {review?.rating ?? '-'}</div>
					</ListGroup.Item>
				);

				i++;
			}
		}

		return (
			<>
				<h4>Reviews</h4>
				<ListGroup>{items}</ListGroup>
			</>
		);
	}

	function handleAddToCart(id: number) {
		if (typeof addToCart === 'function') {
			addToCart(id);
		}

		setShow(false);
	}

	function handleRemoveFromCart(id: number) {
		if (typeof removeFromCart === 'function') {
			removeFromCart(id);
		}

		setShow(false);
	}

	return (
		<Modal
			onHide={handleClose}
			show={show}>
			<Modal.Header closeButton>
				<Modal.Title>{product?.title ?? ''}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{buildImages(product?.images ?? [])}
				<div>Brand: {product?.brand ?? ''}</div>
				<div>Qty In Stock: {product?.stock ?? ''}</div>
				<div>Qty In Cart: {qtyInCart}</div>
				<div className="product-price">
					<span className="me-1">Price:</span>
					<NumericFormat
						displayType={'text'}
						prefix={'$'}
						thousandSeparator={true}
						value={product?.price?.toFixed(2) ?? ''}
					/>
				</div>
				<div>Return Policy: {product?.returnPolicy ?? ''}</div>
				<div className="mb-3">Warranty: {product?.warrantyInformation ?? ''}</div>

				{product !== null && 'reviews' in product && buildReviews(product?.reviews ?? [])}
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={handleClose}>
					Close
				</Button>
				{controls && !foundFlag && product !== null && typeof product === 'object' && 'id' in product && product.id !== null && typeof product.id === 'number' && (
					<Button
						variant="primary"
						onClick={() => handleAddToCart(product.id)}>
						Add to Cart
					</Button>
				)}
				{controls && foundFlag && product !== null && typeof product === 'object' && 'id' in product && product.id !== null && typeof product.id === 'number' && (
					<Button
						variant="danger"
						onClick={() => handleRemoveFromCart(product.id)}>
						Remove {qtyInCart} from Cart
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default ProductModal;

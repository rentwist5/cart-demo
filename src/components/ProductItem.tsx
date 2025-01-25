// --- BASE ---
import { Button, Card, Col, Form, InputGroup } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

// --- INTERFACES ---
import { IProduct } from '../Interfaces.ts';

interface IProps {
	addToCart: (id: number) => void;
	openMoreInfo: (id: number) => void;
	product: IProduct;
}

const ProductItem = (props: IProps) => {
	// Destruct the input props.
	const { addToCart, openMoreInfo, product }: IProps = props;

	function buildSelectQty(qty: number) {
		const items: JSX.Element[] = [];

		for (let i = 1; i <= qty; i++) {
			items.push(
				<option
					key={`qty-select-${i}`}
					value={i}>
					{i}
				</option>
			);
		}

		return items;
	}

	/*
	There are 2 schools of thought here.

	1) The first, is to access the object directly by destructing which gives you the flexibility of quickly adding object properties. The cost is that you lose more granular error checking abilities. Properties that are missing are undefined and need further error checking. We will destruct the object into its properties for simplicity.

	2) Break out each property into its own variable. This allows for more granular error checking as well as more exception handling, at the expense of being verbose and time consuming to develop.
	*/

	// Here, we break out the properties into variables, checking each property returned from the API. If the API changes, the app will not crash, but this method takes much more time. This method is much more robust, but it takes double the time to develop.
	// const id: number = product.id;
	// const description: string = ('description' in row && typeof row.description === 'string' && row.description !== null) ? row.description : '';
	// const thumbnail: string = ('thumbnail' in row && typeof row.thumbnail === 'string' && row.thumbnail !== null) ? row.thumbnail : '';
	// const title: string = ('title' in row && typeof row.title === 'string' && row.title !== null) ? row.title : '';
	// const price: number = ('price' in row && typeof row.price === 'number' && row.price !== null) ? row.price : '';

	// Destruct the product. This is easier and variables  will be undefined if they are missing.
	const { description, id, price, sku, stock, thumbnail, title } = product;

	return (
		<Col
			className="mb-3"
			key={`product-col-${id}`}
			lg={4}
			md={6}
			sm={12}
			xl={3}>
			<Card>
				<Card.Img
					className="img-responsive hover"
					onClick={() => openMoreInfo(id)}
					src={thumbnail}
					variant="top"
				/>
				<Card.Body>
					<Card.Title>
						<span
							onClick={() => openMoreInfo(id)}
							className="hover">
							{title}
						</span>
					</Card.Title>
					<Card.Text className="product-sku">SKU: {sku}</Card.Text>
					<Button
						className="button-link mb-1"
						onClick={() => openMoreInfo(id)}
						variant="link">
						View Product Details
					</Button>
					<Card.Text className="product-description">{description}</Card.Text>

					<Card.Text>Qty In Stock: {stock}</Card.Text>
					<Card.Text className="product-price">
						<span className="me-1">Price:</span>
						<NumericFormat
							displayType={'text'}
							prefix={'$'}
							thousandSeparator={true}
							value={price.toFixed(2)}
						/>
					</Card.Text>
					<div className="d-flex justify-content-between">
						<InputGroup className="mb-3">
							<InputGroup.Text id="qty-text">Qty</InputGroup.Text>
							<Form.Select
								id={`qty-value-${id}`}
								aria-label="Quantity">
								{buildSelectQty(stock)}
							</Form.Select>
							<Button
								disabled={product?.stock <= 0 ? true : false}
								onClick={() => addToCart(id)}
								variant="primary">
								Add to Cart
							</Button>
						</InputGroup>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductItem;

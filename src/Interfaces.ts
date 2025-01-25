/* This is an example of a cart item.
{
	id: 1,
	description: 'Desc',
	price: 10,
	sku: '123',
	qty: 1,
	title: 'title'
} */

export interface ICartItem {
	brand: string;
	description: string;
	id: number;
	images: string[];
	price: number;
	qty: number;
	returnPolicy: string;
	sku: string;
	stock: number;
	thumbnail: string;
	title: string;
	warrantyInformation: string;
}


export interface IProductReview {
	comment: string;
	date: string;
	rating: number;
	reviewerEmail: string;
	reviewerName: string;
}

export interface IProduct extends ICartItem {
	// brand: string;
	category: string;
	// description: string;
	discountPercentage: number;
	// id: number;
	// images: string[];
	// price: number;
	rating: number;
	// returnPolicy: string;
	reviews: IProductReview[];
	// sku: string;
	// stock: number;
	// thumbnail: string;
	// title: string;
	// warrantyInformation: string;
}

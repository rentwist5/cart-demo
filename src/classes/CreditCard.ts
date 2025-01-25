// --- INTERFACES ---
export interface ICreditCard {
	card_cvv: string | null;
	card_number: string | null;
	exp_date: string | null;
	name_on_card: string | null;
}

export interface ICreditCardErrors {
	card_cvv?: string | null;
	card_number?: string | null;
	exp_date?: string | null;
	name_on_card?: string | null;
}

// --- CLASS ---
class CreditCard implements ICreditCard {
	card_cvv = null;
	card_number = null;
	exp_date = null;
	name_on_card = null;

	propToDisplayMap = () => {
		return {
			card_cvv: 'Card verification value',
			card_number: 'Card number',
			exp_date: 'Expiration date',
			name_on_card: 'Name on card'
		};
	};
}

export default CreditCard;

// --- INTERFACES ---
export interface IUser {
	city: string | null;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	phone: string | null;
	state: string | null;
	street_address: string | null;
	zip_code: string | null;
}

export interface IUserErrors {
	city?: string | null;
	email?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	phone?: string | null;
	state?: string | null;
	street_address?: string | null;
	zip_code?: string | null;
}

// --- CLASS ---
class User implements IUser {
	city = null;
	email = null;
	first_name = null;
	last_name = null;
	phone = null;
	state = null;
	street_address = null;
	zip_code = null;


	propToDisplayMap = () => {
		return {
			city: 'City',
			email: 'Email',
			first_name: 'First Name',
			last_name: 'Last Name',
			phone: 'Phone',
			state: 'State',
			street_address: 'Street Address',
			zip_code: 'Zip Code'
		};
	};

	// fieldMap = {
	// 	city: {
	// 		display: 'City',
	// 		required: true,
	// 		maxlength: 30
	// 	}
	// };

	/* ---
	This method would validate whether an object passed in follows the instance type since we cannot use instaneof.
	--- */
	validateUser = (user: string | object | null): boolean => {
		// If the passed in user is a string, JSON parse it.
		if (typeof user === 'string') {
			user = JSON.parse(user);
		}

		// If the passed in value is null, it's not a user.
		if (user === null || typeof user !== 'object') {
			return false;
		}

		console.log(user);

		const isValid = 'city' in user && 'email' in user && 'first_name' in user && 'last_name' in user && 'phone' in user && 'state' in user && 'street_address' in user && 'zip_code' in user;

		// console.log({ isValid });

		return isValid;
	};
}

export default User;

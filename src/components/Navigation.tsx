// --- BASE ---
import { FormEvent, useContext, useRef } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

// --- ASSETS ---
import logo from '../assets/logo.svg'

// --- CONTEXTS ---
import { CartContext } from '../CartContext.tsx';

const Navigation = () => {
	const cartItems = useContext(CartContext);

	// Set a reference to keep track of what is in the search box.
	const searchRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	function handleSearch() {
		const searchValue = searchRef?.current?.value;

		navigate(`/search?q=${searchValue}`);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		handleSearch();
	}

	return (
		<Navbar
			bg="dark"
			className="bg-body-tertiary"
			data-bs-theme="dark"
			expand="lg">
			<Container>
				<Navbar.Brand href="https://www.entwistle.tv/">
					<img
						alt="Demo Logo"
						className="logo"
						src={logo}
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<NavLink
							className="nav-link"
							to={'/'}>
							Home
						</NavLink>

						<NavLink
							className="nav-link"
							to={'/products'}>
							Products
						</NavLink>

						<NavLink
							className="nav-link"
							to={'/people'}>
							People
						</NavLink>
					</Nav>
					<Nav>
						<Form
							className="d-flex"
							onSubmit={(e) => handleSubmit(e)}>
							<Form.Control
								aria-label="Search"
								className="me-2"
								ref={searchRef}
								placeholder="Search"
								type="search"
							/>
							<Button
								onClick={() => handleSearch()}
								size="sm"
								variant="primary">
								Search
							</Button>
						</Form>
						<NavLink
							className="nav-link ms-3"
							to={'/cart'}>
							Cart ({cartItems.length ?? 0})
						</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;

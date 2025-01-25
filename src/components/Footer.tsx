// --- BASE ---
import { Col, Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Footer = () => {
	return (
		<footer>
			<Container>
				<Row>
					<Col
						className="mb-3 footer-links"
						md={6}
						sm={12}>
						<h3>Pages</h3>

						<NavLink to="/products">Products</NavLink>

						<NavLink to="/cart">Cart</NavLink>

						<NavLink to="/people">People</NavLink>
					</Col>
					<Col
						className="mb-3"
						md={6}
						sm={12}>
						<h3>Contact Us</h3>
						<address>
							Cart Demo
						</address>

						<div>
							<a href="tel:+15617136675">1-561-713-6675</a>
						</div>
						<div>
							<a href="mailto:robert@entwistle.tv">robert@entwistle.tv</a>
						</div>
						<div className="mt-2 mb-2">
							<small>Developed by <a href="mailto:robert@entwistle.tv">Robert Entwistle</a> as a weekend demo.</small>
						</div>
					</Col>
				</Row>

				<div className="text-left">All Rights Reserved &copy; 2025 Robert Entwistle</div>
			</Container>
		</footer>
	);
};

export default Footer;

// --- BASE ---
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

// --- COMPONENTS ---
import Footer from '../components/Footer.tsx';
import Navigation from '../components/Navigation.tsx';

const ErrorNotFound = () => {
	const navigate = useNavigate();

	return (
		<>
			<Navigation />

			<Container className="mt-3">
				<h2>Page Not Found</h2>

				<div className="text-center error-title">404 ERROR</div>

				<div className="mb-3 text-center">
					<Button
						onClick={() => navigate('/')}
						variant="outline-primary">
						Home Page
					</Button>
				</div>
			</Container>

			<Footer />
		</>
	);
};

export default ErrorNotFound;

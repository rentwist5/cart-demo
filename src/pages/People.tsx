// --- BASE ---
import { Container, Card, Row, Col } from 'react-bootstrap';

// --- ASSETS ---
import jeffrey from '../assets/jeffrey.webp';
import jennifer from '../assets/jennifer.webp';
import jordan from '../assets/jordan.webp';

// --- COMPONENTS ---
import Navigation from '../components/Navigation.tsx';
import Footer from '../components/Footer.tsx';

const People = () => {
	return (
		<>
			<Navigation />

			<Container className="mt-3">
				<h2>People</h2>

				<Row>
					<Col
						className="mb-3"
						md={4}>
						<Card>
							<Card.Img
								variant="top"
								src={jeffrey}
							/>
							<Card.Body>
								<Card.Title>Jeffrey Jones (CEO)</Card.Title>
								<Card.Text>Jeffrey has been leading the Demo Cart page for a number of years, growing the demo from 1 recruiter view to several hundreds of spam bot views. Say hello to Jeffrey.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col
						className="mb-3"
						md={4}>
						<Card>
							<Card.Img
								variant="top"
								src={jennifer}
							/>
							<Card.Body>
								<Card.Title>Jennifer Jackson (COO)</Card.Title>
								<Card.Text>Jennifer comes from an impressive line of organizational managers including Company A, Company B, and Company C. Say hello to Jennifer.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col
						className="mb-3"
						md={4}>
						<Card>
							<Card.Img
								variant="top"
								src={jordan}
							/>
							<Card.Body>
								<Card.Title>Jordan Jacobs (CFO)</Card.Title>
								<Card.Text>Jordan has overseen the financial health of the Demo Cart for time eternal, with over 20% YoY growth. Say hello to Jordan.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<p className="demo-text">Attribution is required for these images, shown below. They were picked as placeholders and not mean to be offensive or representative in any way.</p>
				<p className="mb-3"><a href="https://www.freepik.com/free-vector/happy-children-different-actions_27188997.htm#page=5&query=playing&position=26&from_view=keyword&track=sph&uuid=79d6255d-8f5a-454e-9ff2-b8c4f9ffd515">Image by brgfx</a> on Freepik</p>


			</Container>



			<Footer />
		</>
	);
};

export default People;

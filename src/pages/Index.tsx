// --- BASE ---
import { Container } from 'react-bootstrap';

// --- COMPONENTS ---
import Navigation from '../components/Navigation.tsx';
import Footer from '../components/Footer.tsx';

const Index = () => {
	return (
		<>
			<Navigation />

			<Container className="mt-3">
				<h1>Home Page</h1>

				<hr />
				<h2>Overview</h2>

				<p>This shopping cart demo was created for a marketing and acquisition company as part of the interview process for a development manager role to demonstrate an understanding of the technology used. As it was built over a weekend, it is very basic in its implementation. Please note that typical considerations such as SEO, performance, scalability, usage metrics, A/B testing, and browser testing were not factored into this demo.</p>

				<p>	As this was put together over a weekend, many of the functions necessary for a full-fledged e-commerce system are out-of-scope.</p>

				<p>As writing an entire back-end system as well as this front-end over a weekend would be an exercise in futility, the web site <a href="https://dummyjson.com/" target="_blank">Dummy JSON</a> was used to simulate a JSON REST backend.</p>

				<p>The original company name and any identifying details have been redacted. The site is hosted on an entirely separate instance and provider, with no connections—contractual, legal, or otherwise—to the original assignment.</p>

				<h3>Development Technologies</h3>

				<p>This demo is written in TypeScript with source code available on <a href="https://github.com/rentwist5/cart-demo" target="_blank">GitHub</a>.</p>

				<p>It uses the following technologies:</p>

				<ul>
					<li>React 18.3</li>
					<li>React Bootstrap 2.10</li>
					<li>React Router 18.3</li>
					<li>Faker 8.1</li>
					<li>Typescript 5.7</li>
					<li>SASS 1.83</li>
					<li>Vite 6.0</li>
				</ul>

				<h3>Considerations</h3>
				<p>
					<strong>Please note that most of the recommendations and improvements were considered but not completed as they are too time consuming for the scope of this exercise.</strong>
				</p>

				<p>For example, much of the code needs to be refactored for performance, efficiency, and size savings. Many functions can be refactored and put into their own classes with option flags to alter behavior. Currently, we totally break the DRY principle (don't repeat yourself) for the sake of time.</p>

				<p>If this were to become a production application, time would need to be allocated to refactor the code.</p>

				<p>Error handling needs significant improvement to prevent crashes and ensure issues are managed gracefully. For instance, fetch calls to the external API should log errors and provide clear user notifications, prompting them to refresh if an issue occurs.</p>

				<p>The alert system is a banner on the top that changes color. It should be a floating banner, or even fancier, a banner that slides out from the top, displays, and hides after a few seconds. There are many already available.</p>

				<p>As this project is a proof of concept (POC), development speed was the primary focus to quickly deliver a functional prototype.</p>

				<h3>Instruction Notes</h3>
				<p>
					Original instructions provided by the company are in <span className="instructions">italics</span>.
				</p>

				<p>
					The site features <span className="debug box">info boxes</span> that provide explanations, instructions, and responses directly addressing the questions received.
				</p>

				<h3>Demo Assignment Instructions</h3>

				<p className="instructions">The SSH/SFTP standard port (22) and 80/443 HTTP/HTTPS are open.</p>

				<p className="instructions">"Please install any necessary packages to get the application running and tune your development environment to your liking.</p>

				<div className="debug box">
					<p>After logging in and analyzing the server, it was identified as an Ubuntu 22.04 system with 4 GB of RAM and a 100 GB drive, with 95 GB allocated to the root partition.</p>

					<p>The first steps taken were:</p>

					<ul>
						<li>Glance over the directory structure to determine if the server was already set up for a web serving directory.</li>
						<li>Update the server with the latest packages.</li>
						<li>We assume the server has not been tampered with. Rebooting will confirm that it is indeed configured properly.</li>
						<li>Security vulnerability investigation and testing are out-of-scope.</li>
					</ul>
				</div>

				<p>For this demo (not the original assignment), the server is an ARM-based Ubuntu 24.04 system running Nginx 1.24.</p>
				<ul>
					<li>SSH is exposed, which is generally not recommended. Using a VPN such as IKEv2, OpenVPN, L2TP, or WireGuard would be preferable.</li>
					<li>IPv6 has been configured, and an SSL certificate has been set up using Let's Encrypt.</li>
					<li>The server is overconfigured for this demo. While woefully underpowered for a production site, the server provides more than enough resources for this purpose.</li>
				</ul>

				<div className="debug box">
					<p>The first step is to create a dedicated user to own the application. Installing the app as the root user is not recommended, as it can pose significant security risks.</p>

					<p>
						The user <strong>demo</strong> was chosen and the user create with:
					</p>

					<code>sudo adduser demo</code>

					<p>The sudo isn't necessary as we have root access. However, and from this step forward we will assume root where the sudo command is not needed.</p>

					<p>Since this is a test machine and there are no procedures for scheduled updates, backing up, or package testing, the server was updated normally.</p>

					<code>sudo apt update</code>

					<p>A total of 117 packages were out of date.</p>

					<code>sudo apt upgrade</code>

					<p>Packages were checked and nothing was out of the ordinary.</p>

					<p>The ssh_config file has changed, and a diff on the 2 shows configuration changes. Normally, time is spent on seeing what those changes are. Some things to look for are whether password authentication is disabled (which it was). Using the package version would normally lock us out of the system, so we will keep the one in place as we assume that the configuration was set a certain way by the IT team, and overwriting their work is a no-go. At this point, a rollback is necessary, and confirmation should be granted by the IT team. For the purposes of this exercise, we will use the currently installed version as there are no security issues except for the password auth (which normally should be disabled). We will leave this on as this is a test machine. This is a no-no for production.</p>

					<p>The default Nginx was installed on this Ubuntu 22.04 Linux server. This is the one that comes with this version of the distribution.</p>

					<code>sudo apt install nginx</code>

					<p>The version as of this writing is 1.18, which is several versions out of date. Ideally, an updated nginx would be installed from the source repos found on nginx.com.</p>

					<p>IPv6 is enabled on the server, but the hostname does not have an IPv6 AAAA/CNAME pointing to the address. As such, only IPv4 is set up on the nginx configuration file, found in ~/nginx/production.conf</p>
				</div>

				<p className="instructions">This server instance does not have any web servers or programming languages installed, so please install the server stack that you prefer.</p>

				<div className="debug box">
					<p>Since we are building a React version of this app which pulls from a 3rd party API, no middleware or database are needed. As such, none were installed.</p>

					<p>If we were building the app on the server, we would need an installation of node to build the app. The app is built off-site and just uploaded for nginx to serve. Normally, there would be a git repo chained to a CI/CD pipeline, which would run an automated build of the source code, run tests (unit, integration, end-to-end, and browser) but this would be well out of scope. Instead, simple development an no automated testing was done.</p>

					<p>If we were building a plain JavaScript version of this, we would need at least a middleware. A framework in the language of our choice could be used to build the basic structure.</p>
				</div>

				<h3>Cart Assignment</h3>
				<p className="instructions">You will need to create a simple cart flow using Vanilla JS, jQuery, or React that pulls in dynamic product data from https://dummyjson.com/docs/products.</p>

				<div className="debug box">
					<p>React was chosen for the following reasons:</p>

					<ol>
						<li>It was one of the available choices.</li>
						<li>React doesn't need an additional page router. Since a 3rd party API is accessed and no special requirements (such as a SOAP parser, filesystem access) is needed, a middleware (PHP, Java, Python) is needed.</li>
						<li>It simplifies many of the functions needed to make the cart work within a reasonable amount of time.</li>
						<li>Getting jQuery to do the same requires a bit more work as routing would needed to be done manually, taking more time. Vanilla JS would take even longer.</li>
					</ol>
				</div>

				<p className="instructions">Design is not the most important aspect of this project, but it should be responsive and mobile-friendly.</p>

				<p className="instructions">Feel free to use any HTML/CSS framework or libraries to quickly implement the front-end styles. The focus is on functionality and application structure.</p>

				<div className="debug box">
					<p>Bootstrap was chosen since</p>

					<ul>
						<li>The company uses it.</li>
						<li>It is simple to get up and running since all of the breakpoints and mobile considerations are out of the box.</li>
						<li>Faster to get up and running than Material UI (too heavy), Tailwind CSS (too verbose, better if you need vast customization), or Skeleton (need to build out too many components).</li>
						<li>Since the app was built in TypeScript, it must be transpiled into JS for it to work.</li>
						<li>Vite is faster and gaining traction as the de facto management tool, it was chosen over Webpack.</li>
						<li>Vite is configured to strip out all of the console.log() and console.err() calls, so they are left in the source code to aid in debugging.</li>
					</ul>
				</div>

				<h3>Pages</h3>
				<div className="instructions">
					<ol>
						<li>
							Home page
							<ol type="a">
								<li>Create a simple default landing page that will act as “Home” which routes to the default “/” path.</li>
								<li>
									This page needs to at least contain these elements:
									<ol type="i">
										<li>
											Navigation
											<ol>
												<li>The navigation should include all pages in this list</li>
											</ol>
										</li>
										<li>Search</li>
										<li>Anything else you'd want to add (this is optional)</li>
									</ol>
								</li>
							</ol>
						</li>
						<li>
							Products page
							<ol type="a">
								<li>
									This page should display all products and allow the user to perform product-related actions (“Add to Cart”, “View Product”, etc.)
									<ul className="debug">
										<li>The add to cart will check the ID of the product and merge the quantities if the same product is added.</li>
										<li>This avoids having multiple lines of the same product in the cart.</li>
										<li>The user can select the quantity they want, which is limited by the 'stock' value from the API.</li>
										<li>Although the API provides discount, weight, and minimum order qty information, this was ignored as it is out-of-scope.</li>
									</ul>
								</li>
								<li>
									This page should also include pagination to go to the next “X” amount of products
									<ul className="debug">
										<li>An additional per-page dropdown was added, using intervals of 12 to allow the user to choose more products per page and to demonstrate the automatic paging algorithms.</li>
										<li>12 was chosen since Bootstrap's breakpoints are in blocks of 12, allowing 1, 2, 3, 4, 6, or 12 columns on a given row.</li>
										<li>A row was set at 4 columns on large screens (think desktop, large laptop), 3 on smaller (think landscape tablet), 2 for portrait tablet, and 1 for mobile phone.</li>
										<li>The products display should be refactored into a separate React component and re-used on the products and search pages.</li>
									</ul>
								</li>
							</ol>
						</li>
						<li>
							Product detail page
							<ol type="a">
								<li>
									This will be the page that displays a product in more detail, and should be the result of clicking on the “View Product” link on the products and search results pages
									<ul className="debug">
										<li>A slightly different approach was taken to improve the user experience. Instead of a separate page, a dialog window was used so the user never leaves the page.</li>
										<li>This is one advantage of a framework like React, where repainting the number of items in a cart, changing the buttons, or managing the contents of the cart can be handled dynamically. It can be done in jQuery/JS, but all of the different state values must be manually managed and changed by setting various event handlers, which can get very unwieldy very quickly.</li>
									</ul>
								</li>
								<li>
									An “Add to Cart” link should display on this page if the product has not been previously added to the cart:
									<ol type="i">
										<li>
											If the product has been previously added to your cart, the “Add to Cart” link should change to something like “Remove Product”
											<ul className="debug">
												<li>The dialog window will also show you the current quantity in the cart. This way, you know how many items you are removing.</li>
											</ul>
										</li>
									</ol>
								</li>
							</ol>
						</li>
						<li>
							Search results page
							<ol>
								<li>
									A page that displays the search results and allow the user to perform product-related actions (add to cart, view product details, etc.)
									<ul className="debug">
										<li>The search page is a copy of the products page, with modifications specific to search.</li>
										<li>A refactor of the code would put all of the cart related functions into a new class or in the cart context. This would eliminate the same functions being copied and pasted (this was a time decision since it would take several hours of time to refactor everything and is out-of-scope.)</li>
										<li>The return key works when entering a search. Often, this is forgotten and the page does a refresh with the search not firing, giving a poor user experience.</li>
									</ul>
								</li>
							</ol>
						</li>

						<li>
							Cart overview page
							<ol type="a">
								<li>
									This page should be a roll up of any product(s) that were added to the cart, and provide the ability for the user to modify the cart:
									<ol type="i">
										<li>Delete item from cart</li>
										<li>Update the amount of each product (i.e. order 3 of that product instead of 1)</li>
										<li>
											“View Product” to go back to the product detail page
											<ul className="debug">
												<li>The view product opens a dialog window instead of taking you to a separate page.</li>
											</ul>
										</li>
									</ol>
								</li>
							</ol>
						</li>
						<li>
							Checkout page
							<ol type="a">
								<li>This page needs to include a cart summary with everything they have added to their cart</li>
								<li>
									It needs to contain a payment form that has basic front-end validation to prevent the user from submitting the form if the information is invalid (this doesn't need to be too involved, just something that prevents the user from submitting a form with invalid or missing information)
									<ul className="debug">
										<li>The page has 2 buttons using faker to fill out random values. These would normally not be available live or in staging. Only for development.</li>
										<li>
											There is no credit card number validation as
											<ol type="a">
												<li>
													<strong>every</strong> card payment processor has a much more robust version of card testing than we could ever hope for.
												</li>
												<li>Testing credit cards with the standard (starts with 34 or 37 digits for Amex with a length of 15), (Visa has 16 digits, starts with a 4.) often leads to errors since the regex could be wrong or the card issuer changes validation rules. It would be worth the time if there are hundreds of transactions attempted per day and the payment provider charges for each attempt for example.</li>
											</ol>
										</li>
									</ul>
								</li>
								<li>
									This does not require any type of payment, so feel free to programmatically allow the user to proceed based on whatever conditions you determine.
									<ul className="debug">
										<li>Typically, the user hits the checkout button, the web site validates the input, and then passes the credit card info securely to the payment processor. Since this can take a while, a loading spinner or disabling input is needed.</li>
										<li>This transaction ID is then stored along with the order details in a database (either directly to a database, called from an API, pushed to a stored procedure, etc.) The credit card details are never saved, to be PCI compliant.</li>
										<li>For a PHP version, a cURL call would process a 3rd party payment API and get a response (normally SOAP or REST) and based on what's returned, different messages would be shown. It would be ideal to have this as a separate class. We would call a database (directly in the code, or via API as another cURL request) and save this data.</li>
										<li>Once saved, we pass only the ID of the order via a session (or other secure method) to the confirmation page.</li>
										<li>We re-read the order and build the summary on that, which gives us the opportunity to do any error checking and exception handling to not lose the customer.</li>
									</ul>
								</li>
							</ol>
						</li>
						<li>
							Order summary page
							<ol type="a">
								<li>
									A basic page that thanks the user for purchasing products and gives them a summary of what was just purchased.
									<ul className="debug">
										<li>A print button is available, there is no special print version of the CSS typically used for a print function.</li>
										<li>Normally, a special CSS with the attribute media="print" forces the browser to use this CSS in print mode. This will make certain items such as buttons hidden, move items, and make text a different font for example.</li>
										<li>For a version with a framework, an external library (DomPDF/TCPPDF for PHP, IronPDF/PDFKit for Node) would be used to generate a proper PDF version.</li>
									</ul>
								</li>
							</ol>
						</li>
					</ol>
				</div>
			</Container>

			<Footer />
		</>
	);
};

export default Index;

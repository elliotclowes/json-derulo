import { Link } from "react-router-dom";
import {Layout, Footer } from "../../components";
export default function NotFound() {
  return (
    <Layout>
    <div className="not-found-container">
      <h1>Page not found</h1>
      <div className="p-and-img">
        <p>Here are some links to our site:</p>
        
      </div>
      <div className="links">
        <Link to="/dash">Dashboard</Link>
        <br />
        <Link to="/summary">Summary</Link>
        <br />
        <Link to="/login">Log In</Link>
        <br />
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
    <Footer />
    </Layout>
  );
}

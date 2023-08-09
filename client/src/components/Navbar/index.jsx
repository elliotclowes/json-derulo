import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import "./styles.css";

function Navigation() {
  let activeStyle = {
    textDecoration: "underline",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar expand="lg">
        <Container className="nav-container">
          <Navbar.Brand href="/">
            <p className="brand">
              SuperSpeech
            </p>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="icon"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* <Nav className="me-auto"></Nav>
            <Nav className="ml-auto" activeKey={location.pathname}>
              <NavLink
                to="/"
                className="linkStyle"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Home
              </NavLink>
              <NavLink
                to="/calendar"
                className="linkStyle"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Calendar
              </NavLink>
              <NavLink
                to="/todo"
                className="linkStyle"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Todo
              </NavLink>
              <NavLink
                to="/pomodoro"
                className="linkStyle"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                Pomodoro
              </NavLink>
              <NavLink
                to="login"
                className="linkStyle"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("id");
                }}
              >
                Logout
              </NavLink>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  );
}

export default Navigation;

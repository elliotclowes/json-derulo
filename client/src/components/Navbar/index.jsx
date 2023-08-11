import { NavLink, Outlet } from "react-router-dom";


function Navigation() {
  let activeStyle = "underline";

  return (
    <div className="flex flex-col">
      <nav className="bg-white px-4 py-2 lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
            SuperSpeech
          </NavLink>
          <button className="lg:hidden" aria-controls="navigation-menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div id="navigation-menu" className="lg:flex lg:space-x-4">
          <NavLink
            to="/"
            className="text-gray-600 hover:text-gray-800"
            activeClassName={activeStyle}
          >
            Home
          </NavLink>
          <NavLink
            to="/calendar"
            className="text-gray-600 hover:text-gray-800"
            activeClassName={activeStyle}
          >
            Calendar
          </NavLink>
          <NavLink
            to="/todo"
            className="text-gray-600 hover:text-gray-800"
            activeClassName={activeStyle}
          >
            Todo
          </NavLink>
          <NavLink
            to="/pomodoro"
            className="text-gray-600 hover:text-gray-800"
            activeClassName={activeStyle}
          >
            Pomodoro
          </NavLink>
          <NavLink
            to="/login"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("id");
            }}
          >
            Logout
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navigation;

import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

import logo from "../../assets/images/logo.png"
import ThemeToggle from "./Theme/ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-[#26204B] py-4 text-white">
      <div className="w-10/12 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-semibold">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white text-2xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-white font-semibold">
          <NavLink
            to="/"
            className="hover:border-2 rounded-2xl border-white px-4 py-2 font-thin text-2xl"
          >
            Home
          </NavLink>
          <NavLink
            to="/add-tasks"
            className="hover:border-2 rounded-2xl border-white px-4 py-2 font-thin text-2xl"
          >
            Add Tasks
          </NavLink>
         
          {user ? (
            <>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-thin text-2xl"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-800 font-thin text-2xl"
            >
              Login
            </Link>
          )}
           <ThemeToggle/>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black text-white flex flex-col items-center mt-4 py-4">
          <NavLink
            to="/"
            className="hover:border-2 rounded-2xl border-white px-4 py-2 font-thin text-2xl"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/add-tasks"
            className="hover:border-2 rounded-2xl border-white px-4 py-2 font-thin text-2xl"
            onClick={() => setIsOpen(false)}
          >
            Add Tasks
          </NavLink>
          
          {user ? (
            <>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2 font-thin text-2xl"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 mt-2 font-thin text-2xl"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
           <ThemeToggle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
///////////////

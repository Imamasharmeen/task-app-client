import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

const Main = () => {
  return (
    <div className="">
      <Navbar></Navbar>
      <div className=' min-h-[calc(100vh-16px)]'>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Main;

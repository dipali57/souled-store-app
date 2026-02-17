import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is sticky - always on top */}
      <Navbar />
      
      {/* Main content - pushes footer down */}
      {/* pt-4 for some spacing below navbar */}
      <main className="flex-grow"> 
        <Outlet />
      </main>
      
      {/* Optional Footer */}
      {/* <Footer /> */}
    </div>
  );
};

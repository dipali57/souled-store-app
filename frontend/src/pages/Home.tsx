import { Carousel } from "../components/Carousel";
import { Products } from "./products/Products";


export const Home = () => {
  return (
 <div className="w-full">
      {/* Rest home page content */}
      <Carousel />
      <div className="container mx-auto px-4 py-12">
        {/* <h2 className="text-2xl font-bold mb-6">
          Featured Collections
        </h2> */}
        <Products />
        {/* other sections */}
      </div>
    </div>
  );
};
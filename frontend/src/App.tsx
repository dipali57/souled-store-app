import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "green",
            color: "white",
            zIndex: 9999,
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
            },
          },
        }}
      /> */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="text-4xl font-bold text-center mt-20 text-blue-600">
        Tailwind v4 is working
      </div>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Account from "./pages/account";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import TopUp from "./pages/TopUp";
import MyDetails from "./pages/MyDetails";
import PurchaseHistory from "./pages/PurchaseHistory";
import Shop from "./pages/Shop";
import About from "./pages/About";
import { ThemeProvider } from "./context/ThemeContext";
import RequireAuth from "./components/RequireAuth";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/points/top-up" element={<RequireAuth><TopUp /></RequireAuth>} />
          <Route path="/account/details" element={<RequireAuth><MyDetails /></RequireAuth>} />
          <Route path="/account/history" element={<RequireAuth><PurchaseHistory /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { CartProvider } from "./components/ShopPage/ListProducts/CartContext";

// Các trang
import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import CheckOutPage from "./pages/CheckOutPage";
import ProductPageUser from "./pages/ProductPage";
import Login from "./pages/auth/Login";
import AccountPageUser from "./pages/AccountPageUser";
import LogOutUser from "./pages/LogOutUser";
import ShippingPage from "./pages/shipping/ShippingPage";

// Lazy load components
const ProductPage = lazy(() => import("./pages/product/ProductPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OrderPage = lazy(() => import("./pages/order/OrderPage"));
const CategoriesPage = lazy(() => import("./pages/category/CategoriesPage"));
const LogoutPage = lazy(() => import("./pages/LogoutPage"));
const AddProductPage = lazy(() => import("./pages/product/AddProductPage"));
const AddCategoryPage = lazy(() => import("./pages/category/AddCategoryPage"));
const AccountsPage = lazy(() => import("./pages/account/AccountsPage"));
const AccountPage = lazy(() => import("./pages/auth/AccountPage"));

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <CartProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    {/* Route dành cho người dùng */}
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductPageUser />} />
                    <Route path="/checkout" element={<CheckOutPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<AccountPageUser />} />
                    <Route path="/log-out" element={<LogOutUser />} />

                    {/* Route dành cho quản trị viên */}
                    <Route path="/admin/*" element={<DashboardPage />} />
                    <Route path="/admin/shipping" element={<ShippingPage />} />
                    <Route path="/auth/*" element={<AccountPage />} />
                    <Route path="/admin/product/*" element={<ProductPage />} />
                    <Route path="/admin/order/*" element={<OrderPage />} />
                    <Route path="/admin/categories/*" element={<CategoriesPage />} />
                    <Route path="/admin/accounts/*" element={<AccountsPage />} />
                    <Route path="/admin/logout" element={<LogoutPage />} />
                    <Route path="/admin/product/add-product" element={<AddProductPage />} />
                    <Route path="/admin/categories/add-category" element={<AddCategoryPage />} />
                </Routes>
            </Suspense>
        </CartProvider>
    );
}

export default App;

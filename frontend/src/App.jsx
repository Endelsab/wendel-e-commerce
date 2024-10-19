import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import LoadingSpinner from "./pages/LoadingSpinner";
import AdminPages from "./pages/AdminPages";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/CategoryPage";
import { useEffect } from "react";
import { useCartStore } from "./stores/useCartStore";
import CartPage from "./pages/CartPage";

function App() {
	const { user, checkingAuth, checkAuth } = useUserStore();

	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
				</div>
			</div>

			<div className="relative z-50 pt-20">
				<NavBar />
				<Routes>
					<Route path="/" element={user ? <HomePage /> : <LandingPage />} />

					<Route
						path="/signup"
						element={!user ? <SignupPage /> : <Navigate to="/" />}
					/>

					<Route
						path="/login"
						element={!user ? <LoginPage /> : <Navigate to="/" />}
					/>

					<Route
						path="/admin-dashboard"
						element={
							user?.role === "admin" ? <AdminPages /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/category/:category"
						element={user ? <CategoryPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/cart"
						element={user ? <CartPage /> : <Navigate to="/login" />}
					/>
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App;

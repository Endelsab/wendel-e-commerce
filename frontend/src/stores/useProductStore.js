import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
	//zustand variable
	products: [],
	loading: false,

	//zustand function
	setProducts: (products) => set({ products }),

	createProduct: async (productForm) => {
		set({ loading: true });

		try {
			const res = await axios.post("/products/createProduct", productForm);

			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product successfully created");
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in creating a product ",
			);
		}
	},

	getAllProducts: async () => {
		set({ loading: true });

		try {
			const res = await axios.get("/products/getAllProducts");

			set({ products: res.data.products, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in getting a products ",
			);
		}
	},

	deleteProduct: async (productID) => {
		set({ loading: true });

		try {
			await axios.delete(`/products/deleteProduct/${productID}`);
			set((prevState) => ({
				products: prevState.products.filter(
					(product) => product._id !== productID,
				),

				loading: false,
			}));
			toast.success("Product successfully deleted");
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in deleting a products ",
			);
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });

		try {
			const response = await axios.patch(
				`/products/toggleFeaturedProducts/${productId}`,
			);

			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId
						? { ...product, isFeatured: response.data.isFeatured }
						: product,
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in featuring a products ",
			);
		}
	},

	getProductByCategory: async (category) => {
		set({ loading: true });

		try {
			const res = await axios.get(`/products/productsCategory/${category}`);

			set({ products: res.data.products, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in getting  a products  by category",
			);
		}
	},

	getFeaturedProducts: async () => {
		set({ loading: true });

		try {
			const res = await axios.get("/products/featuredProducts");
			set({ products: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(
				error.response.data.message ||
					"An error occured in getting  a featured products  ",
			);
		}
	},
}));

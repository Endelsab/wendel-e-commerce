import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../Models/productModel.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		res.status(500).json({ getAllProductsError: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");

		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if wala sa redis, get in the database
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("error in getting featured products", error.message);
		res.status(500).json({ errorInFeaturedProducts: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, price, category, description, image } = req.body;

		if (!name || !price || !category || !description || !image) {
			res.status(400).json({ errorInCreatingProduct: "All fields  required" });
		}

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, {
				folder: "products",
			});
		}
		const product = await Product.create({
			name,
			price,
			category,
			description,
			image: cloudinaryResponse?.secure_url
				? cloudinaryResponse.secure_url
				: "",
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("error in creating a product:", error.message);
		res.status(500).json({ errorInCreatingProduct: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const productID = req.params.id;

		const product = await Product.findById(productID);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicID = product.image.split("/").pop().split(".")[0];

			try {
				await cloudinary.uploader.destroy(`products/${publicID}`);
				console.log("Deleted image from cloudinary");
			} catch (error) {
				console.log("error in deleting image from cloudinary", error);
			}
		}

		await Product.findByIdAndDelete(productID);
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("errorInDeletingProduct", error.message);
		res.status(500).json({ errorInDeletingProduct: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductByCategory = async (req, res) => {
	const { category } = req.params;

	try {
		const products = await Product.find({ category }).lean();

		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProducts = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			product.isFeatured = !product.isFeatured;

			const updatedProduct = await product.save();

			await updateFeaturedProductCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("Error in update cache");
	}
}

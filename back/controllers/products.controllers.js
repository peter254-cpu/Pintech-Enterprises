import redis from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.log("Error in getproducts", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    //if not in  redis
    //lean()
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    //store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log("error retriving featured products", error.message);
  }
};

export const createProduct = async (req, res) => {
  const { name, description, category, price, image, isFeatured } = req.body;
  try {
    let cloudinaryResponse = null;
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
      isFeatured,
    });
    res.status(201).json(product);
  }else{
    res.status(401).json({message: "Server Error", error: error.message})
  }
  } catch (error) {
    console.log("Error in createProduct controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; //this gets the id of the image for deletion
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
  } catch (error) {
    consolr.log(error);
  }
};

export const getRecommendendProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
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
    return res.json(products);
  } catch (error) {
    console.log("Error in recomending products", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const  toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await  Product.findById(req.params.id)
    if(product){
      product.isFeatured = !product.isFeatured
      const updatedProduct = await product.save()

      //update the cache
      await updatedFeaturedProductsCache()
      res.json(updatedProduct)
    }else{
      res.status(404).json({message: "Product no found"})
    }
  } catch (error) {
    console.log("Error while toggleling the featured products", error)
    res.status(500).json({ message: "Server error", error: error.message})
  }
}

async function updatedFeaturedProductsCache(){
  try {
    const featuredProducts = await Product.find({isFeatured: true}).lean()
    await redis.set("featured_products", JSON.stringify(featuredProducts))
  } catch (error) {
    console.log("error in update cache function")
  }
}
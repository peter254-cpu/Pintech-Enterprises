import { create } from "zustand"
import toast from "react-hot-toast"
import axios from "../lib/axios"


export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({products}),
    createProduct: async(productData) => {
        set({loading: true});
        try {
            const res = await axios.post("/products/create_product", productData)       
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
            toast.success("Product Published SuccessFully")
        } catch (error) {
            toast.error(error.response.data.error)
            set({loading: false})
        }
    },

    fetchAllProducts: async() => {
        set({loading: true})
        try {
            const response = await axios.get("/products")
            set({products: response.data.products, loading: false})
        } catch (error) {
            set({error: "Failed to fetch products", loading: false})
            toast.error(error.response.data.error)
        }
    },
    fetchFeaturedProducts: async () => {
      set({ loading: true })
      try{
        const response = await axios.get("/products/featured")
        set({products: response.data, loading: false })
      }catch(error){
        set({error: "Failed to fetch products", loading: false})
        console.log(error)
      }
    },
    fetchProductsByCategory: async (category) => {
        set({ loading: true });
      
        try {
          const response = await axios.get(`/products/category/${category}`);
          set({ products: response.data.products, loading: false });
          console.log("Products fetched", response.data.products)
        } catch (error) {
          set({ error: "Failed to fetch products", loading: false });
          toast.error(error.response.data.error || "An error occurred while fetching products");
        }
      },
          deleteProduct: async (productId) => {
        set({ loading: true });  // Set loading to true before making the request
        try {
          await axios.delete(`/products/delete_product/${productId}`);
          set((state) => ({  // Use the function form to access the current state
            products: state.products.filter((product) => product._id !== productId),
            loading: false
          }));
        } catch (error) {
          set({ loading: false });  // Ensure loading is set to false on error
          toast.error(error.response?.data?.error || "Failed to delete product");
        }
      },
      
      toggleFeaturedProducts: async (productId) => {
        set({ loading: true });
        
        try {
          const response = await axios.patch(`/products/${productId}`);
          
          set((prevState) => ({
            products: prevState.products.map((product) =>
              product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
            ),
            loading: false
          }));
        } catch (error) {
          set({ loading: false });
          toast.error(error.response.data.error);
        }
      },
         
}))


/* eslint-disable react/prop-types */
import { ShoppingCart } from "lucide-react"
import { useUserStore } from "../store/useUserStore"
import toast from "react-hot-toast"
import { useCartStore } from "../store/useCartStore"


const ProductCard = ({product}) => {
    const {user} = useUserStore()
    const {addToCart} = useCartStore()
    const addItemToCart = () => {
        if(!user){
            toast.error("Please Create An Account To Add Products to cart", {id: "login"})
        }else{
            addToCart(product)
           toast.success(`${product.name} added to cart`, {id: "product"})
        }
    }

  return (
    <div className="shadow-lg flex flex-col relative overflow-hidden rounded-lg border border-gray-700">
        <div className="relative mt-3 mx-3 flex h-60 overflow-hidden rounded-xl">
            <img src={product.image} alt="product image" className="object-cover w-full" />
            <div className="absolute inset-0 bg-black bg-opacity-20 " />
        </div>
        <div className="mt-4 px-5 pb-5">
            <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
                <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
            </p>
        </div>
        <button
            className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600"
            onClick={addItemToCart}
        >
            <ShoppingCart />
            Add To Cart
        </button>
    </div>
  )
}

export default ProductCard
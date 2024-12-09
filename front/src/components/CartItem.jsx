/* eslint-disable react/prop-types */
import { Minus, Plus, Trash } from "lucide-react"
import { useCartStore } from "../store/useCartStore"


const CartItem = ({item}) => {
    const { removeFromCart,updateQuantity } = useCartStore()

    function limitDescription(description) {
        // Check if the description is longer than 100 characters
        if (description.length > 100) {
          // Return the first 20 characters followed by an ellipsis
          return description.substring(0, 100) + '...';
        } else {
          // If the description is 100 characters or less, return it as is
          return description;
        }
      }
           
  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
            <div className="shrink-0 md:order-1">
                <img src={item.image}  className="h-20 md:h-32 rounded object-cover" />
            </div> 
            <label className="sr-only">Choose Quantity</label>

            <div className="flex items-center justify-between md:order-3 md:justify-end">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => updateQuantity()}
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <Minus
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="text-gray-300" />
                    </button>
                    <p>{item.quantity}</p>
                    <button
                        
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <Plus 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="text-gray-300"
                        />
                    </button>
                </div>
                <div className="text-end md:order-4 md:w-32">
                    <p className="text-base text-emerald-400">${item.price}</p>
                </div>
            </div>
            <div className="w-full min-w-0 flex-1 space-y-4 md:max-w-md">
                <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">{item.name}</p>
                <p className="text-sm text-gray-400">{limitDescription(item.description)}</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() =>  removeFromCart(item._id)}
                        className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-100 hover:underline"
                    >
                        <Trash />
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItem
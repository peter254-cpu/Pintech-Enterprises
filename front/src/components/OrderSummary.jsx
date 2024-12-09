import { motion } from "framer-motion"
import { useCartStore } from "../store/useCartStore"
import { Link } from "react-router-dom"
import { MoveRight } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import axios from "../lib/axios"


const stripePromise = loadStripe("pk_test_51QChNMGSP4HWJgvobgRdxb6olh9wlM550GPMULx7QrDqSsit1khyILrIX1vRpMdMwCA1DzAHPINoUsOOdrFTCP6M00laYJUuFd")

const OrderSummary = () => {
    const { total, subtotal, coupon, couponIsApplied, cart } = useCartStore()
    const savings = total - subtotal
    const formattedSubtotal = subtotal.toFixed(2)
    const formattedTotal = total.toFixed(2)
    const formattedSavings = savings.toFixed(2)

    const handleClick = async () => {
        try {
            const stripe = await stripePromise
           const res =  await axios.post("/payments/create-checkout-session", {products: cart, coupon: coupon ? coupon.code: null })
            const session = res.data 
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            })

            if(result.error){
                console.error("Error", result.error)
            }
        } catch (error) {
           console.log(error) 
        }
    }
    return (
        <motion.div
            className="space-y-4 rounded-lg border  border-gray-700 bg-gray-800 p-2 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-xl font-semibold text-emerald-400">Order Summary</p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Original Price</dt>
                        <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
                    </dl>
                    {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Savings</dt>
                            <dd className="text-base font-medium text-emerald-400">${formattedSavings}</dd>
                        </dl>
                    )}
                    {coupon && couponIsApplied && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Coupon ({coupon?.code})</dt>
                            <dd className="text-base font-medium text-emerald-400">{coupon?.discountPercentage}%</dd>
                        </dl>
                    )}
                </div>
                <motion.button 
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={handleClick}
                >
                    Proceed To Checkout
                </motion.button>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-400">or</span>
                    <Link to={"/"}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>

        </motion.div>
    )
}

export default OrderSummary
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"



const EmptyCard = () => {
    return (
        <motion.div
             initial={{opacity: 0, y: -20}}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: .2 }}
             className="flex flex-col items-center space-y-4 py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300" />
            <h3 className="text-2xl font-semibold">Your Shopping Cart Is Empty</h3>
            <p className="text-gray-400">Looks Like You Have Not Added Anything In Your Cart </p>
            <Link to={"/"} className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600" >
                Start Shopping
            </Link>
        </motion.div>
      )
}
export default EmptyCard
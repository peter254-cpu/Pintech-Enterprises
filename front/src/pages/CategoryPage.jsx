import { useEffect } from "react"
import { useProductStore } from "../store/useProductStore"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import ProductCard from "../components/ProductCard"
const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore()
  const { category } = useParams()
  useEffect(() => {
    fetchProductsByCategory(category)
  }, [fetchProductsByCategory, category])
 
  return (
    <div className="min-h-screen">
      <div className="relative z-10 maximum-w-screen-xl max-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
        {products?.length === 0 && (
          <h2 className="text-3xl font-semibold text-center text-gray-300 col-span-full">No Products Found</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
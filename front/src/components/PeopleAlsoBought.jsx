import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import LoadingSpinner from "./LoadingSpinner"
import axios from "../lib/axios"
import toast from "react-hot-toast"

const PeopleAlsoBought = () => {
  const [isLoading, setIsLoading] = useState([])
  const [recommendations, setRecommendations] = useState([])
  useEffect(() => {
    const getRecommendedProducts = async () =>{
      try {
        const res = await axios.get("/products/recommendations")
        setRecommendations(res.data)
      } catch (error) {
        toast.error(error.res.data.message || "Error while retrieving recomended products")
      }finally{
        setIsLoading(false)
      }
    }
    getRecommendedProducts()
  }, [])

  if(isLoading){
    <LoadingSpinner />
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
export default PeopleAlsoBought


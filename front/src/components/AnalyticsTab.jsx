import { useEffect, useState } from "react"
import AnalyticsCard from "./AnalyticsCard"
import axios from "../lib/axios"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { motion } from "framer-motion"
import  { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis }  from "recharts"


const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dailySalesData, setDailySalesData] = useState([])
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try{
        const response = await axios.get("/analytics")
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData)
        setIsLoading(false)
        
      }catch (error){
          console.log("Error fetching analytics data", error)
          setIsLoading(false)
      }finally{
        setIsLoading(false)
      }
    }
    fetchAnalyticsData()
  }, [])
  if(isLoading) return "Loading..."
  return (
  <div className="max-w-7xl mt-4 mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AnalyticsCard 
        title='Total Users'
        value={analyticsData.users.toLocaleString()}
        icon={Users}
        color='from-emarald-500 to-teal-700'
      />

      <AnalyticsCard 
        title='Total Products'
        value={analyticsData.products.toLocaleString()}
        icon={Package}
        color='from-emarald-500 to-teal-700'
      />
       <AnalyticsCard 
        title='Total Sales'
        value={analyticsData.totalSales.toLocaleString()}
        icon={ShoppingCart}
        color='from-emarald-500 to-teal-700'
      />
       <AnalyticsCard 
        title='Total Revenue'
        value={`$${analyticsData.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        color='from-emarald-500 to-teal-700'
      />
    </div>
    <motion.div
      className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
          <CartesianGrid strokeDasharray='3-3' />
          <XAxis dataKey='name' stroke='#D1D5DB' />
          <YAxis yAxisId='left' stroke='#D1D5DB' />
          <YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
          <Tooltip />
          <Legend />

          <Line 
            yAxisId='left'
            type='monotone'
            dataKey='sales'
            stroke='#108981'
            activeDot={{ r: 8 }}
            name='Sales'
          />

          <Line 
            yAxisId='right'
            type='monotone'
            dataKey='revenue'
            stroke='#3882F6'
            activeDot={{ r: 8 }}
            name='Revenue'     
          />

          </LineChart>
        </ResponsiveContainer>
    </motion.div>
  </div>
  )
}

export default AnalyticsTab
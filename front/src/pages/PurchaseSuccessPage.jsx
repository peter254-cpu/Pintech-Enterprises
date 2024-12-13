import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, HandHeart, } from "lucide-react"
import { useCartStore } from '../store/useCartStore'; // Ensure correct path to your store
import axios from '../lib/axios';
import Confetti from 'react-confetti';

const PurchaseSuccessPage = () => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore(); // Get clearCart function from the cart store

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        // Post to checkout-success endpoint to confirm successful checkout
        await axios.post("/payments/checkout-success", { sessionId });
        clearCart(); // Clear the cart after successful checkout
      } catch (error) {
        console.log(error); // Log any errors
        setError(error.message); // Set error state if an error occurs
      } finally {
        setIsProcessing(false); // Ensure processing is set to false after handling
      }
    };

    // Retrieve session ID from URL parameters
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      handleCheckoutSuccess(sessionId); // Process the successful checkout if session ID is found
    } else {
      setIsProcessing(false); // Stop processing if no session ID is found
      setError("No session id found in the url"); // Set error state if no session ID is found
    }
  }, [clearCart]); // Dependency array ensures the effect runs when clearCart changes

  if (isProcessing) return "Processing ....."; // Show processing message while handling checkout
  if (error) return `Error: ${error}`; // Show error message if an error occurs


  return (
    <div className="flex h-screen px-4 items-center justify-center">
      <Confetti
        width={
          window.innerWidth
        }
        height={
          window.innerHeight
        }
        gravity={0.1}
        style={{ zIndex: 90 }}
        numberOfPieces={700}
        recycle={false}
      />
      
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-600 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Successful
          </h1>
          <p className="text-gray-300 text-center mb-2">
            Thanks for your order. {"We're"} processing it now.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email for details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-400">Order Number</span>
              <span>#12345</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-emerald-400">3 - 5 business days</span>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center">
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              className="w-full flex justify-between items-center bg-gray-700 hover:bg-gray-600 text-emerald-600 font-bold py-2 px-4 rounded-lg transition duration-300"
              to={"/"}
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;




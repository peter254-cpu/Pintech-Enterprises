import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const Login = () => {
  const {login, user} = useUserStore()

  const loading = false;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl font-extrabold text-emerald-300 mt-4 text-center">
          Login In To Your Account
        </h2>
      </motion.div>
      <motion.div
        className="mt-6 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-6 px-6 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 mb-3 bg-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="example_@gmail.com"
                />
              </div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block mb-3 w-full px-3 py-2 pl-10 bg-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Create A Strong Password"
                />
              </div>
            </div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            bg-emerald-600 hover:bg-emerald-700 focus:outline focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50
            "
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" aria-hidden="true" />
                  Login
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account...?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Sign Up
              <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

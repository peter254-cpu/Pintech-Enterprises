import CategoryItem from "../components/CategoryItem";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpeg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/t-shirts.jpeg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpeg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpeg" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpeg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpeg" },
];


const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore What We Have To Offer
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <CategoryItem key={category.name} category={category} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
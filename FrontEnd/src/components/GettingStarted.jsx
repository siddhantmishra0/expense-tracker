
import { useNavigate } from "react-router-dom"

export default function GettingStarted() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="ml-2 text-2xl font-bold text-gray-900">ExpenseTracker</span>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium" onClick={()=>navigate("/login")}>
                Sign In
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium" onClick={()=>navigate("/register")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-indigo-600 block">Financial Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track, analyze, and optimize your expenses with our intuitive expense tracker. Get started in minutes and
            see where your money goes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center" onClick={()=>navigate("/register")}>
              Start Tracking Now
              {/* <ChevronRight className="ml-2 h-5 w-5" /> */}
            </button>

          </div>
        </div>
      </section>


    </div>
  )
}

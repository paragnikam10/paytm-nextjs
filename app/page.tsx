import axios from "axios";

async function getUserData() {
  try {
    const response = await axios.get("http://localhost:3000/api/user/signup")
    return response.data;

  } catch (e) {
    console.log(e);
    return null;
  }
}

export default async function Home() {
  const userDetails = await getUserData();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center ">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Paytm</h1>
            </div>
            <div>
              <a href="/signin" className="text-gray-800 text-xl font-semibold mr-12 hover:underline">
                Sign In
              </a>
              <a href="/signup" className="text-gray-700 text-xl  font-semibold mr-4 hover:underline">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] ">
        <div className="bg-white shadow-lg  rounded-lg border border-gray-100 p-8 w-full max-w-3xl">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 ">Welcome</h1> 
          <p className="text-center text-gray-600 mb-8">what would you like to do today?</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <button className="text-white bg-gray-800 hover:bg-gray-900 py-4 px-6 rounded-lg w-full">Recharge</button>
              <p className="text-gray-500 mt-2">Mobile & DTH</p>
            </div>

            <div className="flex flex-col items-center">
              <button className="text-white bg-gray-800 hover:bg-gray-900 py-4 px-6 rounded-lg w-full">Electricity Bills</button>
              <p className="text-gray-500 mt-2">Pay Bills</p>
            </div>

            <div className="flex flex-col items-center">
              <button className="text-white bg-gray-800 hover:bg-gray-900 py-4 px-6 rounded-lg w-full">Plane Tickets</button>
              <p className="text-gray-500 mt-2">Book Flights</p>
            </div>

            <div className="flex flex-col items-center">
              <button className="text-white bg-gray-800 hover:bg-gray-900 py-4 px-6 rounded-lg w-full">More Services</button>
              <p className="text-gray-500 mt-2">Explore</p>
            </div>


          </div>






        </div>
      </div>
    </div>

  );
}

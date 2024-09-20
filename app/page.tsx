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
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="border border-blue-500 p-8 rounded ">
          <div>
            Name : {userDetails?.name}
          </div>
          Email : {userDetails?.email}
        </div>
      </div>
    </div>
  );
}

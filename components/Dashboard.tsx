"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string,
    username: string,
    firstname: string,
    lastname: string
}

export default function Dashboard() {
    const [balance, setBalance] = useState<number | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>("")
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getBalance = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await axios.get("http://localhost:3000/api/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBalance(response.data.balance)
                setFirstName(response.data.username)

            } catch (error) {
                console.error("Error fetching balance", error)
            }
        }
        getBalance();
    }, [])

    useEffect(() => {
        if (searchName) {
            const fetchUsers = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`http://localhost:3000/api/user/users?filter=${searchName}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setUsers(response.data.users || []);
                } catch (error) {
                    console.error("Error fetching users", error)
                }
            }
            fetchUsers();
        } else {
            setUsers([])
        }

    }, [searchName])

    const handleSendMoney = (user: User) => {
        router.push(`/sendmoney?userId=${user.id}&firstname=${user.firstname}&lastname=${user.lastname}`)
    }

    return (
        <div className="min-h-screen p-6 ">
            <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-bg-gray-800  ">
                        Paytm app

                    </h2>
                    {firstName && (
                        <div className="   text-lg font-mono font-bold text-teal-600 ">
                            Hello, {firstName}!
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mb-6">
                    User's Balance : {" "}{balance !== null ? `₹${balance.toFixed(2)}` : "Loading..."}
                </h3>
                <div>
                    <input
                        className="p-2 border border-gray-300 outline-none rounded-lg w-full"
                        type="text"
                        placeholder="search by first or last name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>

                <div className="mt-2">
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <div key={user.id} className="mb-2">
                                <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                                    <div className="text-gray-800 font-medium">
                                        {user.firstname} {user.lastname}
                                    </div>
                                    <button onClick={() => handleSendMoney(user)} className="text-white px-4 py-2 rounded-lg bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium">
                                        Send Money
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">
                            No users found
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}
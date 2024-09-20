"use client"

import axios from "axios";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SendMoney() {
    const SearchParams = useSearchParams();
    const userId = SearchParams.get("userId");
    const firstname = SearchParams.get("firstname");
    const lastname = SearchParams.get("lastname");
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("")

    const handleTransferMoney = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post("http://localhost:3000/api/account/transfer", {
                amount: amount || null,
                to: userId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            console.log("money sent successfully", response.data.amount)
            setMessage(`Payment of ₹${amount} to ${firstname?.toUpperCase()} ${lastname?.toUpperCase()} successful.`)
            setShowModal(true);
            setAmount("");
        } catch (error) {
            setMessage("Error transferring money")
            console.log("Error transferring money", error)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen flex justify-center items-center  ">
            <div className={`bg-white p-8 rounded-lg  hover:bg-gray-100 w-full max-w-md border border-gray-200 ${showModal ? 'blur-sm' : ''}`}>
                <h3 className="text-xl font-semibold mb-6 ">Transfer money to {firstname?.toUpperCase()} {lastname?.toUpperCase()} </h3>
                <input
                    className="w-full p-2 mb-6 rounded-lg coutline-none bg-gray-50 border border-gray-300text-gray-900 focus: ring-blue-500 focus:bg-gray-100 "
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex justify-center gap-6">
                    <button className="px-4 py-2 rounded-lg  text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium" onClick={handleTransferMoney}>Transfer Money</button>
                    <button className="px-4 py-2 rounded-lg  text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium" onClick={() => router.push("/dashboard")}>Cancel</button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 min-h-screen flex justify-center items-center bg-black bg-opacity-50 ">
                    <div className="bg-white text-center p-8 rounded-lg  hover:bg-gray-100 w-full max-w-md border border-gray-200">
                        <p className="font-semibold mb-4">{message}</p>
                        <button className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition-colors" onClick={handleCloseModal}>Close </button>
                    </div>
                </div>
            )}

        </div>
    )
}
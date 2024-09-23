"use client"

import { decodeJwt } from "jose";
import axios from "axios";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";


interface Transaction {
    id: string;
    amount: number;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

interface DecodedToken {
    userId: string,
    id: string
}

export default function TransactionHistory() {
    const SearchParams = useSearchParams();
    const receiverId = SearchParams.get("userId");
    const firstName = SearchParams.get("firstname");
    const lastName = SearchParams.get("lastname");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)


    useEffect(() => {
        if (receiverId) {
            const fetchTransactions = async () => {
                try {
                    const token = localStorage.getItem("token")
                    if (token) {
                        const decodedToken: DecodedToken = decodeJwt(token);
                        const userId = decodedToken.id;
                        setCurrentUserId(userId)
                    }
                    const response = await axios.get(`http://localhost:3000/api/account/transaction-history?userId=${receiverId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setTransactions(response.data.transactions || []);
                } catch (error) {
                    console.error("Error fetching transactions", error);
                }
            }
            fetchTransactions();
        } else {
            setTransactions([])
        }
    }, [receiverId])

    return (
        <div className="min-h-screen p-6">
            <div className=" bg-white max-w-lg mx-auto border  border-gray-200 shadow hover:bg-gray-100  p-8 rounded-lg">

                <h2 className=" text-center text-2xl font-semibold mb-4 ">
                    {firstName?.toUpperCase()} {lastName?.toUpperCase()}
                </h2>

                {transactions.length > 0 ? (
                    <ul className="space-y-4 mt-8">
                        {transactions.map((transaction) => (
                            <li
                                key={transaction.id}
                                className={`flex ${transaction.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-lg shadow-lg ${transaction.senderId === currentUserId ? " bg-gray-800 text-white" : "bg-gray-600 text-white"
                                        }`}
                                >
                                    <p className="font-medium">₹{transaction.amount}</p>
                                    <p className="text-sm">
                                        {new Date(transaction.createdAt).toLocaleDateString()} {new Date(transaction.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transactions found</p>
                )}
            </div>
        </div>
    );
}
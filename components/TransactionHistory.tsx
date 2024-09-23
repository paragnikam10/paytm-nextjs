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

    function groupTransactionsByDate(transactions: Transaction[]): { [date: string]: Transaction[] } {
        const groupedByDate: { [date: string]: Transaction[] } = {}
        transactions.forEach((transaction) => {
            const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            if (!groupedByDate[date]) {
                groupedByDate[date] = []
            }
            groupedByDate[date].push(transaction);
        })
        return groupedByDate
    }

    const groupedTransactions = groupTransactionsByDate(transactions);

    return (
        <div className="min-h-screen p-6">
            <div className=" bg-white max-w-lg mx-auto border  border-gray-200 shadow hover:bg-gray-100 p-8 rounded-lg">

                <h2 className=" text-center text-2xl font-semibold mb-4 ">
                    {firstName?.toUpperCase()} {lastName?.toUpperCase()}
                </h2>

                {transactions.length > 0 ? (
                    <div className="space-y-4 mt-8">
                        {Object.entries(groupedTransactions).map(
                            ([date, transactionsForDate]) => (
                                <div key={date}>
                                    <h3 className=" text-center font-semibold text-lg text-gray-700 mb-2">
                                        {date}
                                    </h3>

                                    <ul className="space-y-4">
                                        {transactionsForDate.map((transaction) => (
                                            <li key={transaction.id} className={`flex ${transaction.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                                                <div className={` relative  max-w-md rounded-lg shadow-lg ${transaction.senderId === currentUserId ? "bg-gray-800 text-white" : "bg-gray-600 text-white"}`}>
                                                    <div className="  px-12 py-4   ">
                                                        <div className=" mb-3 font-medium text-2xl   ">
                                                            ₹{transaction.amount}
                                                        </div>
                                                    </div>
                                                    <div className="  text-xs bottom-1 right-1 absolute ">
                                                        {new Date(transaction.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </div>

                                                </div>

                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-center mt-8 text-gray-800 text-lg">No transactios found</p>
                )}
            </div>
        </div>
    );
}
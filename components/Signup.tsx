"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [firstname, setFirstname] = useState<String>("");
    const [lastname, setLastname] = useState<String>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/user/signup", {
                firstname,
                lastname,
                username,
                password
            })
            const { token } = response.data;

            if (token) {
                localStorage.setItem("token", token)
                router.push("/dashboard")
            } else {
                console.error("Token not received from server")
            }
        } catch (error) {
            console.error('Error during signup', error);
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <a href="#" className=" w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" >

                <div>
                    <div className="px-10">
                        <div className=" text-center text-3xl font-extrabold">
                            Sign Up
                        </div>
                    </div>

                    <div className="pt-2">
                        <LabelledInput onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFirstname(e.target.value)
                        }} label="First Name" type={"text"} placeholder="first name" />
                        <LabelledInput onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setLastname(e.target.value)
                        }} label="Last Name" type={"text"} placeholder="last name" />
                        <LabelledInput onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setUsername(e.target.value);
                        }} label="Username" placeholder="harkirat@gmail" />
                        <LabelledInput onChange={(e: any) => {
                            setPassword(e.target.value)
                        }} label="Password" type={"password"} placeholder="123456" />
                        <button onClick={handleSignup} type="button" className="mt-8 w-full text-white bg-gray-800 focus:ring-4
                               focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Sign up</button>
                    </div>

                </div>
            </a>
        </div >

    </div >
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
    return <div>

        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 
        text-gray-900 text-sm rounded-lg focus: ring-blue-500 focus:bg-gray-100 block w-full 
        p-2.5" placeholder={placeholder} required />

    </div>
}
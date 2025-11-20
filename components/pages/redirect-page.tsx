"use client"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import BeatLoader from 'react-spinners/BeatLoader';
import { useAuth } from "@/contenxts/AuthContext";

export default function RedirectPage() {
    const [param] = useSearchParams();
    const history = useRouter();
    const {login} = useAuth();
    const verifyUser = async (code: [string, string]) => {
        try {            
            login(await api.get(`/api/user/oauth2/kakao?code=${code[1]}`));
        } catch(err){
            console.log(err);
            history.push("/");
        }
    }

    useEffect(() => {
        param ? verifyUser(param) : history.push("/");
    }, [])

    return (
        <BeatLoader size={25} color="#7d98f5"/>
    )
}

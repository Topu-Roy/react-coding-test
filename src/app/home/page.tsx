'use client'
import { Button } from "@nextui-org/react"
import { useUserStore } from "@/zustand/userStore"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { UserDataType } from "@/utils/fetch"
import { InputsForAPI } from "@/components/Form"


type UserDataTypeForFetchReq = {
    name: string
    sectorId: string
}

function page() {
    const [user, setUser] = useState<UserDataType>()
    const { setObj, obj } = useUserStore()
    let myObj: InputsForAPI | undefined;

    function handelClick() {
        setObj({
            name: '',
            sectorId: '',
            acceptedTerms: false
        })
    }

    useEffect(() => {
        if (obj?.name === '' && obj.sectorId === '') redirect('/')
        myObj = obj;
    }, [obj])

    useEffect(() => {
        // * Fetch data from the server
        async function fetchSingleUser(data: UserDataTypeForFetchReq) {
            try {
                const req = await fetch("api/getSingleUser", {
                    method: 'POST',
                    body: JSON.stringify(data)
                });

                if (!req.ok) {
                    throw new Error(`HTTP error! Status: ${req.status}`);
                }

                const res = await req.json();
                return res;

            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        }

        // * setting the state with the result
        if (myObj !== undefined && myObj !== null) {
            try {
                const data = fetchSingleUser({ name: myObj.name, sectorId: myObj.sectorId });
                data.then((data) => setUser(data as any))
            } catch (error) {
                console.error("Error handling user data:", error);
            }
        }
    }, [myObj])

    return (
        <div className="flex justify-center flex-col items-center">
            <Button onClick={handelClick}>
                Delete from local storage
            </Button>
            {user ? (
                <div>
                    <h2>User</h2>
                    <p>ID: {user.user?.id}</p>
                    <p>Name: {user.user?.name}</p>
                    <p>Sector Name: {user.user?.sectorName}</p>
                    <p>acceptedTerms: {user.user?.acceptedTerms ? 'true' : 'false'}</p>

                    <h2>Sector</h2>
                    <p>Sector ID: {user.sector?.id}</p>
                    <p>Sector Name: {user.sector?.label}</p>
                    <p>Sector Value: {user.sector?.value}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    )
}

export default page
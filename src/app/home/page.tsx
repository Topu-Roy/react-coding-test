'use client'
import { Button } from "@nextui-org/react"
import { useUserStore } from "@/zustand/userStore"
import useStore from "@/zustand/nextHydration"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { UserDataType, fetchSingleUser } from "@/utils/fetch"

type ReqDataType = {
    userId: string;
}

function page() {
    const [user, setUser] = useState<UserDataType>()
    const id = useStore(useUserStore, (state) => state.id)
    const { setId } = useUserStore()

    console.log(id)
    function handelClick() {
        setId('')
    }

    useEffect(() => {
        if (id === '') redirect('/')
    }, [id])

    useEffect(() => {
        async function fetchSingleUser(userId: string) {
            try {
                const req = await fetch(`api/getSingleUser?userId=${userId}`);

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

        // Assuming `id` is defined elsewhere in your code
        if (id !== undefined) {
            try {
                const data = fetchSingleUser(id);
                setUser(data as any);
                console.log(user);
            } catch (error) {
                console.error("Error handling user data:", error);
            }
        }
    }, [id])

    return (
        <div className="flex justify-center flex-col items-center">
            <Button onClick={handelClick}>
                Delete from local storage
            </Button>
            {user ? (
                <div>
                    <h2>User</h2>
                    <p>ID: {user.user?.id}</p>
                    <p>ID: {user.user?.name}</p>
                    <p>ID: {user.user?.sectorName}</p>
                    <p>ID: {user.user?.acceptedTerms ? 'true' : 'false'}</p>

                    <h2>Sector</h2>
                    <p>Sector Name: {user.sector?.id}</p>
                    <p>Accepted Terms: {user.sector?.label}</p>
                    <p>Sector ID: {user.sector?.value}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    )
}

export default page
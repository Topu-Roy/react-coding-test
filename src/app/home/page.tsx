'use client'
import { Button } from "@nextui-org/react"
import { useUserStore } from "@/zustand/userStore"
import useStore from "@/zustand/nextHydration"
import { useEffect } from "react"
import { redirect } from "next/navigation"

function page() {
    const id = useStore(useUserStore, (state) => state.id)
    const { setId } = useUserStore()

    function handelClick() {
        setId('')
    }

    useEffect(() => {
        if (id === '') redirect('/')
    }, [id])

    return (
        <div className="flex justify-center items-center">
            <Button onClick={handelClick}>
                Delete from local storage
            </Button>
            <p>{id}</p>
        </div>
    )
}

export default page
'use client'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
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
        <div className="flex justify-center min-h-screen flex-col items-center">
            <Button onClick={handelClick}>
                Delete from local storage
            </Button>
            {user ? (
                <div className="max-w-7xl">
                    <Table aria-label="User Data Table">
                        <TableHeader>
                            <TableColumn>Fields</TableColumn>
                            <TableColumn>Values</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>Name</TableCell>
                                <TableCell>{user.user?.name}</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>Terms & Conditions</TableCell>
                                <TableCell>{user.user?.acceptedTerms ? 'Accepted' : 'Rejected'}</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>Sector</TableCell>
                                <TableCell>{user.sector?.label}</TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>Sector Value</TableCell>
                                <TableCell>{user.sector?.value}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

        </div>
    )
}

export default page
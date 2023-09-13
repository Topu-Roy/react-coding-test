'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
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
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function resetLocalStorage() {
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
            {user ? (
                <div className="max-w-7xl">
                    <Card>
                        <CardHeader>
                            <span className="text-start px-2">User Details</span>
                        </CardHeader>
                        <CardBody>
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
                        </CardBody>
                        <CardFooter>
                            <div className="w-full flex items-center justify-end gap-2 px-2">
                                <Button onPress={onOpen} variant="bordered">Edit</Button>
                                <Button onPress={resetLocalStorage} color="danger">Forget</Button>
                            </div>
                        </CardFooter>
                    </Card>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                    <ModalBody>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Nullam pulvinar risus non risus hendrerit venenatis.
                                            Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                        </p>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Nullam pulvinar risus non risus hendrerit venenatis.
                                            Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                        </p>
                                        <p>
                                            Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                            dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                                            Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                            Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                                            proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                        </p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Action
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

        </div>
    )
}

export default page
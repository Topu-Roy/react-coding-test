'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react"
import { useUserStore } from "@/zustand/userStore"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Inputs, OptionsType, UserDataType, UserDataTypeForFetchReq } from "@/types"
import { SubmitHandler, useForm } from "react-hook-form"
import { fetchAllSectors, sortedObject } from "@/utils/fetch"
import toast from "react-hot-toast"

type SectorType = {
    id: string;
    value: number;
    label: string;
}

function page() {
    const [user, setUser] = useState<UserDataType>()
    const [options, setOptions] = useState<OptionsType>()
    const [validatedData, setValidatedData] = useState<Inputs>()
    const [newSector, setNewSector] = useState<SectorType>()

    const { setObj, obj } = useUserStore()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<Inputs>();

    // * Redirect
    useEffect(() => {
        if (obj.name === '' || obj.sectorId === '') redirect('/')
    }, [obj])

    function resetLocalStorage() {
        setObj({
            name: '',
            sectorId: '',
            acceptedTerms: false
        })
    }

    useEffect(() => {
        fetchAllSectors().then((data) => {
            const sortedObjects = sortedObject(data);
            setOptions(sortedObjects)
        })
    }, []);

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
    useEffect(() => {
        try {
            const data = fetchSingleUser({ name: obj.name, sectorId: obj.sectorId });
            data.then((data) => setUser(data as any))
            // toast('Got the user information',
            //     {
            //         icon: '✅',
            //         style: {
            //             borderRadius: '10px',
            //             background: 'rgb(157 23 77)',
            //             color: '#fff',
            //         },
            //     }
            // );
        } catch (error) {
            console.error("Error handling user data:", error);
            toast('Could get user data',
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '10px',
                        background: 'rgb(157 23 77)',
                        color: '#fff',
                    },
                }
            );
        }
    }, [obj])

    async function updateUser() {

        // if (validatedData === undefined || user === undefined || newSector === undefined) return

        const res = await fetch('/api/updateUser', {
            method: "PATCH",
            body: JSON.stringify({
                userId: user?.user.id,
                newName: validatedData?.name,
                newSectorId: newSector?.id
            })
        });

        if (res.ok) {

            if (validatedData === undefined || user === undefined || newSector === undefined) return

            setObj({
                name: validatedData.name,
                sectorId: newSector.id,
                acceptedTerms: validatedData.acceptedTerms
            })

            toast('Updated Successfully', {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    }

    useEffect(() => {
        if (options === undefined || validatedData === undefined) return;
        const sector = options.find((option) => option.label === validatedData.sector);
        setNewSector(sector)

    }, [options, validatedData])

    useEffect(() => {
        try {
            updateUser();
        } catch (e) {
            toast('Something went wrong',
                {
                    icon: '⛔',
                    style: {
                        borderRadius: '10px',
                        background: 'rgb(157 23 77)',
                        color: '#fff',
                    },
                }
            );
        }
    }, [validatedData]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        setValidatedData({
            name: data.name,
            sector: data.sector,
            acceptedTerms: data.acceptedTerms
        })

        // try {
        //     await updateUser();
        // } catch (e) {
        //     toast('Something went wrong',
        //         {
        //             icon: '⛔',
        //             style: {
        //                 borderRadius: '10px',
        //                 background: 'rgb(157 23 77)',
        //                 color: '#fff',
        //             },
        //         }
        //     );
        // }

    }


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

                    <Modal isOpen={isOpen} backdrop="blur" onOpenChange={onOpenChange}>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Edit Details</ModalHeader>
                                        <ModalBody>
                                            <Card className="p-4 pt-6 flex items-center max-w-lg min-w-[25rem] justify-center flex-col gap-2">
                                                <div className="w-full">
                                                    <Input
                                                        defaultValue={user.user.name}
                                                        {...register("name", { required: true })}
                                                        variant="bordered"
                                                        color={errors?.name ? "danger" : "default"}
                                                        type="text"
                                                        label="Name"
                                                    />
                                                </div>
                                                <Select
                                                    defaultSelectedKeys={[user.sector.label]}
                                                    items={options}
                                                    label="Sector"
                                                    color={errors?.sector ? "danger" : "default"}
                                                    placeholder="Please select the sector"
                                                    variant="bordered"
                                                    {...register("sector", { required: true })}
                                                >
                                                    {(options) => (
                                                        <SelectItem value={options.value} key={options.label}>
                                                            {options.label}
                                                        </SelectItem>
                                                    )}
                                                </Select>
                                                <div className="w-full py-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            {...register("acceptedTerms", { required: true })}
                                                            id="link-checkbox"
                                                            type="checkbox"
                                                            value=""
                                                            className={`${errors.acceptedTerms ? "border-red-700" : "border-gray-300"
                                                                } w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                                                        />
                                                        <label
                                                            htmlFor="link-checkbox"
                                                            className="ml-2 flex gap-1 justify-center items-center text-sm font-medium  dark:text-gray-300 text-gray-900/80"
                                                        >
                                                            {errors?.acceptedTerms ? (
                                                                <span className="text-rose-600/90">
                                                                    Please, agree with the
                                                                </span>
                                                            ) : (
                                                                "I agree with the"
                                                            )}
                                                            <p className="text-blue-600 dark:text-blue-500 hover:underline">
                                                                terms and conditions
                                                            </p>
                                                        </label>
                                                    </div>
                                                </div>
                                            </Card>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="default" variant="ghost" onPress={onClose}>
                                                Close
                                            </Button>
                                            <Button type="submit" color="primary" onPress={() => {
                                                if (isSubmitted === true) {
                                                    onClose();
                                                }
                                            }}>
                                                Confirm
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </form>
                    </Modal>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

        </div>
    )
}

export default page;
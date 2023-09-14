'use client'

import { Button, Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Input, Select, SelectItem, Tab, Tabs, Skeleton } from "@nextui-org/react"
import { useUserStore } from "@/zustand/userStore"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Inputs, OptionsType, SectorType, UserDataType, UserDataTypeForFetchReq } from "@/types"
import { SubmitHandler, useForm } from "react-hook-form"
import { fetchAllSectors, sortedObject } from "@/utils/fetch"
import toast from "react-hot-toast"

function page() {
    const [user, setUser] = useState<UserDataType>()
    const [options, setOptions] = useState<OptionsType>()
    const [validatedData, setValidatedData] = useState<Inputs>()
    const [newSector, setNewSector] = useState<SectorType>()

    const { setObj, obj } = useUserStore()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
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
        } catch (error) {
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
    }, [])

    async function updateUser() {

        if (validatedData === undefined || user === undefined || newSector === undefined) return

        const res = await fetch('/api/updateUser', {
            method: "PATCH",
            body: JSON.stringify({
                userId: user.user.id,
                newName: validatedData.name,
                newSectorId: newSector.id
            })
        });

        if (res.ok) {

            try {
                const data = fetchSingleUser({ name: validatedData.name, sectorId: newSector.id });
                data.then((data) => setUser(data as any))
            } catch (e) {
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

    const onSubmit: SubmitHandler<Inputs> = (data) => {

        const newData = {
            name: data.name,
            sector: data.sector,
            acceptedTerms: data.acceptedTerms
        };

        setValidatedData(newData);
    }

    useEffect(() => {

        if (user === undefined) return

        setObj({
            name: user.user.name,
            sectorId: user.sector.id,
            acceptedTerms: user.user.acceptedTerms
        })

        setNewSector(user?.sector)

    }, [user])

    useEffect(() => {
        if (options && validatedData) {
            const sector = options.find((option) => option.label === validatedData.sector);
            setNewSector(sector);
        }
    }, [options, validatedData])

    useEffect(() => {

        if (user?.sector.id !== newSector?.id || user?.user.name !== validatedData?.name) {
            updateUser()
        }

    }, [newSector, validatedData])


    return (
        <div className="flex justify-start sm:justify-center pt-8 sm:pt-0 min-h-screen flex-col items-center">
            {user ? (
                <div className="flex justify-center items-center flex-col w-full px-2">
                    <Card className="max-w-full min-w-[15rem] sm:min-w-[25rem] sm:h-[25rem]">
                        <CardBody className="overflow-hidden">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Tabs form"
                            >
                                <Tab key="data" title="Data">
                                    <Table aria-label="User Data Table" className="w-[18rem] sm:w-[21rem] md:w-[25rem]">
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
                                    <div className="flex w-full mt-4 justify-end items-center">
                                        <Button onPress={resetLocalStorage} color="danger">Forget</Button>
                                    </div>
                                </Tab>
                                <Tab key="edit" title="Edit">
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex w-[18rem] sm:w-[21rem] md:w-[25rem] flex-col gap-4 h-[300px] py-4 pt-6 items-center justify-center">

                                        <div className="w-full">
                                            <Input
                                                defaultValue={user.user.name}
                                                {...register("name", { required: true })}
                                                variant="bordered"
                                                color={errors?.name ? "danger" : "default"}
                                                type="text"
                                                label="Name"
                                                size="md"
                                                className="w-full"
                                            />
                                        </div>
                                        <Select
                                            size="md"
                                            className="w-full"
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
                                        <div className="w-full py-4 px-2">
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
                                                    className="ml-2 flex gap-1 justify-center items-center text-xs sm:text-sm font-medium  dark:text-gray-300 text-gray-900/80"
                                                >
                                                    {errors?.acceptedTerms ? (
                                                        <span className="text-rose-600/90">
                                                            Please, agree with the
                                                        </span>
                                                    ) : (
                                                        "I agree with the"
                                                    )}
                                                    <p className="text-blue-600 text-xs sm:text-sm dark:text-blue-500 hover:underline">
                                                        terms and conditions
                                                    </p>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="w-full flex items-center justify-end gap-2">
                                            <Button color="default" variant="ghost" onPress={() => reset()}>
                                                Clear
                                            </Button>
                                            <Button type="submit" color="primary">
                                                Confirm
                                            </Button>
                                        </div>

                                    </form>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
            ) : (
                <Card className="w-[18rem] sm:w-[21rem] md:w-[25rem] space-y-5 p-4" radius="md">
                    <div className="w-full flex justify-center items-center">
                        <Skeleton className="w-full rounded-lg">
                            <div className="h-8 rounded-lg bg-default-200"></div>
                        </Skeleton>
                    </div>

                    <div className="w-full flex justify-center items-center">
                        <Skeleton className="w-full rounded-lg">
                            <div className="h-[18rem] rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>

                    <div className="flex w-full justify-end items-center">
                        <Skeleton className="rounded-lg w-2/5">
                            <div className="h-10 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>

                </Card>
            )}

        </div>
    )
}

export default page;
"use client";

import { Button, Card, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { redirect } from 'next/navigation'
import { useUserStore } from "@/zustand/userStore";
import { Inputs, InputsForAPI, OptionsType } from "@/types";
import { createNewUser, fetchAllSectors, sortedObject } from "@/utils/fetch";


const Form = () => {
    const [options, setOptions] = useState<OptionsType>([])
    const [formData, setFormData] = useState<InputsForAPI>();
    const [isRedirect, setIsRedirect] = useState(false);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { obj, setObj } = useUserStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitted },
    } = useForm<Inputs>();

    // * Fetching the data from the database
    useEffect(() => {
        fetchAllSectors().then(data => {
            const mySortedData = sortedObject(data);
            setOptions(mySortedData)
        })
    }, [])

    // * Redirects to home page
    useEffect(() => {

        // * Redirect if new user is created
        if (isRedirect) redirect('/home');

        // * Redirect if data is present in the local storage
        if (obj.name !== '' && obj.sectorId !== '' && obj === undefined) redirect('/home');

    }, [isRedirect])

    // * Form submission handler for validation
    const onSubmit: SubmitHandler<Inputs> = (data) => {

        const { name, sector, acceptedTerms } = data;

        // * getting the id of the sector from the object
        const optionObject = options.find(option => option.label === sector)

        if (optionObject) {
            setFormData({
                name,
                sectorId: optionObject.id,
                acceptedTerms
            });
            onOpen();
        }
    }

    // * Submit the form data to the backend
    function handelContinue() {
        createNewUser(formData as InputsForAPI).then(() => {
            formData && setObj({
                name: formData.name,
                sectorId: formData.sectorId,
                acceptedTerms: formData.acceptedTerms
            })
            toast('Added Successfully',
                {
                    icon: '👏',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            setIsRedirect(true)
        }).catch(err => {
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
        })
    }

    return (
        <>
            <span className="font-bold text-3xl px-4 text-center md:px-0 pb-8">
                Please enter your information
            </span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="p-4 pt-6 flex items-center max-w-lg min-w-[20rem] sm:min-w-[25rem] justify-center flex-col gap-2">
                    <div className="w-full">
                        <Input
                            {...register("name", { required: true })}
                            variant="bordered"
                            color={errors?.name ? "danger" : "default"}
                            type="text"
                            label="Name"
                            autoComplete="off"
                        />
                    </div>
                    <Select
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
                    <div className="w-full flex justify-end items-center">
                        <Button type="submit">
                            Save
                        </Button>
                    </div>
                </Card>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="opaque">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Confirm to save the data</ModalHeader>
                                <ModalBody>
                                    After you confirm, a unique user will be created with the data you provided and saved on the database.
                                    <span className="italic text-sm text-gray-700/70 dark:text-white/60">Note: You can edit your information even after you confirm.</span>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button color="primary" onPress={() => {
                                        handelContinue();

                                        if (isSubmitted === true) {
                                            reset();
                                            onClose();
                                        }
                                    }}>
                                        Confirm
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </form>
        </>
    );
};

export default Form;
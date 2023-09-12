"use client";
import { Button, Card, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

const Form = () => {
    const [options, setOptions] = useState<OptionsType>([])
    type Inputs = {
        name: string;
        sector: string;
        acceptedTerms: boolean;
    };

    type OptionsType = {
        value: number;
        label: string;
    }[]

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<Inputs>();



    // * Fetching the data from the database
    useEffect(() => {
        async function fetchAllSectors() {
            try {
                const response = await fetch('/api/getAllSectors');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                // * Setting the state
                setOptions(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchAllSectors();
    }, [])


    // * Form submission handler
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name, sector, acceptedTerms } = data;
        try {
            await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    sector,
                    acceptedTerms
                })
            })
        } catch (error) {
            console.log('something went wrong', error);
        }
        console.log(data)
        reset();
    }
    return (
        <>
            <span className="font-bold text-2xl pb-8">
                Please enter your information
            </span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="p-4 pt-6 flex items-center max-w-lg min-w-[25rem] justify-center flex-col gap-2">
                    <div className="w-full">
                        <Input
                            {...register("name", { required: true })}
                            variant="bordered"
                            color={errors?.name ? "danger" : "default"}
                            type="text"
                            label="Name"
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
                        <Button type="submit" className="">
                            Save
                        </Button>
                    </div>
                </Card>
            </form>
        </>
    );
};

export default Form;


// With Plain HTML
// <select
//   placeholder="Select an animal"
//   className="max-w-xs py-2 px-2 rounded-md"
//   onSelect={() => console.log('Select an animal')}
// >
//   {options.map(item => (
//     <option onClick={() => console.log(item.label)} key={item.value} value={item.label}>
//       {item.label}
//     </option>
//   ))}
// </select>
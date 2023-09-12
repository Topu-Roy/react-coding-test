"use client";

import { options as optionsArray } from "@/constants";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function Home() {
  const [isSelected, setIsSelected] = useState(false);
  const [sector, setSector] = useState("");

  type Inputs = {
    name: string;
    sector: string;
    acceptedTerms: boolean;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);


  useEffect(() => {

  }, [])


  return (
    <div className="min-h-screen h-full w-full flex flex-col gap-2 items-center pt-28">
      <span className="font-bold text-2xl pb-8">
        Please enter your information
      </span>
      <form onSubmit={handleSubmit(onSubmit)} >
        <Card className="p-4 pt-6 flex items-center max-w-lg min-w-[25rem] justify-center flex-col gap-2">
          <div className="w-full">
            <Input
              {...register("name", { required: true })}
              variant="bordered"
              color={errors?.name ? 'danger' : 'default'}
              type="text"
              label="Name"
            />
          </div>
          <Select
            items={optionsArray}
            label="Sector"
            color={errors?.sector ? 'danger' : 'default'}
            placeholder="Please select the sector"
            variant="bordered"
            {...register("sector", { required: true })}
          >
            {(optionsArray) => (
              <SelectItem
                value={optionsArray.value}
                // onClick={() => setSector(optionsArray.label)}
                key={optionsArray.label}
              >
                {optionsArray.label}
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
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="link-checkbox"
                className="ml-2 flex gap-1 justify-center items-center text-sm font-medium text-gray-900/80 dark:text-gray-300"
              >
                I agree with the
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
    </div>
  );
}

{
  /* With Plain HTML */
}
{
  /* <select
    placeholder="Select an animal"
    className="max-w-xs py-2 px-2 rounded-md"
    onSelect={() => console.log('Select an animal')}
  >
    {options.map(item => (
      <option onClick={() => console.log(item.label)} key={item.value} value={item.label}>
        {item.label}
      </option>
    ))}
  </select> */
}

{
  /* With NextUI */
}

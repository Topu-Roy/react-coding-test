'use client'

import { options as optionsArray } from '@/constants'
import { Button, Card, Checkbox, Input, Select, SelectItem, card } from '@nextui-org/react'
import { useState } from 'react'

export default function Home() {
  const [isSelected, setIsSelected] = useState(false);
  const [option, setOption] = useState('');

  console.log(option)

  return (
    <div className='min-h-screen h-full w-full flex flex-col gap-2 justify-center items-center'>
      <span className='font-bold text-2xl pb-8'>Please enter your information</span>
      <Card className='p-4 pt-6 flex items-center max-w-lg min-w-[25rem] justify-center flex-col gap-2'>
        <div className='w-full'>
          <Input variant='bordered' type="email" label="Name" isRequired={true} />
        </div>
        <Select
          isRequired={true}
          items={optionsArray}
          label="Sector"
          placeholder="Please select the sector"
          variant='bordered'
          onSelect={() => console.log('Select an animal')}
        >
          {(optionsArray) => (
            <SelectItem
              onClick={() => setOption(optionsArray.label)}
              key={optionsArray.value}>
              {optionsArray.label}
            </SelectItem>
          )}
        </Select>
        <div className='w-full pt-4'>
          <Checkbox size='sm' className='dark:text-white/50' isRequired isSelected={isSelected} onValueChange={setIsSelected}>
            Agree to terms and conditions
          </Checkbox>
        </div>
        <div className="w-full flex justify-end items-center">
          <Button className=''>
            Save
          </Button>
        </div>
      </Card>
    </div>
  )
}

{/* With Plain HTML */ }
{/* <select
    placeholder="Select an animal"
    className="max-w-xs py-2 px-2 rounded-md"
    onSelect={() => console.log('Select an animal')}
  >
    {options.map(item => (
      <option onClick={() => console.log(item.label)} key={item.value} value={item.label}>
        {item.label}
      </option>
    ))}
  </select> */}

{/* With NextUI */ }
'use client'

import { options } from '@/constants'
import { Button, Card, Checkbox, Input, Select, SelectItem, card } from '@nextui-org/react'
import { useState } from 'react'

export default function Home() {

  const [isSelected, setIsSelected] = useState(false)
  console.log(isSelected)

  return (
    <main className='flex min-h-screen justify-center items-center bg-white'>
      <div className='h-full w-full flex flex-col gap-2 justify-center items-center'>
        {/* With Plain HTML */}
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

        {/* With NextUI */}
        <span className='font-semibold text-2xl pb-8'>Please enter your information</span>
        <Card className='p-4 flex items-center max-w-lg min-w-[25rem] justify-center flex-col gap-2'>
          <div className='w-full'>
            <Input variant='bordered' type="email" label="Name" isRequired={true} />
          </div>
          <Select
            isRequired={true}
            items={options}
            label="Sector"
            placeholder="Please select the sector"
            variant='bordered'
            onSelect={() => console.log('Select an animal')}
          >
            {(options) => (
              <SelectItem
                onClick={() => console.log(options.label)}
                key={options.value}>
                {options.label}
              </SelectItem>
            )}
          </Select>
          <div className='w-full'>
            <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
              <span className='text-black/60'>Agree to terms and conditions</span>
            </Checkbox>
          </div>
          <div className="w-full flex justify-end items-center">
            <Button className='bg-black text-white'>
              Button
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

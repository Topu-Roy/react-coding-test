'use client'

import { options } from '@/constants'
import { Select, SelectItem } from '@nextui-org/react'

export default function Home() {
  return (
    <main className='flex min-h-screen justify-center items-center'>
      <div className='h-full w-full flex justify-center items-center'>
        <Select
          items={options}
          label="Favorite Animal"
          placeholder="Select an animal"
          className="max-w-xs"
        >
          {(options) => <SelectItem key={options.value}>{options.label}</SelectItem>}
        </Select>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Tab, Tabs } from '@nextui-org/react'

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const [selected, setSelected] = useState("photos");
    const { setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI

    useEffect(() => {
        setTheme(selected)
    }, [selected])

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="w-full flex justify-center items-center pt-2">
            <Tabs
                variant='bordered'
                aria-label="Tabs colors"
                selectedKey={selected}
                onSelectionChange={setSelected}
                radius="full"
                color='default'
            >
                <Tab key="system" title="System" />
                <Tab key="light" title="Light" />
                <Tab key="dark" title="Dark" />
            </Tabs>
        </div>
    )
}

export default ThemeSwitcher;



'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon } from './SunIcon'
import { MoonIcon } from './MoonIcon'
import { VisuallyHidden, useSwitch } from '@nextui-org/react'

const ThemeSwitcher = () => {
    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps
    } = useSwitch();
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI

    useEffect(() => {
        isSelected ? setTheme('light') : setTheme('dark')
    }, [isSelected])
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="absolute top-0 right-0">
            <Component {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "w-8 h-8",
                            "flex items-center justify-center",
                            "rounded-lg bg-default-100 hover:bg-default-200",
                        ],
                    })}
                >
                    {isSelected ? <SunIcon /> : <MoonIcon />}
                </div>
            </Component>
        </div>
    )
}

export default ThemeSwitcher;



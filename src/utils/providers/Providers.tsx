'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from "next-themes"


function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </ThemeProvider>
    )
}
export default Providers;
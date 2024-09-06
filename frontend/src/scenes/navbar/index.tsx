import React, { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from "./Link";
import { SelectedPage } from '@/shared/types';
import useMediaQuery from '@/hooks/useMediaQuery';
import ActionButton from '@/shared/ActionButton';
type Props = {
    selectedPage: SelectedPage,
    setSelectedPage: (value: SelectedPage) => void;
    isTopOfPage: boolean
}
const Navbar = ({ selectedPage, setSelectedPage, isTopOfPage }: Props) => {
    const flexBetween = "flex items-center justify-between";
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px")
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)
    const navbarBackground = isTopOfPage ? "" : "bg-primary-800 drop-shadow";
    return (
        <nav>
            <div className={`${navbarBackground} ${flexBetween} fixed top-0 z-40 w-full py-6 `}>
                <div className={`${flexBetween} mx-auto w-5/6`}>

                    {isAboveMediumScreens ?
                        <>
                            <div className={`${flexBetween} w-full  text-whiteAccent-500`}>
                                <div className={`${flexBetween} gap-8 text-sm`}>
                                    <Link page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                    <Link page="Story" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                    <Link page="Projects" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                    <Link page="Demo" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                </div>
                                <div className={`${flexBetween} gap-8`}>
                                    <ActionButton setSelectedPage={setSelectedPage}>Connect?</ActionButton>
                                </div>
                            </div>
                        </>
                        : (
                            <button
                                className='rounded-full bg-whiteAccent-500 p-2  hover:bg-redAccent-500'
                                onClick={() => { setIsMenuToggled(!isMenuToggled) }}>
                                <Bars3Icon className='h-6 w-6 text-redAccent-600 hover:text-whiteAccent-500' />
                            </button>
                        )}
                </div>
            </div>
            {!isAboveMediumScreens && isMenuToggled && (
                <div className='fixed right-0 bottom-0 z-40 h-full w-[300px] bg-redAccent-400 drop-shadow-xl'>
                    <div className='flex justify-end p-12'>
                        <button
                            onClick={() => { setIsMenuToggled(!isMenuToggled) }}
                        >
                            <XMarkIcon className='h-6 w-6 text-primary-500 hover:text-primary-100'></XMarkIcon>
                        </button>
                    </div>
                    <div className="ml-[33%] flex flex-col gap-10 text-2xl text-primary-700">
                        <Link page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                        <Link page="Contact" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                    </div>
                </div>
            )}
        </nav>
    );
}
export default Navbar;
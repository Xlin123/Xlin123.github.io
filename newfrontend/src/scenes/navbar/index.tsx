import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from "./Link";
import useMediaQuery from '../../hooks/useMediaQuery';
import type PageManager from '../../shared/PageManager';
type Props = {
    pageManager: PageManager,
    isTopOfPage: boolean
}
const Navbar = ({ pageManager, isTopOfPage }: Props) => {
    const flexBetween = "flex items-center justify-between";
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)")
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)
    const navbarBackground = isTopOfPage ? "" : "bg-tertiary drop-shadow";

    const pageFunction = pageManager.setPage.bind(pageManager);

    return (
        <nav>

            <div className={`${navbarBackground} ${flexBetween} fixed top-0 z-40 w-full py-6 `}>
                <div className={`${flexBetween} mx-auto w-5/6`}>


                    {isAboveMediumScreens ?
                        <>
                            <div className={`${flexBetween} w-full  text-accent`}>
                                <div className={`${flexBetween} gap-8 text-sm`}>
                                    <Link page="Home" setPage={pageFunction} />
                                    <Link page="Technical" setPage={pageFunction} />
                                    <Link page="Projects" setPage={pageFunction} />
                                    <Link page="Passion" setPage={pageFunction} />
                                    <Link page="Contact" setPage={pageFunction} />
                                </div>
                            </div>
                        </>
                        : (
                            <button
                                className='rounded-full bg-accent-500 p-2  hover:bg-accent-700'
                                onClick={() => { setIsMenuToggled(!isMenuToggled) }}>
                                <Bars3Icon className='h-6 w-6 text-altText-600 hover:text-altText-300' />
                            </button>
                        )}
                </div>
            </div>
            {!isAboveMediumScreens && isMenuToggled && (
                <div className='fixed right-0 bottom-0 z-40 h-full w-[300px] bg-tertiary-700 drop-shadow-xl'>
                    <div className='flex justify-end p-12'>
                        <button
                            onClick={() => { setIsMenuToggled(!isMenuToggled) }}
                        >
                            <XMarkIcon className='h-6 w-6 text-primary-500 hover:text-primary-700'></XMarkIcon>
                        </button>
                    </div>
                    <div className="ml-[33%] flex flex-col gap-10 text-2xl text-white">
                        <Link page="Home" setPage={pageFunction} />
                        <Link page="Contact" setPage={pageFunction} />
                    </div>
                </div>
            )}
        </nav>
    );
}
export default Navbar;
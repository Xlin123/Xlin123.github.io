import { SelectedPage } from '../../shared/types';
import React from 'react'
import { useState } from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll';

type Props = {
    page: string,
    selectedPage: SelectedPage,
    setSelectedPage: (value: SelectedPage) => void;
}
const Link = ({
    page,
    selectedPage,
    setSelectedPage
}: Props) => {
    const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
    return (
        <AnchorLink
            className={`${selectedPage === lowerCasePage} ? "text-redAccent-500 : ""}
        transition duration-500 hover:text-accent-100 font-bold
    `}
            href={`#${lowerCasePage}`}
            onClick={() => { setSelectedPage(lowerCasePage) }} >
            {page}
        </AnchorLink>
    );
}

export default Link;
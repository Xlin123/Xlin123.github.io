import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll'; // Import the correct component from 'react-scroll'
import { SelectedPage } from './types';

type Props = {
  children: React.ReactNode;
  setSelectedPage: (value: SelectedPage) => void;
};


const ActionButton = ({ children, setSelectedPage }: Props) => {
  return (
    <AnchorLink
      className='rounded-md font-bold bg-accent-500 text-altText-500 hover:bg-whiteAccent-500  hover:text-redAccent-500 px-10 py-2 '
      onClick={() => { setSelectedPage(SelectedPage.ContactUs) }}
      href={SelectedPage.ContactUs}
    >
      {children}
    </AnchorLink>
  );
};

export default ActionButton;
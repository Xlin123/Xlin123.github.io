import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll'; // Import the correct component from 'react-scroll'
import { SelectedPage } from './types';
import { Button } from '@material-tailwind/react';

type Props = {
  children: React.ReactNode;
  setSelectedPage: (value: SelectedPage) => void;
  page: SelectedPage;
};


const ActionButton = ({ children, setSelectedPage, page }: Props) => {
  return (
    <AnchorLink
      className='rounded-md font-bold bg-accent-500 text-altText-500 hover:bg-tertiary  hover:text-accent px-10 py-2 '
      onClick={() => { setSelectedPage(page) }}
      href={`#${page}`}
    >
      {children}
    </AnchorLink>
  );
};

export default ActionButton;
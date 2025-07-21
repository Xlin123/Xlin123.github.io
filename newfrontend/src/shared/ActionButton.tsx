import React from 'react';
import { SelectedPage } from './types';
import { Button } from '@material-tailwind/react';

type Props = {
  children: React.ReactNode;
  setPage: (value: SelectedPage) => void;
  page: SelectedPage;
};


const ActionButton = ({ children, setPage, page }: Props) => {
  return (
    // @ts-ignore  material-tailwind hasn't been updated to support TS+tailwind v4
    <Button
      color="blue" // Example color prop, adjust as needed
      className="relative rounded-md font-bold bg-accent-500 text-primary hover:bg-tertiary hover:text-accent px-10 py-2"
      onClick={() => setPage(page)}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
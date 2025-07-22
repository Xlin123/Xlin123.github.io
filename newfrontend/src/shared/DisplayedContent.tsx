import { motion } from 'framer-motion';
import React from 'react';
import Home from '../scenes/home';
import type { SelectedPage } from './types';
import Technical from '../scenes/technical';
import PageManager from './PageManager';
import Experience from '../scenes/experience';
import Passion from '../scenes/passion';
import Contact from '../scenes/contact';

interface DisplayedContentProps {
    type: SelectedPage;
    pageManager: PageManager;
}

const DisplayedContent: React.FC<DisplayedContentProps> = ({ type, pageManager }) => {
    let content: React.ReactNode;
    let style: string;
    switch (type) {
        case 'home':
            content = <Home pageFunction={pageManager.setPage.bind(pageManager)} />;
            style = "top-1/2 right-[10%] -translate-y-1/2 ";
            break;
        case 'technical':
            content = <Technical pageFunction={pageManager.setPage.bind(pageManager)} />;
            style = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ";
            break;
        case 'experience':
            content = <Experience pageFunction={pageManager.setPage.bind(pageManager)} />;
            style = "top-1/2 right-[10%] -translate-y-1/2 ";
            break;
        case 'contact':
            content = <Contact pageFunction={pageManager.setPage.bind(pageManager)} />;
            style = "top-[calc(50%-200px)] left-[calc(10%-100px)] -translate-y-1/2 ";
            break;
        case 'passion':
            content = <Passion pageFunction={pageManager.setPage.bind(pageManager)} />;
            style = "top-[calc(50%-200px)] left-1/2 -translate-x-1/2 -translate-y-1/2 ";
            break;
        case 'walkaround':
            content = <></>;
            style = "";
            break;
        default:
            content = <div>Content not found.</div>;
            style = "top-1/2 right-[10%] -translate-y-1/2 ";
    }
    const baseStyle = "absolute bg-black/70 text-white p-5 rounded-2xl z-10 shadow-lg";
    return (
        <div className='relative w-full h-full opacity-100'>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`${baseStyle} ${style}`}
            >
                {content}
            </motion.div>
        </div>
    );
};

export default DisplayedContent;
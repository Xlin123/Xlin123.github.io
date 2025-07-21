import { SelectedPage } from '../../shared/types';
import useMediaQuery from '../../hooks/useMediaQuery';
import ActionButton from '../../shared/ActionButton';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { motion } from 'framer-motion';
import React from 'react';
import TypingHeader from './TypingHeader'; // Adjust the path as necessary
import { DiDart, DiDocker, DiDotnet, DiGit, DiGithub, DiGithubBadge, DiGoogleCloudPlatform, DiJava, DiJavascript, DiPostgresql, DiPython } from 'react-icons/di';
import ThreeBackground from './ThreeBackground';


type Props = {
  setSelectedPage: (value: SelectedPage) => void;
}

const Home = ({ setSelectedPage }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
  return (
    <motion.div className='md:flex mx-auto w-5/6 items-center justify-center md:h-5/6 relative'
      onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
      {/*MAIN*/}
      <div className='z-0 basis-3/5 relative'>
        {/*headings*/}
        <motion.div
          className=''
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}>
          <ThreeBackground />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home
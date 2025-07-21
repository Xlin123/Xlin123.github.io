import { SelectedPage } from '../../shared/types';
// import useMediaQuery from '../../hooks/useMediaQuery';
import { motion } from 'framer-motion';


type Props = {
  setSelectedPage: (value: SelectedPage) => void;
}

const Home = ({ setSelectedPage }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
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
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home
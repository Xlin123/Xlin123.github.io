import { SelectedPage } from '@/shared/types';
import useMediaQuery from '@/hooks/useMediaQuery';
import ActionButton from '@/shared/ActionButton';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { motion } from 'framer-motion';


type Props = {
  setSelectedPage: (value: SelectedPage) => void;
}

const Home = ({ setSelectedPage }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
  const titleTextStyle = `before:absolute before:-top-20 before:-left-20 before:z-[-1] p-6`;

  return (
    <section
      id='home'
      className='gap-8 py-10 md:h-full md:pb-0'>

      {/*IMAGE AND MAIN HEADER*/}
      <motion.div className='md:flex mx-auto w-5/6 items-center justify-center md:h-5/6'
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
        {/*MAIN*/}
        <div className='z-10 mt-32 md:basis-3/5'>
          {/*headings*/}
          <motion.div
            className='md:-mt-20'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 }
            }}>
            <div className='relative'>
            </div>
          </motion.div>
        </div>

      </motion.div>


      {/*ACTIONS*/}
      <motion.div className='mt-4 flex items-center mb-8 justify-center md:-mt-8'
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        }}>
        <div className='mr-4'>
          <ActionButton setSelectedPage={setSelectedPage}>
            Try a demo!
          </ActionButton>
        </div>
        <AnchorLink
          className='text-sm font-bold text-whiteAccent-500 hover:text-redAccent-500 md:mr-8'
          onClick={() => setSelectedPage(SelectedPage.ContactUs)}
          href={`#${SelectedPage.ContactUs}`}
        >
          Learn More
        </AnchorLink>
      </motion.div>

      {/*SPONSORS*/}
      {isAboveMediumScreens && (
        <div className='h-[150px] w-full bg-primary-300 py-5'>

        </div>
      )}



    </section>
  )
}

export default Home
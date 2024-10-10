import { SelectedPage, ItemType } from '../../shared/types'
import { motion } from 'framer-motion';
import React from 'react'
import Heading from '../../shared/Heading';
import Item from './Item';
import Scrollbar from 'react-custom-scrollbars-2'


type Props = {
  setSelectedPage: (value: SelectedPage) => void;
}

//name, description, image
const specs: Array<ItemType> = [
];


const Specs = ({ setSelectedPage }: Props) => {
  return (
    <section id='specs' className='mx-auto min-h-full w-5/6 py-20 bg-primary-500'>
      <motion.div className='md:flex items-center justify-center'
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
        <motion.div className='mx-auto w-5/6'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
          }}>
          <div className='mx-auto py-10 md: w-5/6 text-redAccent-500 justify-center'>
            <Heading>Specs</Heading>
          </div>``
        </motion.div>
        <div className='mt-10 h-[353px] w-full overflow-x-auto overflow-y-hidden'>
          <Scrollbar style={{ height: 385 }} className='z-35'>
            <ul className='w-[2800px] whitespace-nowrap'>
              {specs.map((item, index) => (
                <Item
                  key={`${item.name}-${index}`}
                  name={item.name}
                  description={item.description}
                  image={item.image} />
              ))}
            </ul>
          </Scrollbar>
        </div>
      </motion.div>

    </section>
  )
}

export default Specs
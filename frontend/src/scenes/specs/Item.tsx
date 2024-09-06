import React from 'react'

type Props = {
  name: string;
  description: string;
  image: string;
}
const overlayStyles = `p-5 absolute z-30 flex h-[380px]
w-[450px] flex-col items-center justify-center 
whitespace-normal bg-primary-300 text-center text-whiteAccent-500 opacity-0
transition duration-500 hover:opacity-90`;
const Item = ({ name, description, image }: Props) => {
  return (
    <li className='relative mr-5 inline-block h-[380px] w-[450px]'>
      <div className={overlayStyles}>
        <p className='text-2xl'>{name}</p>
        <p className='mt-5'>{description}</p>
      </div>
      <img alt={`${image}`} src={image} className='h-[353px] w-[450px]' />
    </li>
  )
}

export default Item;
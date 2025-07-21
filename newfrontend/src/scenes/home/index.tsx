// import useMediaQuery from '../../hooks/useMediaQuery';
import { SelectedPage } from '../../shared/types';
import ActionButton from '../../shared/ActionButton';

type Props = {
  pageFunction: (value: SelectedPage) => void;
};

const Home = ({ pageFunction }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h2 className="m-0 text-xl text-center font-montserrat">
        Hello! I'm Xavier and welcome to my portfolio.
      </h2>
      <p className="mt-2 text-base text-center font-montserrat">
        Explore my projects and learn more about me!
      </p>
      <h1 className="text-2xl text-center font-montserratm font-bold mt-4">
        THIS IS A WIP</h1>
      <div className='flex justify-center mt-5'>
        <ActionButton setPage={pageFunction} page={SelectedPage.Technical}>
          Click to start!
        </ActionButton>
      </div>
    </div>
  );
};

export default Home;

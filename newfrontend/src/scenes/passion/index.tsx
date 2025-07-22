// import useMediaQuery from '../../hooks/useMediaQuery';
import { SelectedPage } from '../../shared/types';
import ActionButton from '../../shared/ActionButton';

type Props = {
  pageFunction: (value: SelectedPage) => void;
};

const Passion = ({ pageFunction }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h1 className="text-2xl text-center font-montserratm font-bold ">
        Passion
      </h1>
      <h2 className="mt-2 text-base text-center font-montserrat font-medium">
        Deep down, what am I? <br />
        <span className="text-2xl font-bold">Team Player, </span>
        <span className="text-2xl font-bold">Growth-minded, </span>
        <span className="text-2xl font-bold">Innovative </span>
      </h2>
      <h3 className="mt-4 text-center font-montserrat font-medium">
        My motivation comes from impact and the challenges I face. <br />How can I impact the world? What does the journey teach me?
      </h3>

      <div className='flex justify-center mt-5'>
        <ActionButton setPage={pageFunction} page={SelectedPage.Contact}>
          Next: Contact
        </ActionButton>
      </div>
    </div>
  );
};

export default Passion;

// import useMediaQuery from '../../hooks/useMediaQuery';
import { SelectedPage } from '../../shared/types';
import ActionButton from '../../shared/ActionButton';

type Props = {
  pageFunction: (value: SelectedPage) => void;
};

const Contact = ({ pageFunction }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h1 className="text-2xl text-center font-montserratm font-bold ">
        Contact
      </h1>
      <h2 className="mt-2 text-base text-center font-montserrat font-medium">
        I'm getting ready for hackathons! <br />
        I don't have many projects since I'm focusing on building solutions at work.
      </h2>
      <div className="flex justify-center mt-4">
        <a
          href="https://www.linkedin.com/in/xavier-lin/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-montserrat font-medium hover:text-tertiary-200 transition"
        >
          Reach out to me on LinkedIn!
        </a>
      </div>

      <div className='flex justify-center mt-5'>
        <ActionButton setPage={pageFunction} page={SelectedPage.Home}>
          Back to Home
        </ActionButton>
      </div>
    </div>
  );
};

export default Contact;

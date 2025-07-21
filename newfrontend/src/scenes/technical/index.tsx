// import useMediaQuery from '../../hooks/useMediaQuery';
import { SelectedPage } from '../../shared/types';
import ActionButton from '../../shared/ActionButton';

type Props = {
  pageFunction: (value: SelectedPage) => void;
};

const Technical = ({ pageFunction }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h1 className="text-2xl text-center font-montserratm font-bold ">
        Technical Skills
      </h1>
      <h2 className="m-0 text-xl text-center font-montserrat font-medium">
        For 2 years I worked at a startup where fast-paced development and adaptability were crucial.
      </h2>
      <h3 className="mt-2 text-base text-center font-montserrat font-medium">
        The startup gave me opportunities to pick up responsibilities and project/business skills that have shaped my approach to development.
      </h3>
      <p className="mt-2 text-base text-center font-montserrat font-medium">
        Wearing so many hats, I have honed my skills to be a business-oriented developer.
      </p>

      <div>
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <span className="devicon-typescript-plain colored text-4xl" title="TypeScript"></span>
          <span className="devicon-react-original colored text-4xl" title="React"></span>
          <span className="devicon-python-plain colored text-4xl" title="Python"></span>
          <span className="devicon-dot-net-plain colored text-4xl" title=".NET"></span>
          <span className="devicon-bash-plain white text-4xl" title="bash"></span>
          <span className="devicon-dart-plain colored text-4xl" title="Dart"></span>
          <span className="devicon-fastapi-plain colored text-4xl" title="FastAPI"></span>
          <span className="devicon-azure-plain colored text-4xl" title="Azure"></span>
          <span className="devicon-googlecloud-plain colored text-4xl" title="GCP"></span>
          <span className="devicon-docker-plain colored text-4xl" title="Docker"></span>
        </div>
      </div>

      <p className="mt-2 text-base text-center font-montserrat font-medium">
        I am deeply passionate about technology and I wish to build solutions that make a difference.
      </p>
      <div className='flex justify-center mt-5'>
        <ActionButton setPage={pageFunction} page={SelectedPage.Projects}>
          Next: Projects
        </ActionButton>
      </div>
    </div>
  );
};

export default Technical;

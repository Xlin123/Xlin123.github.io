import useMediaQuery from '../../hooks/useMediaQuery';
import { SelectedPage } from '../../shared/types';
import ThreeRenderer from '../../shared/ThreeRenderer';
import ActionButton from '../../shared/ActionButton';

type Props = {
  threeRenderer: ThreeRenderer;
};

const Projects = ({ threeRenderer }: Props) => {
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h2 className="m-0 text-xl text-center font-montserrat">
        Hello! I'm Xavier and welcome to my portfolio.
      </h2>
      <p className="mt-2 text-base text-center font-montserrat">
        Explore my projects and learn more about me!
      </p>
      <div className='flex justify-center mt-5'>
        <ActionButton setPage={threeRenderer.setPage.bind(threeRenderer)} page={SelectedPage.Projects}>
          Click to start!
        </ActionButton>
      </div>
    </div>
  );
};

export default Projects;

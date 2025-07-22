// import useMediaQuery from '../../hooks/useMediaQuery';

import ActionButton from "../../shared/ActionButton";
import { SelectedPage } from "../../shared/types";



type Props = {
  pageFunction: (value: SelectedPage) => void;
};

const experience = ({ pageFunction }: Props) => {
  // const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  return (
    <div className='relative w-full h-full'>
      <h1 className="mt-2 text-2xl text-center font-montserrat">
        Some quick accomplishments to summarize my experience:
      </h1>
      <ul className="mt-2 text-base text-center font-montserrat text-medium">
        <li className="flex items-center justify-center gap-2">
          <i className="devicon-dotnetcore-plain text-4xl"></i>
          <i className="devicon-python-plain colored text-4xl"></i>
          <i className="devicon-azure-plain colored text-4xl"></i>
          With Atsign, I built and was responsible for revenue-generating solutions that brought us into new markets.
        </li>
        <li className="flex items-center justify-center gap-2 mt-4">
          <i className="devicon-github-original text-4xl"></i>
          <i className="devicon-docker-plain colored text-4xl"></i>
          <i className="devicon-dart-plain colored text-4xl"></i>
          Being responsible for projects taught me the software development lifecycle and how to manage projects effectively.
        </li>
        <li className="flex items-center justify-center gap-2 mt-4">
          <i className="devicon-python-plain colored text-3xl -mt-4"></i>
          With Nissan, I automated data pipelines and generated insights that reduced costs while scaling device count<br />
          (projected ~$900k saved/year) (+3000/month).
        </li>
        <li className="flex items-center justify-center gap-2 mt-4">
          <i className="devicon-docker-plain colored text-3xl -mt-8"></i>
          <i className="devicon-terraform-plain colored text-3xl -mt-8"></i>
          <i className="devicon-tensorflow-original colored text-3xl -mt-8"></i>
          In my free time, I continue learning and building projects that interest me. <br />
          Recently, my focus is on ML and it's infrastructure.
        </li>
      </ul>
      <div className='flex justify-center mt-5'>
        <ActionButton setPage={pageFunction} page={SelectedPage.Passion}>
          Next: Passion
        </ActionButton>
      </div>
    </div>
  );
};

export default experience;

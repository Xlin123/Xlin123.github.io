import { SelectedPage } from '../../shared/types';


type Props = {
    page: string,
    setPage: (value: SelectedPage) => void;
}
const Link = ({
    page,
    setPage
}: Props) => {
    const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
    return (
        <a
            className='transition duration-500 hover:text-accent-700 font-bold'
            onClick={() => { setPage(lowerCasePage) }} >
            {page}
        </a>
    );
}

export default Link;
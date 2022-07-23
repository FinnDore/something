import { useAtom } from 'jotai';
import Basket from '../components/basket';
import Item from '../components/item';
import { variantsAtom } from '../utils/items';

export function Index() {
    const [variants] = useAtom(variantsAtom);

    return (
        <div className="dark:bg-back-dark grid h-screen w-screen place-items-center dark:text-white">
            <div className="flex flex-col md:flex-row">
                <Item name="Just a Square" variants={variants} />
                <Basket />
            </div>
        </div>
    );
}

export default Index;

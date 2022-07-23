import { atom, useAtom } from 'jotai';
import { useMemo } from 'react';
import { getItemByVariantId, getVariantById } from '../utils/items';

type BasketItem = {
    id: string;
    quantity: number;
};

export const addItemToBasketReducer = (
    state: BasketItem[],
    basketItem: BasketItem
) => {
    const itemIndex = state.findIndex(item => item.id === basketItem.id);
    if (itemIndex === -1) {
        return [...state, basketItem];
    } else {
        const newState = [...state];
        newState[itemIndex].quantity += basketItem.quantity;
        return newState;
    }
};

export const basketItemsAtom = atom<BasketItem[]>([]);

const useBasketItems = () => useAtom(basketItemsAtom)[0];

const useCurrentItemAndVariant = (variantId: string) => {
    const variantAtom = useMemo(() => getVariantById(variantId), [variantId]);
    const [currentVariant] = useAtom(variantAtom);

    const itemAtom = useMemo(() => getItemByVariantId(variantId), [variantId]);
    const [currentItem] = useAtom(itemAtom);

    return { currentItem, currentVariant };
};

const BasketRow: React.FC<{ item: BasketItem }> = ({ item: basketItem }) => {
    const { currentItem, currentVariant } = useCurrentItemAndVariant(
        basketItem.id
    );

    return (
        <>
            <td className="w-full text-red-600">
                <div className="mr-2 h-5 w-5 overflow-hidden rounded-sm drop-shadow-lg transition-colors">
                    {/* <Image
                        src={currentVariant.url}
                        alt="Shop item mate"
                        layout="fill"
                    /> */}
                </div>
            </td>
            <td className="w-full">
                <span>
                    {currentItem.name} ({currentVariant.variantName} ) £{' '}
                    {currentVariant.price * basketItem.quantity}
                </span>
            </td>
        </>
    );
};

const BasketTable = () => {
    const basketItems = useBasketItems();

    return (
        <table className="w-full">
            <thead></thead>
            <tbody className="w-full">
                {basketItems.map(basketItem => (
                    <BasketRow key={basketItem.id} item={basketItem} />
                ))}
            </tbody>
        </table>
    );
};

const Basket: React.FC = () => {
    return (
        <div className="m-auto mt-5 h-[24rem] w-[100%] rounded-md border-[.5px] border-black px-5 py-5 drop-shadow-2xl dark:border-white lg:m-10 lg:w-[30rem]">
            <h1 className="px text-2xl">Basket</h1>
            aaaaa
            {/* <BasketTable />w */}
        </div>
    );
};

export default Basket;

import { atom, useAtom } from 'jotai';
import Image from 'next/image';
import { useMemo } from 'react';
import { getItemByVariantId, getVariantById } from '../hooks/items';

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

const useCurrentItemAndVariant = (variantId: string) => {
    const variantAtom = useMemo(() => getVariantById(variantId), [variantId]);
    const [currentVariant] = useAtom(variantAtom);

    const itemAtom = useMemo(() => getItemByVariantId(variantId), [variantId]);
    const [currentItem] = useAtom(itemAtom);

    return { currentItem, currentVariant };
};

const BasketItem: React.FC<{ item: BasketItem }> = ({ item: basketItem }) => {
    const { currentItem, currentVariant } = useCurrentItemAndVariant(
        basketItem.id
    );

    return (
        <div className="flex items-center py-2">
            <div className="mr-2 h-5 w-5 overflow-hidden rounded-sm drop-shadow-lg transition-colors">
                <Image
                    src={currentVariant.url}
                    alt="Shop item mate"
                    layout="fill"
                />
            </div>
            <span>
                {currentItem.name} ( {currentVariant.variantName} ) £{' '}
                {currentVariant.price * basketItem.quantity}
            </span>
        </div>
    );
};

const Basket: React.FC = () => {
    const [basketItems] = useAtom(basketItemsAtom);
    return (
        <div className="m-auto mt-5 h-[24rem] w-[100%] rounded-md border-[.5px] border-black px-5 py-5 drop-shadow-2xl dark:border-white lg:m-10 lg:w-[30rem]">
            <h1 className="px text-2xl">Basket</h1>

            {basketItems.map(item => (
                <BasketItem key={item.id} item={item}></BasketItem>
            ))}
        </div>
    );
};

export default Basket;

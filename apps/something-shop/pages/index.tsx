import { atom, useAtom } from 'jotai';
import { selectAtom, useReducerAtom } from 'jotai/utils';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type Variant = {
    variantId: string;
    variantName: string;
    color: string;
    url: string;
    price: number;
};

type BasketItem = {
    id: string;
    quantity: number;
};

type Item = {
    id: string;
    name: string;
    variants: string[];
};

const itemsAtom = atom<Item[]>([
    {
        id: 'cl5li94a70000x02t1nsnyqbd',
        name: 'Just a Square',
        variants: [
            'cl5li94i70000x02t1nsnyqbd',
            'cl5li94i80000x02t1nsnyqbd',
            'cl5li94i90000x02t1nsnyqbd'
        ]
    }
]);

const basketItemsAtom = atom<BasketItem[]>([]);
const variantsAtom = atom<Variant[]>([
    {
        url: '/purple.png',
        color: '#8d13fe',
        variantName: 'Purple',
        variantId: 'cl5li94i70000x02t1nsnyqbd',
        price: 10.0
    },
    {
        url: '/blue.png',
        color: '#fd0e56',
        variantName: 'Red',
        variantId: 'cl5li94i80000x02t1nsnyqbd',
        price: 20
    },
    {
        url: '/black.png',
        color: '#ffffff',
        variantName: 'White',
        variantId: 'cl5li94i90000x02t1nsnyqbd',
        price: 5
    }
]);

const getItemById = (id: string) =>
    selectAtom(variantsAtom, items => items.find(x => x.variantId === id));

const getItemByVariantId = (id: string) =>
    selectAtom(itemsAtom, items => items.find(x => x.variants.includes(id)));

const addItemToBasketReducer = (
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

const ItemVariants: React.FC<{
    variants: Variant[];
    selected?: Variant;
    onSelect: (variant: Variant) => void;
}> = ({ variants, selected, onSelect }) => {
    const selectedClass = 'border-black dark:border-white';
    return (
        <div className="-ml-1">
            {variants.map(variant => (
                <button
                    key={variant.color}
                    onClick={() => onSelect(variant)}
                    className={`m-1 h-5 w-5 rounded-sm border border-transparent ${
                        variant.color === selected.color ? selectedClass : ''
                    } : ''`}
                    style={{ backgroundColor: variant.color }}
                ></button>
            ))}
        </div>
    );
};

const Item: React.FC<{
    name: string;
    variants?: Variant[];
}> = ({ name, variants }) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        variants?.[0]
    );

    const [, addItem] = useReducerAtom(basketItemsAtom, addItemToBasketReducer);

    return (
        <div className="w-80% m-auto flex h-[24rem] flex-col rounded-md border-[.5px] border-black px-3 py-5 drop-shadow-2xl dark:border-white lg:w-72">
            <div className="grid h-full place-items-center">
                <div className="h-52 w-52 overflow-hidden rounded-lg drop-shadow-lg transition-colors">
                    <Image
                        src={selectedVariant.url}
                        alt="Shop item mate"
                        layout="fill"
                    />
                </div>
            </div>
            <div className="w-full px-2">
                <div className="mb-2 w-full border-[.5px] dark:border-white"></div>
                <div className="flex">
                    <div>
                        <h1 className="text-lg">{name}</h1>
                        {variants && (
                            <ItemVariants
                                variants={variants}
                                selected={selectedVariant}
                                onSelect={setSelectedVariant}
                            />
                        )}
                        <div>£ {selectedVariant.price}</div>
                    </div>
                    <button
                        className="border-back-light dark:border-back-dark ml-auto mt-auto h-min rounded-md border-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-1 text-white transition-colors hover:border-black hover:dark:border-white"
                        onClick={() =>
                            addItem({
                                id: selectedVariant.variantId,
                                quantity: 1
                            })
                        }
                    >
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
};

const BasketItem: React.FC<{ item: BasketItem }> = ({ item: basketItem }) => {
    const variantAtom = useMemo(
        () => getItemById(basketItem.id),
        [basketItem.id]
    );
    const [currentVariant] = useAtom(variantAtom);

    const itemAtom = useMemo(
        () => getItemByVariantId(basketItem.id),
        [basketItem.id]
    );
    const [currentItem] = useAtom(itemAtom);
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

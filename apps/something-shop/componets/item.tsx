import { useReducerAtom } from 'jotai/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Variant } from '../utils/items';
import { addItemToBasketReducer, basketItemsAtom } from './basket';

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

export default Item;

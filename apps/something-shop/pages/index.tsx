import Image from 'next/image';
import { useState } from 'react';

type Variant = {
    color: string;
    url: string;
};

const ItemColors: React.FC<{
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
                    className={`m-1 h-5 w-5 rounded-md border border-transparent ${
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
    price: string;
    variants?: Variant[];
}> = ({ name, price, variants }) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        variants?.[0]
    );

    return (
        <div className="border-color-white dark:border-color-white flex h-[24rem] w-72 flex-col rounded-md border-[.5px] px-3 py-5 drop-shadow-2xl">
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
                <div className="mb-4 w-full border-[.5px] dark:border-white"></div>
                <div className="flex">
                    <div>
                        <h1 className="text-lg">{name}</h1>
                        {variants && (
                            <ItemColors
                                variants={variants}
                                selected={selectedVariant}
                                onSelect={setSelectedVariant}
                            />
                        )}
                        <div>{price}</div>
                    </div>
                    <button className="border-back-light dark:border-back-dark ml-auto mt-auto h-min rounded-md border-2 bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-1 text-white transition-colors hover:border-black hover:dark:border-white">
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
};

export function Index() {
    return (
        <div className="dark:bg-back-dark grid h-screen w-screen place-items-center dark:text-white">
            <Item
                name="Just a Square"
                price="£20"
                variants={[
                    { url: '/purple.png', color: '#8d13fe' },
                    { url: '/blue.png', color: '#fd0e56' },
                    { url: '/black.png', color: '#ffffff' }
                ]}
            />
        </div>
    );
}

export default Index;

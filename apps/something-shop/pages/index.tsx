import { useState } from 'react';

const ItemColors: React.FC<{
    colors: string[];
    selected?: string;
    onSelect: (color: string) => void;
}> = ({ colors, selected, onSelect }) => {
    const selectedClass = 'border';
    return (
        <div className="-ml-1">
            {colors.map(color => (
                <button
                    key={color}
                    onClick={() => onSelect(color)}
                    className={`m-1 h-5 w-5 rounded-md border-[.5px] border-zinc-200 ${
                        color === selected ? selectedClass : ''
                    } : ''`}
                    style={{ backgroundColor: color }}
                ></button>
            ))}
        </div>
    );
};

const Item: React.FC<{
    name: string;
    price: string;
    colors?: string[];
}> = ({ name, price, colors }) => {
    const [selectedColor, setSelectedColor] = useState(colors?.[0]);

    return (
        <div className="border-color-white dark:border-color-white flex h-[24rem] w-72 flex-col rounded-md border-[.5px] px-3 py-5 drop-shadow-2xl">
            <div className="grid h-full place-items-center">
                <div
                    className="h-40 w-40 rounded-lg border drop-shadow-lg transition-colors"
                    style={{
                        backgroundColor: selectedColor,
                        borderColor: selectedColor
                    }}
                ></div>
            </div>
            <div className="w-full px-2">
                <div className="mb-4 w-full border-[.5px] dark:border-white"></div>
                <div className="flex">
                    <div>
                        <h1 className="text-lg">{name}</h1>
                        <ItemColors
                            colors={colors}
                            selected={selectedColor}
                            onSelect={setSelectedColor}
                        />
                        <div>{price}</div>
                    </div>
                    <button className="ml-auto mt-auto h-min rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-1 transition-colors hover:border-black hover:dark:border-white">
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
};

export function Index() {
    return (
        <div className="grid h-screen w-screen place-items-center bg-white dark:bg-black dark:text-white">
            <Item
                name="Just a Square"
                price="£20"
                colors={['#32a87b', '#7132a8', '#a88932']}
            />
        </div>
    );
}

export default Index;

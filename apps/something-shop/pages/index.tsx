const ItemColors: React.FC<{
    colors: string[];
}> = ({ colors }) => {
    return (
        <div className="-ml-1">
            {colors.map(color => (
                <button
                    key={color}
                    className="m-1 h-5 w-5 rounded-md border-[.5px] border-zinc-200"
                    style={{ backgroundColor: color }}
                ></button>
            ))}
        </div>
    );
};

const Item: React.FC<{
    name: string;
    price: string;
    colors: string[];
}> = ({ name, price, colors }) => {
    // function to add an item to the basket

    return (
        <div className="border-color-white dark:border-color-white flex h-[24rem] w-72 flex-col rounded-md border-[.5px] px-3 py-5">
            <div className="grid h-full place-items-center">
                <div className="h-40 w-40 rounded-lg bg-black dark:border dark:border-red-600 dark:bg-white"></div>
            </div>
            <div className="w-full px-2">
                <div className="mb-4 w-full border-[.5px] dark:border-white"></div>
                <div className="flex">
                    <div>
                        <h1 className="text-lg">{name}</h1>
                        <ItemColors colors={colors} />
                        <div>{price}</div>
                    </div>
                    <button className="ml-auto mt-auto h-min rounded-md border-[.5px] border-transparent bg-gradient-to-r from-amber-500 to-pink-600 px-5 py-1 transition-colors hover:border-white">
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
};

export function Index() {
    return (
        <div className="grid h-screen w-screen place-items-center bg-white text-white dark:bg-black">
            <Item
                name="White Square"
                price="£20"
                colors={['red', 'aqua', 'yellow']}
            />
        </div>
    );
}

export default Index;

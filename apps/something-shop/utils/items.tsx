import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

export type Variant = {
    variantId: string;
    variantName: string;
    color: string;
    url: string;
    price: number;
};

export type Item = {
    id: string;
    name: string;
    variants: string[];
};

export const itemsAtom = atom<Item[]>([
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

export const variantsAtom = atom<Variant[]>([
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

export const getVariantById = (id: string) =>
    selectAtom(variantsAtom, items => items.find(x => x.variantId === id));

export const getItemByVariantId = (id: string) =>
    selectAtom(itemsAtom, items => items.find(x => x.variants.includes(id)));

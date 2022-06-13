---
sidebar_position: 2
---

# CDK

### example usage

```ts showLineNumbers
import { CommonModule } from '@angular/common';
import { ItemImageComponentModule } from '@something-ui/cdk/primitives/ItemImage';
import { AddToBasketDirectiveModule } from '@something-ui/cdk/primitives/AddToBasket';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule
} from '@angular/core';

@Component({
    selector: 'docs-shop',
    template: `
    <s-item> 
        <s-item-image />
        <button s-add-to-basket>Get</ button>
    <s-item>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ItemImageComponentModule, AddToBasketDirectiveModule]
})
export class ShopComponent {}
```

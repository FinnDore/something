import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TuiRootModule } from '@taiga-ui/core';
import { AppComponent } from './app.component';
import { ShopStore } from '@something/s-ui/cdk/stores/shop-store';

@NgModule({
    declarations: [AppComponent],
    imports: [CommonModule, BrowserModule, TuiRootModule],
    providers: [ShopStore],
    bootstrap: [AppComponent]
})
export class AppModule {}

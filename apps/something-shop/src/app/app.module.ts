import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiRootModule, TuiDialogModule, TuiAlertModule } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, TuiRootModule, BrowserAnimationsModule, TuiDialogModule, TuiAlertModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

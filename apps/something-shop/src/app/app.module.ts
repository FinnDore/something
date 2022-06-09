import { UtilsrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { UtilsrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        UtilsrowserModule,
        TuiRootModule,
        UtilsrowserAnimationsModule,
        TuiDialogModule,
        TuiAlertModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

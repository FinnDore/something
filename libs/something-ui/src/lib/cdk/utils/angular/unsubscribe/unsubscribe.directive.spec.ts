import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Unsubscribe } from './unsubscribe.directive';

@Component({
    selector: 's-test-component'
})
class TestComponent extends Unsubscribe {
    /**
     * constructor for TestComponent
     */
    constructor() {
        super();
    }
}

describe('Unsubscribe', () => {
    let fixture: ComponentFixture<TestComponent>;
    let nextSpy: jest.SpyInstance;
    let completeSpy: jest.SpyInstance;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent, Unsubscribe]
        }).compileComponents();
        fixture = TestBed.createComponent(TestComponent);
        const testComponent = fixture.componentInstance;

        nextSpy = jest.spyOn(testComponent.destroy$, 'next');
        completeSpy = jest.spyOn(testComponent.destroy$, 'next');
    });

    it('should call next and complete when it gets destroyed', () => {
        fixture.destroy();
        expect(nextSpy).toBeCalledTimes(1);
        expect(completeSpy).toBeCalledTimes(1);
    });
});

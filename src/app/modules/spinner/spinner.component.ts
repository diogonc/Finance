
import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'app-spinner',
    styleUrls: ['spinner.component.css'],
    templateUrl: 'spinner.component.html'
})
export class SpinnerComponent implements OnDestroy {
    private currentTimeout;
    public isDelayedRunning: boolean = false;

    @Input()
    public delay: number = 300;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiDialogService } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';
import { PayService } from '../../services';
import { PayModalComponent } from '../pay-modal/pay-modal.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayComponent implements OnDestroy {
  amountControl = new FormControl<number | null>(100);
  loading = false;

  private payModalOpened = false;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly payService: PayService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  payByCard(): void {
    if (!this.amountControl.valid || this.amountControl.value === null || this.payModalOpened) {
      return;
    }

    this.payModalOpened = true;
    this.loading = true;

    this.payService
      .preparePayment(this.amountControl.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((amount) => {
        this.openCardDialog(amount);

        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  openCardDialog(amount: number): void {
    const content = new PolymorpheusComponent(PayModalComponent);

    this.dialogService
      .open(content, {
        closeable: true,
        size: 'auto',
        data: {
          amount
        }
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        complete: () => {
          this.payModalOpened = false;
        }
      });
  }
}

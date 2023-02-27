import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { SavedCard } from '../../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  TuiCard,
  tuiCardNumberValidator,
  tuiDefaultCardValidator,
  TuiInputCardGroupedComponent
} from '@taiga-ui/addon-commerce';
import { BehaviorSubject, filter, race, Subject, take, takeUntil, timer } from 'rxjs';
import { tuiInputCardGroupedCVCValidator } from '../../validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { PayService } from '../../services';
import { SavedCards } from '../../services/pay.service';

export interface DataForPayCardModal {
  amount: number;
}

enum PAYMENT_MODE {
  BY_NEW_CARD,
  BY_SAVED_CARD
}

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayModalComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly PAYMENT_MODE = PAYMENT_MODE;
  amount!: number;
  savedCardsWithoutSelected: SavedCard[] = [];
  payProcessing = false;
  selectedCardId: string | null = null;
  readonly form = new FormGroup({
    card: new FormControl<TuiCard | null>(null, [Validators.required, tuiInputCardGroupedCVCValidator()]),
    saveCard: new FormControl<boolean>(true)
  });
  @ViewChild('cardGroupedInput')
  private cardGroupedInput?: TuiInputCardGroupedComponent;
  private readonly paymentModeSubject = new BehaviorSubject<PAYMENT_MODE>(PAYMENT_MODE.BY_NEW_CARD);
  readonly paymentMode$ = this.paymentModeSubject.asObservable();
  private readonly pendingSubject = new BehaviorSubject<boolean>(true);
  readonly pending$ = this.pendingSubject.asObservable();
  private savedCards: SavedCard[] = [];

  private readonly destroyed$ = new Subject<void>();

  // eslint-disable-next-line max-params
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<void, DataForPayCardModal>,
    private readonly cdr: ChangeDetectorRef,
    private readonly payService: PayService
  ) {}

  ngOnInit() {
    this.amount = this.context?.data?.amount || 0;
  }

  ngAfterViewInit(): void {
    this.initSaveCardControlChange();

    this.payService
      .loadCards()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (savedCardsState: SavedCards | null) => {
          if (savedCardsState !== null) {
            const { cards, selected } = savedCardsState;
            this.savedCards = cards;

            this.setCard(selected);
          }

          this.pendingSubject.next(false);
        },
        error: () => this.pendingSubject.next(false)
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setCard(savedCard: SavedCard | null, fromTemplate = false): void {
    if (savedCard) {
      this.form.patchValue({
        card: {
          card: this.getSavedCardMaskedNumber(savedCard),
          expire: '**/**',
          cvc: ''
        }
      });

      this.form.controls.card.removeValidators(tuiCardNumberValidator);
      this.selectedCardId = savedCard.cardId;
      this.savedCardsWithoutSelected = this.savedCards.filter((card: SavedCard) => card.cardId !== this.selectedCardId);
      this.paymentModeSubject.next(PAYMENT_MODE.BY_SAVED_CARD);

      if (fromTemplate) {
        this.cardGroupedInput?.focusCVC();
      } else {
        // TODO: figure out why focusing cvc doesn't work without this workaround
        // this.cardGroupedInput?.focusCVC();

        const cardGroupedInputFocusedSubject = new Subject<void>();
        timer(0, 30)
          .pipe(
            take(100),
            filter(() => this.cardGroupedInput?.focused === true),
            takeUntil(race(cardGroupedInputFocusedSubject, this.destroyed$))
          )
          .subscribe(() => {
            this.cardGroupedInput?.focusCVC();
            cardGroupedInputFocusedSubject.next();
            cardGroupedInputFocusedSubject.complete();
          });
      }
    } else {
      this.form.patchValue({
        card: null
      });
      this.form.controls.card.addValidators(tuiCardNumberValidator);
      this.selectedCardId = null;
      this.savedCardsWithoutSelected = this.savedCards;
      this.paymentModeSubject.next(PAYMENT_MODE.BY_NEW_CARD);

      if (fromTemplate) {
        this.cardGroupedInput?.focusCard();
      }
    }
  }

  pay(): void {
    if (!this.form.controls.card.valid) {
      return;
    }

    this.setPayProcessing(true);

    this.payService
      .pay()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        () => {
          this.setPayProcessing(false);
          this.context.$implicit.next();
        },
        () => this.setPayProcessing(false)
      );
  }

  deleteCards(): void {
    // Noop
  }

  cardValidator(card: string): boolean {
    return tuiDefaultCardValidator(card) && card.length === 16;
  }

  private setPayProcessing(value: boolean): void {
    this.payProcessing = value;
    this.cdr.detectChanges();
  }

  private getSavedCardMaskedNumber(savedCard: SavedCard): string {
    return `${savedCard.firstSix.toString().slice(0, -2)}***${savedCard.lastFour}`;
  }

  private initSaveCardControlChange(): void {
    this.form.controls.saveCard.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.cardGroupedInput?.focusCard());
  }
}

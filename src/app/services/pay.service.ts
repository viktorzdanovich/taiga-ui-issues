import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';
import { SavedCard } from '../models';
import { MOCK_CARDS } from './mock-cards';

export interface SavedCards {
  selected: SavedCard;
  cards: SavedCard[];
}

@Injectable({
  providedIn: 'root'
})
export class PayService {
  private readonly DELAY = 2000;

  preparePayment(amount: number): Observable<number> {
    return timer(this.randomDelay()).pipe(map(() => amount));
  }

  loadCards(): Observable<SavedCards | null> {
    return timer(this.randomDelay()).pipe(
      map(() => MOCK_CARDS),
      map((cards: SavedCard[]) => ({
        selected: cards[0],
        cards: cards
      }))
      // map(() => null),
    );
  }

  pay(): Observable<any> {
    return timer(this.randomDelay()).pipe(map(() => null));
  }

  private randomDelay(): number {
    return this.DELAY * Math.random();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = false;

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly loaderService: LoaderService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loaderService.loading$.pipe(takeUntil(this.destroyed$)).subscribe((loading: boolean) => {
      this.loading = loading;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

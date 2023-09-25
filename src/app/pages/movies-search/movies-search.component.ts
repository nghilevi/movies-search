import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, fromEvent, takeUntil, tap } from 'rxjs';
import { MovieCardsComponent } from 'src/app/components/movie-cards/movie-cards.component';
import { Unsub } from 'src/app/shared/unsub.class';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MovieCardComponent, MovieCardsComponent],
})
export class MoviesSearchComponent extends Unsub implements OnInit, AfterViewInit {
  
  @ViewChild('loadMore') loadMoreBtn: ElementRef | undefined;
  movies$ = this.moviesService.movies$.pipe(takeUntil(this.unsubscribe$));
  windowScrolled = false;

  constructor(public moviesService: MoviesService) {
    super();
  }
  ngAfterViewInit(): void {
    fromEvent(this.loadMoreBtn?.nativeElement, 'click').pipe(
      debounceTime(250),
      tap(() => { this.moviesService.loadMoreMovies() }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.moviesService.init()
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset > 200;
    });
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}

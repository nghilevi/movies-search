import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, map, shareReplay, takeUntil, tap } from 'rxjs';
import { MovieCardsComponent } from 'src/app/components/movie-cards/movie-cards.component';
import { MovieListItem } from 'src/app/shared/movies.model';
import { PaginatedResult } from 'src/app/shared/shared.model';
import { MoviesApiService } from '../../services/movies.api-service';
import { Unsub } from 'src/app/shared/unsub.class';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MovieCardComponent, MovieCardsComponent],
})
export class MoviesSearchComponent extends Unsub implements OnInit {

  movies$ = this.searchService.loadedMovies$.pipe(takeUntil(this.unsubscribe$));
  windowScrolled = false;

  constructor(public searchService: SearchService) {
    super();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }

  loadMoviesMore(){
    this.searchService.loadMoreMovies()
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}

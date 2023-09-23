import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, takeUntil, tap } from 'rxjs';
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

  private moviesSub = new BehaviorSubject<MovieListItem[]>([]);
  movies$ = this.moviesSub.asObservable()

  isLoading = false
  currentPage = 1
  windowScrolled = false;

  constructor(private MoviesApiService: MoviesApiService, private searchService: SearchService) {
    super();
  }

  ngOnInit(): void {

    this.searchService.onSearch$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((searchValue: string) => {
      this.currentPage = 1
      this.loadMovies()
    });

    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }

  loadMoviesMore(){
    this.currentPage++
    this.loadMovies()
  }

  loadMovies(){
    this.isLoading = true
    const isLoadMore = this.currentPage > 1
    const searchValue = this.searchService.searchValue
    const updateMoviesList = (data: PaginatedResult<MovieListItem>) => {
      this.moviesSub.next((isLoadMore ? this.moviesSub.value : []).concat(data.results)) // this update movies$
    }
    const movies$ = searchValue ? this.MoviesApiService.searchMovies(searchValue, this.currentPage) : this.MoviesApiService.getPopularMovies(this.currentPage)
    return movies$.pipe(takeUntil(this.unsubscribe$), tap(updateMoviesList), finalize(() => {this.isLoading = false})).subscribe();
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}

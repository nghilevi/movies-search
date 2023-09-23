import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}
  
  isLoading = false;
  currentPage = 1

  private onSearchSub = new BehaviorSubject<string>('');
  private onLoadMoreSub = new BehaviorSubject<void>(undefined);
  private onUpdateMoviesSub = new BehaviorSubject<string>('');
  loadedMovies: MovieListItem[] = []
  
  onLoadMoreMovies$ = this.onLoadMoreSub.pipe(
    switchMap(() => this.loadMovies()),
    shareReplay(1) // if there is new subscriber, replay the previous emit
  )

  onSearchMovies$ = this.onSearchSub.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => { this.currentPage = 1 }),
    switchMap(() => this.loadMovies()),
    shareReplay(1)
  )

  loadedMovies$: Observable<MovieListItem[]> = this.onUpdateMoviesSub.pipe(
    switchMap((searchStr) => searchStr ? this.onSearchMovies$ : this.onLoadMoreMovies$),
  )

  search(searchStr: string){
    this.onSearchSub.next(searchStr)
    this.onUpdateMoviesSub.next(searchStr)
  }

  loadMoreMovies(){
    this.currentPage++;
    this.onLoadMoreSub.next()
    this.onUpdateMoviesSub.next('')
  }

  get searchValue(){
    return this.onSearchSub.value
  }

  

  loadMovies(): Observable<MovieListItem[]>{
    this.isLoading = true
    const searchValue = this.searchValue
    const updateMoviesList = (data: PaginatedResult<MovieListItem>) => {
      const isLoadMore = this.currentPage > 1
      this.loadedMovies = isLoadMore ? this.loadedMovies.concat(data.results) : data.results
      return this.loadedMovies
    }
    const movies$ = searchValue ? this.moviesApiService.searchMovies(searchValue, this.currentPage) : this.moviesApiService.getPopularMovies(this.currentPage)
    return movies$.pipe(map(updateMoviesList), finalize(() => {this.isLoading = false}));
  }

}

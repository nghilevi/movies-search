import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, finalize, map,  of, shareReplay, switchMap, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

enum UpdateMoviesBy {
  Search = 'search', LoadMore = 'load more'
}
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}
  
  isLoading = false;

  private searchString = ''
  private currentPage = 0
  private loadedMovies: MovieListItem[] = []

  private onSearchMoviesSub = new Subject();
  private onLoadMoreMoviesSub = new Subject();

  // using BehaviorSubject to emit previous value to later subscribers (e.g thoses created from route navigation)
  private onUpdateMoviesSub = new BehaviorSubject<UpdateMoviesBy | null>(null);

  private onLoadMoreMovies$ = this.onLoadMoreMoviesSub.pipe(
    switchMap(() => this.getMovies()),
    shareReplay(1) // store previously emitted value on onLoadMoreMovies$ for later subscribers
  )

  private onSearchMovies$ = this.onSearchMoviesSub.pipe(
    switchMap(() => this.getMovies()),
    shareReplay(1)
  )

  movies$: Observable<MovieListItem[]> = this.onUpdateMoviesSub.pipe(
    switchMap((evtName) => {
      if(!evtName) return of([])
      return evtName ===  UpdateMoviesBy.Search ? this.onSearchMovies$ : this.onLoadMoreMovies$
    }),
  )

  searchMovies(searchString: string){
    this.searchString = searchString
    this.currentPage = 1
    this.onUpdateMoviesSub.next(UpdateMoviesBy.Search)
    this.onSearchMoviesSub.next('')
  }

  loadMoreMovies(){
    this.currentPage++
    this.onUpdateMoviesSub.next(UpdateMoviesBy.LoadMore)
    this.onLoadMoreMoviesSub.next('')
  }

  private getMovies(): Observable<MovieListItem[]>{
    return this.moviesApiService.getMovies({query: this.searchString, page: this.currentPage}).pipe(
      tap(() => { this.isLoading = true; }),
      map((data: PaginatedResult<MovieListItem>) => {
        const isLoadMore = this.currentPage > 1
        this.loadedMovies = isLoadMore ? this.loadedMovies.concat(data.results) : data.results
        return this.loadedMovies
      }), 
      finalize(() => {this.isLoading = false})
    );
  }

  get searchStringVal(){
    return this.searchString
  }
}

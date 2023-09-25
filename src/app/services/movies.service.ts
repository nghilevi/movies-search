import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map,  of, shareReplay, switchMap, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

enum UserInteraction {
  Init = 'init', Search = 'search', LoadMore = 'load more'
}
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}

  private searchedMoviesPage = 1
  private popularMoviesPage = 1

  private isLoading = false;
  private queryString = ''
  private userInteractionsSub = new BehaviorSubject<UserInteraction | null>(null); // remember previous user interaction for later subscriptions (e.g using async pipe)
  
  private searchedMoviesQuerySub = new BehaviorSubject<string>('');
  private popularMoviesQuerySub = new BehaviorSubject<string>('');

  private searchedMovies$ = this.searchedMoviesQuerySub.pipe(switchMap((query) => this.searchMovies2(query)), shareReplay(1))
  private popularMovies$ = this.popularMoviesQuerySub.pipe(switchMap((query) => this.getPopularMovies(query)), shareReplay(1))

  movies$: Observable<MovieListItem[]> = this.userInteractionsSub.pipe(switchMap(
    (i) => {
      if(!i) return of([])
      if(this.queryString){
        const shouldFetchMovies = i !== UserInteraction.Init
        if(shouldFetchMovies){
          this.searchedMoviesPage = i === UserInteraction.Search ? 1 : this.searchedMoviesPage + 1
          this.searchedMoviesQuerySub.next(this.queryString);
        }
        return this.searchedMovies$
      }else{
       const shouldFetchMovies = (i !== UserInteraction.Init && i === UserInteraction.LoadMore)
       if(shouldFetchMovies){
          this.popularMoviesPage++
          this.popularMoviesQuerySub.next(this.queryString) // update popular movies / popularMovies$ emits value
        }
        return this.popularMovies$
      }
    })
  )
  
  init(){
    this.userInteractionsSub.next(UserInteraction.Init)
  }

  searchMovies(query: string){
    this.updateMovies(UserInteraction.Search, query)
  }

  loadMoreMovies(){
    this.updateMovies(UserInteraction.LoadMore, this.queryString)
  }

  private updateMovies(interaction: UserInteraction, query: string){
    this.queryString = query
    this.userInteractionsSub.next(interaction)
  }

  private searchedMovies: MovieListItem[] = []
  private searchMovies2(query: string): Observable<MovieListItem[]>{
    return this.moviesApiService.searchMovies(query, this.searchedMoviesPage).pipe(
      tap(() => { this.isLoading = true }),
      map((data: PaginatedResult<MovieListItem>) => {
        const isLoadMore = this.searchedMoviesPage > 1
        this.searchedMovies = isLoadMore ? this.searchedMovies.concat(data.results) : data.results
        return this.searchedMovies
      }), 
      finalize(() => {this.isLoading = false })
    );
  }

  private popularMovies: MovieListItem[] = []
  private getPopularMovies(query: string): Observable<MovieListItem[]>{
    return this.moviesApiService.getPopularMovies(this.popularMoviesPage).pipe(
      tap(() => { this.isLoading = true }),
      map((data: PaginatedResult<MovieListItem>) => {
        const isLoadMore = this.popularMoviesPage > 1
        this.popularMovies = isLoadMore ? this.popularMovies.concat(data.results) : data.results
        return this.popularMovies
      }), 
      finalize(() => {this.isLoading = false })
    );
  }

  get query(){
    return this.queryString
  }

  get isLoadingVal(){
    return this.isLoading
  }
}

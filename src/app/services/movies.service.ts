import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, finalize, map,  of, shareReplay, switchMap, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

enum UserInteraction {
  Search = 'search', LoadMore = 'load more'
}
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}
  
  ///
  private currentPage = 1
  private loadedMovies: MovieListItem[] = []
  private querySub = new BehaviorSubject<string>('');
  private getMovies$ = this.querySub.pipe(switchMap((query) => this.getMovies(query)), shareReplay(1))
  ///

  private searchedMoviesPage = 1
  popularMoviesPage = 0

  private isLoading = false;
  private queryString = ''
  private userInteractionsSub = new BehaviorSubject<UserInteraction | null>(null); // remember previous user interaction for later subscriptions (e.g using async pipe)
  
  private searchedMoviesQuerySub = new BehaviorSubject<string>('');
  private popularMoviesQuerySub = new BehaviorSubject<string>('');

  private searchedMovies$ = this.searchedMoviesQuerySub.pipe(switchMap((query) => this.searchMovies2(query)), shareReplay(1))
  private popularMovies$ = this.popularMoviesQuerySub.pipe(tap((query) => {console.log('popularMoviesQuerySub emits: ', query)}), switchMap((query) => this.getPopularMovies(query)), shareReplay(1))

  movies$: Observable<MovieListItem[]> = this.userInteractionsSub.pipe(switchMap(
    (i) => {
      if(!i) return of([])
      console.log('userInteractionsSub, this.query: ', this.queryString || '<empty>')
      if(this.queryString){
        console.log('userInteractionsSub, searchedMovies')
        this.searchedMoviesPage = i === UserInteraction.Search ? 1 : this.searchedMoviesPage + 1
        this.searchedMoviesQuerySub.next(this.queryString);
        return this.searchedMovies$
      }else{
        console.log('userInteractionsSub, popularMovies')
        /*
        TODO here update popular movies will be exec whenever navigating back to the Search page which is non necessary
        */
        if(i === UserInteraction.LoadMore || ((i=== UserInteraction.Search && this.queryString === '' && this.popularMoviesPage === 0))){
          this.popularMoviesPage++
          this.popularMoviesQuerySub.next(this.queryString) // update popular movies / popularMovies$ emits value
        }
        return this.popularMovies$
      }
    })
  )

  searchMovies(query: string){
    this.updateMovies(UserInteraction.Search, query)
  }

  loadMoreMovies(){
    this.updateMovies(UserInteraction.LoadMore, this.queryString)
  }

  private updateMovies(interaction: UserInteraction, query: string){
    console.log('updateMovies, interaction: ', interaction, '; query: ', query, '<empty>')
    this.currentPage = interaction === UserInteraction.Search ? 1 : this.currentPage + 1

    this.queryString = query
    // this.querySub.next(query)
    /*if(interaction === UserInteraction.Search){
      this.searchedMoviesQuerySub.next(query)
    }else{
      this.popularMoviesQuerySub.next(query)
    }*/

    this.userInteractionsSub.next(interaction)
  }

  private getMovies(query: string): Observable<MovieListItem[]>{
    return this.moviesApiService.getMovies({query, page: this.currentPage}).pipe(
      tap(() => { this.isLoading = true }),
      map((data: PaginatedResult<MovieListItem>) => {
        const isLoadMore = this.currentPage > 1
        this.loadedMovies = isLoadMore ? this.loadedMovies.concat(data.results) : data.results
        return this.loadedMovies
      }), 
      finalize(() => {this.isLoading = false })
    );
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
        console.log('isLoadMore: ', isLoadMore)
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

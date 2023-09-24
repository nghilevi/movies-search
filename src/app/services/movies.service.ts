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
  
  private isLoading = false;
  private searchString = ''
  private currentPage = 1
  private loadedMovies: MovieListItem[] = []

  private getMoviesSub = new Subject();
  private getMovies$ = this.getMoviesSub.pipe(switchMap(() => this.getMovies()), shareReplay(1)) // store previously emitted value on getMovies$ for later subscribers

  // using BehaviorSubject to emit previous value to later subscribers (e.g thoses created from route navigation)
  private onUpdateMoviesSub = new BehaviorSubject<UpdateMoviesBy | null>(null);

  movies$: Observable<MovieListItem[]> = this.onUpdateMoviesSub.pipe(switchMap((evtName) => evtName ? this.getMovies$ : of([])))

  searchMovies(searchString: string){
    this.searchString = searchString
    this.updateMovies(UpdateMoviesBy.Search)
  }

  loadMoreMovies(){
    this.updateMovies(UpdateMoviesBy.LoadMore)
  }

  updateMovies(by: UpdateMoviesBy){
    this.currentPage = by === UpdateMoviesBy.Search ? 1 : this.currentPage + 1
    this.onUpdateMoviesSub.next(by)
    this.getMoviesSub.next('')
  }

  private getMovies(): Observable<MovieListItem[]>{
    return this.moviesApiService.getMovies({query: this.searchString, page: this.currentPage}).pipe(
      tap(() => { this.isLoading = true }),
      map((data: PaginatedResult<MovieListItem>) => {
        const isLoadMore = this.currentPage > 1
        this.loadedMovies = isLoadMore ? this.loadedMovies.concat(data.results) : data.results
        return this.loadedMovies
      }), 
      finalize(() => {this.isLoading = false })
    );
  }

  get searchStringVal(){
    return this.searchString
  }

  get isLoadingVal(){
    return this.isLoading
  }
}

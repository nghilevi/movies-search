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
  
  private isLoading = false;
  private currentPage = 1
  private loadedMovies: MovieListItem[] = []

  private querySub = new BehaviorSubject<string>('');
  private getMovies$ = this.querySub.pipe(switchMap((query) => this.getMovies(query)), shareReplay(1))
  private userInteractionsSub = new BehaviorSubject<UserInteraction | null>(null); // remember previous user interaction for later subscriptions (e.g using async pipe)
  
  movies$: Observable<MovieListItem[]> = this.userInteractionsSub.pipe(switchMap((evtName) => evtName ? this.getMovies$ : of([])))

  searchMovies(query: string){
    this.updateMovies(UserInteraction.Search, query)
  }

  loadMoreMovies(){
    this.updateMovies(UserInteraction.LoadMore, this.querySub.value)
  }

  private updateMovies(by: UserInteraction, query: string){
    this.currentPage = by === UserInteraction.Search ? 1 : this.currentPage + 1
    this.userInteractionsSub.next(by)
    this.querySub.next(query)
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

  get query(){
    return this.querySub.value
  }

  get isLoadingVal(){
    return this.isLoading
  }
}

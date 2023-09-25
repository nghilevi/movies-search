import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map,  of, shareReplay, switchMap, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

type LoadedMovies = { searched: MovieListItem[], popular: MovieListItem[]}
enum UserEvt {
  Init = 'init', Search = 'search', LoadMore = 'load more'
}
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}

  private isLoading = false;
  private readonly loadedMovies: LoadedMovies = { searched: [], popular: [] }

  private userInputSub = new BehaviorSubject<{input: string, evt: UserEvt}>({input: '', evt: UserEvt.Init}); // remember previous user interaction for later subscriptions (e.g using async pipe)
  private searchedMoviesQuerySub = new BehaviorSubject<{query: string, page: number}>({query: '', page: 1});
  private popularMoviesQuerySub = new BehaviorSubject<{page: number}>({page: 1});
  private searchedMovies$ = this.searchedMoviesQuerySub.pipe(switchMap((query) => this.getMovies$(query)), shareReplay(1))
  private popularMovies$ = this.popularMoviesQuerySub.pipe(switchMap((query) => this.getMovies$(query)), shareReplay(1))

  movies$: Observable<MovieListItem[]> = this.userInputSub.pipe(switchMap(
    ({input, evt}) => {
      if(input){
        if(evt !== UserEvt.Init){
          this.searchedMoviesQuerySub.next({ query: input, page: evt === UserEvt.Search ? 1 : ++this.searchedMoviesQuerySub.value.page });
        }
        return this.searchedMovies$
      }else{
        if(evt !== UserEvt.Init && evt === UserEvt.LoadMore){
          this.popularMoviesQuerySub.next({ page: ++this.popularMoviesQuerySub.value.page })
        }
        return this.popularMovies$
      }
    })
  )
  
  init(){
    this.userInputSub.next({evt: UserEvt.Init, input: this.userInputSub.value.input})
  }

  searchMovies(query: string){
    this.userInputSub.next({evt: UserEvt.Search, input: query})
  }

  loadMoreMovies(){
    this.userInputSub.next({evt: UserEvt.LoadMore, input: this.userInputSub.value.input})
  }
  
  private getMovies$({query, page}: {query?: string, page: number}): Observable<MovieListItem[]>{
    const dataType = query ? 'searched' : 'popular' as keyof LoadedMovies
    return this.moviesApiService.getMovies({query: query || '', page }).pipe(
      tap((data: PaginatedResult<MovieListItem>) => { 
        this.isLoading = true 
        this.loadedMovies[dataType] = page > 1 ? this.loadedMovies[dataType].concat(data.results) : data.results
      }),
      map(() => this.loadedMovies[dataType]), 
      finalize(() => {this.isLoading = false })
    );
  }

  get searchString(){
    return this.userInputSub.value.input
  }

  get isLoadingVal(){
    return this.isLoading
  }
}

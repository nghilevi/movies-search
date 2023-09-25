import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize, map,  of, shareReplay, switchMap, tap } from 'rxjs';
import { MovieListItem } from '../shared/movies.model';
import { PaginatedResult } from '../shared/shared.model';
import { MoviesApiService } from './movies.api-service';

type LoadedMovies = { searched: MovieListItem[], popular: MovieListItem[]}
enum UserInteraction {
  Init = 'init', Search = 'search', LoadMore = 'load more'
}
@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private moviesApiService: MoviesApiService) {}

  private isLoading = false;
  private queryString = ''
  private loadedMovies: LoadedMovies = { searched: [], popular: [] }

  private userInteractionsSub = new BehaviorSubject<UserInteraction>(UserInteraction.Init); // remember previous user interaction for later subscriptions (e.g using async pipe)
  private searchedMoviesQuerySub = new BehaviorSubject<{query: string, page: number}>({query: '', page: 1});
  private popularMoviesQuerySub = new BehaviorSubject<{page: number}>({page: 1});
  private searchedMovies$ = this.searchedMoviesQuerySub.pipe(switchMap((query) => this.getMovies$(query)), shareReplay(1))
  private popularMovies$ = this.popularMoviesQuerySub.pipe(switchMap((query) => this.getMovies$(query)), shareReplay(1))

  movies$: Observable<MovieListItem[]> = this.userInteractionsSub.pipe(tap(console.log),switchMap(
    (i) => {
      if(this.queryString){
        if(i !== UserInteraction.Init){
          this.searchedMoviesQuerySub.next({ query: this.queryString, page: i === UserInteraction.Search ? 1 : ++this.searchedMoviesQuerySub.value.page });
        }
        return this.searchedMovies$
      }else{
        if(i !== UserInteraction.Init && i === UserInteraction.LoadMore){
          this.popularMoviesQuerySub.next({ page: ++this.popularMoviesQuerySub.value.page })
        }
        return this.popularMovies$
      }
    })
  )
  
  init(){
    this.updateMovies(UserInteraction.Init, this.queryString)
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
  
  private getMovies$({query, page}: {query?: string, page: number}): Observable<MovieListItem[]>{
    const dataType = query ? 'searched' : 'popular' as keyof LoadedMovies
    return this.moviesApiService.getMovies({query: query || '', page }).pipe(
      tap(() => { this.isLoading = true }),
      map((data: PaginatedResult<MovieListItem>) => {
        this.loadedMovies[dataType] = page > 1 ? this.loadedMovies[dataType].concat(data.results) : data.results
        return this.loadedMovies[dataType]
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

import { AfterViewInit, Component, ElementRef, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map, takeUntil } from 'rxjs';
import { MovieCardsComponent } from 'src/app/components/movie-cards/movie-cards.component';
import { MovieListItem } from 'src/app/shared/movies.model';
import { PaginatedResult } from 'src/app/shared/shared.model';
import { MoviesApiService } from '../../services/movies.api-service';
import { Unsub } from 'src/app/shared/unsub.class';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MovieCardComponent, MovieCardsComponent],
})
export class MoviesSearchComponent extends Unsub implements OnInit, AfterViewInit{

  @ViewChild('searchBox') searchBox: ElementRef | null = null

  private moviesSub = new BehaviorSubject<MovieListItem[]>([]);
  movies$ = this.moviesSub.asObservable()

  isLoading = false
  searchValue = ''
  currentPage = 1
  
  windowScrolled = false;

  constructor(private MoviesApiService: MoviesApiService) {
    super();
  }

  ngOnInit(): void {
    this.loadMovies()
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }

  loadMoviesMore(){
    this.currentPage++
    this.loadMovies()
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox?.nativeElement, 'input').pipe(
      map(event => (event as any).target.value),
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe((searchValue: string) => {
      this.searchValue = searchValue
      this.currentPage = 1
      this.loadMovies()
    });
  }

  loadMovies(){
    this.isLoading = true
    const isLoadMore = this.currentPage > 1
    const updateMoviesList = (data: PaginatedResult<MovieListItem>) => {
      this.moviesSub.next((isLoadMore ? this.moviesSub.value : []).concat(data.results))
      this.isLoading = false
    }
    if(this.searchValue){
      this.MoviesApiService.searchMovies(this.searchValue, this.currentPage).pipe(takeUntil(this.unsubscribe$)).subscribe(updateMoviesList);
    }else{
      this.MoviesApiService.getPopularMovies(this.currentPage).pipe(takeUntil(this.unsubscribe$)).subscribe(updateMoviesList);
    }
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}

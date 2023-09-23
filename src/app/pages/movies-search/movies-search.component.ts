import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MovieCardsComponent } from 'src/app/components/movie-cards/movie-cards.component';
import { Unsub } from 'src/app/shared/unsub.class';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies-search',
  templateUrl: './movies-search.component.html',
  styleUrls: ['./movies-search.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MovieCardComponent, MovieCardsComponent],
})
export class MoviesSearchComponent extends Unsub implements OnInit {

  movies$ = this.moviesService.movies$.pipe(takeUntil(this.unsubscribe$));
  windowScrolled = false;

  constructor(public moviesService: MoviesService) {
    super();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset > 200;
    });
  }

  loadMoviesMore(){
    this.moviesService.loadMoreMovies()
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

}

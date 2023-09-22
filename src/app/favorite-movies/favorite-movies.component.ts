import { Component, OnInit } from '@angular/core';
import { LocalService } from '../services/local.service';
import { RouterModule } from '@angular/router';
import { MovieCardsComponent } from '../movie-cards/movie-cards.component';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
  standalone: true,
  imports: [RouterModule, MovieCardsComponent]
})
export class FavoriteMoviesComponent implements OnInit{
  favoritedMovies = []
  constructor(private localStore: LocalService){}
  ngOnInit(): void {
    this.favoritedMovies = Object.values(this.localStore.getFavoritesStore())
  }
}

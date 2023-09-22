import { Component, Input, OnInit } from '@angular/core';
import { LS_KEY, LocalService } from '../services/local.service';
import { CommonModule } from '@angular/common';
import { MovieListItem } from '../shared/movies.model';
import { MovieDetail } from '../movie-detail/movie-detail.component';

@Component({
  selector: 'app-add-favorite-movie-btn',
  templateUrl: './add-favorite-movie-btn.component.html',
  styleUrls: ['./add-favorite-movie-btn.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FavoriteBtnComponent implements OnInit {
  @Input() movie: MovieListItem | MovieDetail | null = null
  isFavorite = false
  constructor(private localStore: LocalService) {}
  ngOnInit(): void {
    const favorites = this.localStore.getFavoritesStore()
    this.isFavorite = !!favorites[this.getMovieId()] 
  }
  toggleFavorite(event: Event){
    event.stopPropagation()
    
    const movieId = this.getMovieId()
    const favorites = this.localStore.getFavoritesStore()

    if(this.isFavorite){
      delete favorites[movieId]
      this.isFavorite = false
    }else{
      favorites[movieId] = this.movie
      this.isFavorite = true
    }
    this.localStore.saveData(LS_KEY,JSON.stringify(favorites))
  }

  getMovieId(){
    return this.movie?.id || 'invalid movie id';
  }

}

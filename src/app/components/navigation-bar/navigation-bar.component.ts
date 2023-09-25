import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {  NavigationEnd, Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MoviesService } from 'src/app/services/movies.service';
import { Unsub } from 'src/app/shared/unsub.class';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  standalone: true,
  imports: [RouterModule, NgIf, ReactiveFormsModule]
})
export class NavigationBarComponent extends Unsub implements OnInit {
  
  isHomePage = true
  isFavoritesPage = false

  searchForm = new FormGroup({
    query: new FormControl('')
  })

  constructor(private router: Router, private moviesService: MoviesService) {
    super();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects
        this.isHomePage = url === '/'
        this.isFavoritesPage = url === '/favorites'
        if(this.isHomePage){
          this.searchForm?.setValue({query: this.moviesService.searchString})
        }
      }
    });
  }

  ngOnInit(): void {
    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(query => {
      this.moviesService.searchMovies(query || '')
    });
  }

}



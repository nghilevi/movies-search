import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {  NavigationEnd, Router, RouterModule } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
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
  @ViewChild('searchBox') searchBox: ElementRef | null = null

  searchForm = new FormGroup({
    name: new FormControl('')
  })

  constructor(private router: Router, private searchService: SearchService) {
    super();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/'
        this.isFavoritesPage = event.url === '/movie/favorites'

        if(this.isHomePage){
          this.searchForm?.setValue({name: this.searchService.searchValue})
        }
      }
    });
  }

  ngOnInit(): void {
    this.searchForm.get('name')?.valueChanges.subscribe(searchStr => {
      this.searchService.search(searchStr || '')
    });
  }

}



"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[647],{6647:(O,l,e)=>{e.r(l),e.d(l,{MoviesSearchComponent:()=>S});var r=e(6814),a=e(8234),d=e(9360),m=e(8251),v=e(4829),p=e(2420),h=e(7325),f=e(5689),o=e(2029),g=e(9786);const M=function(n){return{"to-top-btn-show":n}};let S=(()=>{var n;class c extends f.O{constructor(s){super(),this.moviesService=s,this.movies$=this.moviesService.movies$.pipe(function u(n){return(0,d.e)((c,t)=>{(0,v.Xf)(n).subscribe((0,m.x)(t,()=>t.complete(),p.Z)),!t.closed&&c.subscribe(t)})}(this.unsubscribe$)),this.windowScrolled=!1}ngOnInit(){window.addEventListener("scroll",()=>{this.windowScrolled=window.pageYOffset>200})}loadMoviesMore(){this.moviesService.loadMoreMovies()}scrollToTop(){window.scrollTo(0,0)}}return(n=c).\u0275fac=function(s){return new(s||n)(o.Y36(g.I))},n.\u0275cmp=o.Xpm({type:n,selectors:[["app-movies-search"]],standalone:!0,features:[o.qOj,o.jDz],decls:7,vars:8,consts:[["id","movies-list",3,"movies"],[1,"load-more"],[3,"disabled","click"],[1,"to-top-btn",3,"ngClass","click"]],template:function(s,i){1&s&&(o._UZ(0,"app-movie-cards",0),o.ALo(1,"async"),o.TgZ(2,"section",1)(3,"button",2),o.NdJ("click",function(){return i.loadMoviesMore()}),o._uU(4),o.qZA(),o.TgZ(5,"button",3),o.NdJ("click",function(){return i.scrollToTop()}),o._uU(6,"\u2b06"),o.qZA()()),2&s&&(o.Q6J("movies",o.lcZ(1,4,i.movies$)),o.xp6(3),o.Q6J("disabled",i.moviesService.isLoading),o.xp6(1),o.Oqu(i.moviesService.isLoading?"Loading...":"Load more movies"),o.xp6(1),o.Q6J("ngClass",o.VKq(6,M,i.windowScrolled)))},dependencies:[a.Bz,r.ez,r.mk,r.Ov,h.X],styles:[".load-more[_ngcontent-%COMP%]{position:fixed;text-align:center;bottom:0;width:100%;background-color:#000;padding:1rem;z-index:200}.to-top-btn[_ngcontent-%COMP%]{cursor:pointer;margin-left:1rem;opacity:0;background:black;border:1px solid white}.to-top-btn-show[_ngcontent-%COMP%]{opacity:1!important;transition:all .2s ease-in-out}"]}),c})()}}]);
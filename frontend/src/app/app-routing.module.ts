import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TweetComponent } from './components/tweet/tweet.component';
import { MapComponent } from './components/map/map.component';
import { OtherComponent } from './components/number/other.component';
import { ClusteringComponent } from './components/clustering/clustering.component';

const routes: Routes = [
  {path:'', redirectTo:'/homepage', pathMatch:'full'},
  {path:'homepage', component : HomepageComponent},
  {path:'tweet', component : TweetComponent},
  {path:'map', component : MapComponent},
  {path:'number', component : OtherComponent},
  {path:'clustering', component : ClusteringComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

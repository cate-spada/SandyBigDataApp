import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { QueryService } from './service/query.service';

import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TweetComponent } from './components/tweet/tweet.component';
import { MapComponent } from './components/map/map.component';
import { OtherComponent } from './components/number/other.component';
import { ClusteringComponent } from './components/clustering/clustering.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ToolbarComponent,
    TweetComponent,
    MapComponent,
    OtherComponent,
    ClusteringComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatGridListModule,
    MatTreeModule,
    MatListModule,
    MatCardModule
  ],
  providers: [QueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

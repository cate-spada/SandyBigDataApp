import { Component } from '@angular/core';
import { DataResponse } from '../../interfaces/data-response';
import { QueryService } from '../../service/query.service';

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_northAmericaLow from "@amcharts/amcharts5-geodata/region/world/northAmericaLow";


@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.css']
})
export class ClusteringComponent  {

  ris: DataResponse[] = [];
  root!: am5.Root;

  constructor(private qservice: QueryService) {   }


  public query(API_URL: string, chart_type: string) : void{
    this.qservice.getQuery(API_URL).subscribe(
     (res: DataResponse[]) => {
       this.ris = res;
       if (chart_type === 'map'){
         this.mapPinChart();
       }
     }
   );
 }


  public onClickSubmit(API_URL: string, chart_type: string){
    if(this.root != undefined){
      this.root.dispose();
    }
    this.query(API_URL, chart_type);
  }

  mapPinChart(){
    // Create root and chart
    let root = am5.Root.new("chartdiv");
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    // Create map
    let map = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        projection: am5map.geoNaturalEarth1(),
        homeGeoPoint: { longitude: -74, latitude: 40 },
        homeZoomLevel: 1.5
      })
    );
    // Create polygon series
    let polygonSeries = map.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_northAmericaLow,
        exclude: ["greenland"],
        fill: am5.color(0xbbbbbb)
      })
    );
    map.set("zoomControl", am5map.ZoomControl.new(root, {}));
    polygonSeries.events.on("datavalidated", function() {
      map.goHome();
    })
    let pointSeries = map.series.push(
      am5map.MapPointSeries.new(root, {})
    );
    let colorSet = am5.ColorSet.new(root, {step:2});
    pointSeries.bullets.push(function(root, series, dataItem) {
      let context = dataItem.dataContext as any;
      //let value = context.value;
      let color = context.color;

      let container = am5.Container.new(root, {});
      let radius =  10;
      let circle = container.children.push(am5.Circle.new(root, {
        radius: radius,
        fill: color,
        dy: -radius * 5
      }))
      let pole = container.children.push(am5.Line.new(root, {
        stroke: color,
        height: -40,
        strokeGradient: am5.LinearGradient.new(root, {
          stops:[
            { opacity: 1 },
            { opacity: 1 },
            { opacity: 0 }
          ]
        })
      }));
      return am5.Bullet.new(root, {
        sprite: container
      });
    });
    // Create pins
    let data = this.ris;
    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      let c = d.color as string;
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [d.longitude, d.latitude] },
        title: d.event,
        //value: d.value,
        color: am5.color(c)
      });
    }
    let legend = map.children.push(am5.Legend.new(root, {
      nameField: "name",
      fillField: "color",
      strokeField: "color",
      y: am5.percent(100),
      centerY: am5.percent(100)
    }));
    legend.data.setAll([{
        name: "homeless",
        color: am5.color('#FF0000')
      }, {
        name: "collapsed crane",
        color: am5.color("#00FF00")
      },{
      name: "without power",
      color: am5.color("#0000FF")
      },{
      name: "deaths",
      color: am5.color("#FF8000")
      },{
        name: "without power",
        color: am5.color("#7F00FF")
      },
      {
        name: "deaths",
        color: am5.color("#B39500")
      }
    ]);
    this.root=root;
  }

}





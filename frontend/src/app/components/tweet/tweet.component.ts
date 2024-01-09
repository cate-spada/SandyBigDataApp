import { Component } from '@angular/core';
import { DataResponse } from '../../interfaces/data-response';
import { QueryService } from '../../service/query.service';

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent  {

  ris: DataResponse[] = [];
  root!: am5.Root;


  constructor(private qservice: QueryService) { }

  public onClickSubmit(API_URL: string, chart_type: string){
    if(this.root != undefined){
      this.root.dispose();
    }
    this.query(API_URL, chart_type);
  }


  public query(API_URL: string, chart_type: string) : void{
     this.qservice.getQuery(API_URL).subscribe(
      (res: DataResponse[]) => {
        this.ris = res;
        if(chart_type === 'pie'){
          this.pieChart();
        }
        else if (chart_type === 'column'){
          this.columnChart();
        }
      }
    );
  }

  pieChart(){
    let root = am5.Root.new("chartdiv");
    console.log(this.ris);
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );
    // Define data
    let data = this.ris;
    // Create series
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "count",
        categoryField: "category",
      })
    );
    series.labels.template.setAll({
      maxWidth: 150,
      oversizedBehavior: "wrap"
    });
    series.data.setAll(data);
    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.verticalLayout
    }));
    legend.data.setAll(series.dataItems);
    this.root = root;
    series.appear();
    chart.appear(1000, 100);
  }


  columnChart(){
    // Create root element
    let root = am5.Root.new("chartdiv");
    console.log(this.ris);
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    // Create chart
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none"
    }));
    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "state",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    xAxis.get("renderer").labels.template.setAll({
      oversizedBehavior: "wrap",
      maxWidth: 92
    });
    xRenderer.grid.template.set("visible", false);
    let yRenderer = am5xy.AxisRendererY.new(root, {});
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      extraMax: 0.1,
      renderer: yRenderer
    }));
    yRenderer.grid.template.setAll({
      strokeDasharray: [2, 2]
    });
    // Create series
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      fill: am5.color(0xba8cf0),
      stroke: am5.color(0xba8cf0),
      sequencedInterpolation: true,
      categoryXField: "state",
      tooltip: am5.Tooltip.new(root, { dy: -25, labelText: "{valueY}" })
    }));
    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5
    });

    series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });
    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });
    // Set data
    let data: unknown[] = [];
    this.ris.forEach(item =>
      data.push({
        state: item.state,
        count: item.count,
        bulletSettings: {src: item.category}
      })
      );
    series.bullets.push(function() {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Picture.new(root, {
          templateField: "bulletSettings",
          width: 30,
          height: 30,
          centerX: am5.p50,
          centerY: am5.p50,
          shadowColor: am5.color(0x000000),
          shadowBlur: 4,
          shadowOffsetX: 4,
          shadowOffsetY: 4,
          shadowOpacity: 0.6
        })
      });
    });
    xAxis.data.setAll(data);
    series.data.setAll(data);
    this.root=root;
    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  }


}

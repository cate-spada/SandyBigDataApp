import { DataResponse } from '../../interfaces/data-response';
import { Component } from '@angular/core';
import { QueryService } from '../../service/query.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent {

  ris: DataResponse[] = [];
  root!: am5.Root;


  constructor(private qservice: QueryService) { }

  public queryDamage(API_URL: string){
    if(this.root != undefined){
      this.root.dispose();
    }
    this.qservice.getQuery(API_URL).subscribe(
      (res: DataResponse[]) => {
        this.ris = res;
        console.log(this.ris);
      }
    );

  }

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
    series.data.setAll(data);
    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout
    }));
    legend.data.setAll(series.dataItems);
    this.root = root;
    series.appear();
    chart.appear(1000, 100);
  }


  columnChart(){
    // Create root element
    let root = am5.Root.new("chartdiv");
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    // Create chart
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX:true
    }));
    // Add cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);
    // Create axes
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "category",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));
    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));
    // Create series
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      sequencedInterpolation: true,
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText:"{valueY}"
      })
    }));
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
    series.columns.template.adapters.add("fill", function(fill, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });
    series.columns.template.adapters.add("stroke", function(stroke, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });
    // Set data
    let data = this.ris;
    xAxis.data.setAll(data);
    series.data.setAll(data);
    this.root = root;
    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  }

}

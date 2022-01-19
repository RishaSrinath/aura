import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as moment from 'moment';
// var moment = require('moment');
import { BillElement } from 'app/billing/billing.component';
import { DashboardService } from './dashboard.service';
import * as _ from 'lodash';
// const _ = require("lodash"); 
import { Ornament } from 'app/inventory/ornaments/ornaments.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todayBills : BillElement[] = [];
  materials : string[] = [];
  today : string;
  yesterday: string;
  tomorrow: string;
  sales: number = 0;
  expense: number = 0;
  unsoldOrns: Ornament[] = [];
  materrialObj = {};
  constructor( public dashService: DashboardService) {
    this.today = moment().format("YYYY-MM-DD");
    this.yesterday = moment().subtract(1,'day').format("YYYY-MM-DD");
    this.tomorrow = moment().add(1,'day').format("YYYY-MM-DD");
    this.getUnsoldOrnaments();
    this.getTodayInvoices();
  }


  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);
  }


  getTodayInvoices(){
    this.dashService.getInvoicesforDate(this.today, this.tomorrow).subscribe((res:any)=>{
      this.sales = _.sumBy(res, function(o) { return o.amount; });
      this.todayBills = res;
    }, err =>{
      console.log(err);
    });
  }

  getUnsoldOrnaments(){
    this.dashService.getOrnamentsByStatus(0).subscribe((res)=>{
      this.unsoldOrns = res;
      for(let orn of res){
        if(this.materials.includes(orn.material.name)){
          this.materrialObj[orn.material.name].count = this.materrialObj[orn.material.name].count + 1;
          this.materrialObj[orn.material.name].quantity = orn.net_weight ? this.materrialObj[orn.material.name].quantity + orn.net_weight : this.materrialObj[orn.material.name].quantity;
          this.materrialObj[orn.material.name].value = orn.price ? this.materrialObj[orn.material.name].value + orn.price : this.materrialObj[orn.material.name].price;
        }
        else{
          this.materials.push(orn.material.name);
          this.materrialObj[orn.material.name] = {
            count:1,
            quantity:orn.net_weight ? orn.net_weight:0,
            value:orn.price ? orn.price : 0
          }
          console.log("Material Object", this.materrialObj);
        }
      }
    }, err =>{
      console.log(err);
    })
  }

}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../models/Pool';

@Component({
  selector: 'app-pools-list',
  templateUrl: './pools-list.component.html',
  styleUrls: ['./pools-list.component.css']
})

export class PoolsListComponent {

  url: string = "https://api-osmosis.imperator.co"

  pools: Pool[] = []

  constructor(private http: HttpClient) {

    this.getPools();

  }

  getPools(): void{

    let route = "/pools/v2/all?low_liquidity=true";

    this.http.get(this.url + route)
      .subscribe(
        (resp: any) => {
          let numPools = Object.keys(resp).length;
          for (let i = 1; i <= numPools; i++) {

            let pool = new Pool(
              i, resp[i][0].symbol, resp[i][1].symbol, resp[i][0].liquidity
            )
            if(pool.liquidity >= 1000000) {
              this.pools.push(pool);
            }

          }
          this.pools.sort((a, b) => b.liquidity - a.liquidity)

          this.getAPR();
      }
    )

  }

  getAPR(): void{

    let route = "/apr/v2/all"

    this.http.get(this.url + route)
      .subscribe(
        (resp: any) => {
          resp.forEach((p: any) => {

            let i = this.pools.findIndex(
              (pool: Pool) => pool.id == p.pool_id
            )
            if(i < 0) return;
            let aprList = p.apr_list;
            let iApr = aprList.findIndex(
              (x:any) => x.symbol == 'OSMO'
            )
            let remove = false;
            if(iApr == -1) {
              remove = true
              iApr = 0;
            };
            this.pools[i].apr14 = aprList[iApr].apr_14d;
            this.pools[i].apr7 = aprList[iApr].apr_7d;
            this.pools[i].apr1 = aprList[iApr].apr_1d;
            if(remove) {
              this.pools.splice(i, 1);
              remove = false;
            }

          });
        }
      )
  }

  sortTable(i: number): void {

    switch(i){
      case 14: {
        this.pools.sort((a: any, b: any) => {
          return (b.apr14 - a.apr14);
        });
        break;
      }
      case 7: {
        this.pools.sort((a: any, b: any) => {
          return (b.apr7 - a.apr7);
        });
        break;
      }
      case 1: {
        this.pools.sort((a: any, b: any) => {
          return (b.apr1 - a.apr1);
        });
        break;
      }
      default: break;
    }

  }

}
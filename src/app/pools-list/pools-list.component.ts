import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../models/Pool';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pools-list',
  templateUrl: './pools-list.component.html',
  styleUrls: ['./pools-list.component.css']
})

export class PoolsListComponent implements OnInit {

  faHeart = faHeart;

  url: string = "https://api-osmosis.imperator.co";

  pools: Pool[] = [];

  sorted: boolean = false;

  loading: boolean = true;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.getPools();

  }


  getPools(): void {

    let route = "/pools/v2/all?low_liquidity=true";

    this.http.get(this.url + route)
      .subscribe(
        (resp: any) => {
          let numPools = Object.keys(resp).length;
          for (let i = 1; i <= numPools; i++) {

            let pool = new Pool(
              i, resp[i][0].symbol, resp[i][1].symbol, resp[i][0].liquidity
            )
            if (pool.liquidity >= 300000) {
              this.pools.push(pool);
            }

          }
          this.pools.sort((a, b) => b.liquidity - a.liquidity)

          this.getAPR();
        }
      )

  }

  getAPR(): void {

    let route = "/apr/v2/all"

    this.http.get(this.url + route)
      .subscribe(
        (resp: any) => {
          resp.forEach((p: any) => {

            let i = this.pools.findIndex(
              (pool: Pool) => pool.id == p.pool_id
            )
            if (i < 0) return;
            let aprList = p.apr_list;
            let iApr = aprList.findIndex(
              (x: any) => x.symbol == 'OSMO'
            )
            let remove = false;
            if (iApr == -1) {
              remove = true
              iApr = 0;
              console.log(this.pools[i]);
            };
            this.pools[i].apr14 = aprList[iApr].apr_14d;
            this.pools[i].apr7 = aprList[iApr].apr_7d;
            this.pools[i].apr1 = aprList[iApr].apr_1d;
            if (remove) {
              this.pools.splice(i, 1);
              remove = false;
            }

            this.loading = false;

          });
        }
      )
  }

  sortTable(i: number): void {

    if (!this.sorted) {

      switch (i) {
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
        case 0: {
          this.pools.sort((a: any, b: any) => {
            return (b.liquidity - a.liquidity);
          });
          break;
        }
        default: break;
      }

      this.sorted = true;

    } else {

      switch (i) {
        case 14: {
          this.pools.sort((a: any, b: any) => {
            return (a.apr14 - b.apr14);
          });
          break;
        }
        case 7: {
          this.pools.sort((a: any, b: any) => {
            return (a.apr7 - b.apr7);
          });
          break;
        }
        case 1: {
          this.pools.sort((a: any, b: any) => {
            return (a.apr1 - b.apr1);
          });
          break;
        }
        case 0: {
          this.pools.sort((a: any, b: any) => {
            return (a.liquidity - b.liquidity);
          });
          break;
        }
        default: break;
      }

      this.sorted = false

    }

  }

  getImage(symbol: string): string {

    let urlImg = 'https://app.osmosis.zone/public/assets/tokens/';

    symbol = symbol.toLowerCase();

    if (symbol == 'atom') symbol = 'cosmos';
    if (symbol == 'osmo') symbol = 'osmosis';
    if (symbol == 'xki') symbol = 'ki';
    if (symbol == 'like') symbol = 'likecoin';

    urlImg += symbol + '.svg';

    return urlImg;

  }

  updateUrl(event: any) {

    let newUrl = event.srcElement.src.slice(0, -3) + 'png';
    event.srcElement.src = newUrl;

  }

}

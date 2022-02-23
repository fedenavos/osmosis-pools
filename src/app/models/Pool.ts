
export class Pool {

    id: number;
    asset1: string;
    asset2: string;
    liquidity: number;
    apr1!: number;
    apr7!: number;
    apr14!: number;
  
    constructor(_id: number, _asset1: string, _asset2: string, _liquidity: number){
      this.id = _id;
      this.asset1 = _asset1;
      this.asset2 = _asset2;
      this.liquidity = _liquidity;
    }
  
} 
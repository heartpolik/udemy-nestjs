import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}

  getData(a: number, b: number) {
    console.log('computing');
    this.powerService.supplyPower(a + b);
  }
}

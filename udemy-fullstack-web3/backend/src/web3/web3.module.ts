import { Module } from '@nestjs/common';
import Web3 from 'web3';
import { Web3Service } from './web3.service';
import { WEB_PROVIDER } from 'src/config/jwt';

@Module({
  providers: [
    Web3Service,
    {
      provide: 'WEB3',
      useValue: new Web3(WEB_PROVIDER),
    },
  ],
  exports: [Web3Service],
})
export class Web3Module {}

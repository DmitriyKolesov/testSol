import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokensDto } from './dto/mint-tokens.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress() {
    return {result: this.appService.getContractAddress()};
  }

  @Get('token-name')
  async getTokenName() {
    return {result: await this.appService.getTokenName()};
  }
  @Get('total-supply')
  async getTotalSupply() {
    return {result: await this.appService.getTotalSupply()};
  }
  @Get('token-balance')
  async getTokenBalance(@Query('address') address: string) {
    return {result: await this.appService.getTokenBalance(address)};
  }

  @Post('check-minter-role')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { title: 'address', type: 'string' },
      },
    },
  })
  async checkMinterRole(@Body() body: {address: string}) {
    const {address} = body;
    // @ts-ignore
    const mintTx = await this.appService.checkMinterRole(address);
    return {result: mintTx};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokensDto) {
    const {address, amount} = body;
    // @ts-ignore
    const mintTx = await this.appService.mintTokens(address, amount);
    return {result: mintTx};
  }
}

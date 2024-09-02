import { ApiProperty } from '@nestjs/swagger';

export class MintTokensDto {
  @ApiProperty({type: String, required: true, description: 'The address of the minter'})
  address: string;

  @ApiProperty({type: Number, required: true, description: 'Amount of tokens to mint'})
  amount: number;
}

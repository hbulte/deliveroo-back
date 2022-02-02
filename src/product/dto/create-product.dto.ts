import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  productDesc: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  productPrice: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  productImageUrl: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  productNumber: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  storeId: string;
}

import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  storeDesc: string;
}

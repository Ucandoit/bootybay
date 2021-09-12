import { Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
export class ItemsRequest {
  @Transform(({ value }) => value.split(',').map((v) => parseInt(v, 10)))
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}

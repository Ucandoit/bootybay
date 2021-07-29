import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { AnySchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: AnySchema) {}

  transform(input: unknown) {
    const { error, value } = this.schema.validate(input, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      this.logger.log(error);
      throw new BadRequestException(error.message);
    }
    return value;
  }
}

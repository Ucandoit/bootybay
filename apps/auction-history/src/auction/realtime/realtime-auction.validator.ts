import * as Joi from 'joi';

export const realtimeAuctionsRequestSchema = Joi.object({
  realm: Joi.string().required(),
  page: Joi.number().positive().allow(0),
  size: Joi.number().positive(),
});

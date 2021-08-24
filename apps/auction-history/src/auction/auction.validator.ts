import * as Joi from 'joi';

const objectSchema = Joi.object({
  itemString: Joi.string().required(),
  realm: Joi.string().required(),
  timestamp: Joi.number().required(),
  regionMarketValue: Joi.number(),
  regionHistorical: Joi.number(),
  regionSale: Joi.number(),
  regionSoldPerDay: Joi.number(),
  regionSalePercent: Joi.number(),
  marketValue: Joi.number(),
  minBuyout: Joi.number(),
  historical: Joi.number(),
  numAuctions: Joi.number(),
});

export const createAuctionSchema: Joi.AnySchema = Joi.alternatives().try(objectSchema, Joi.array().items(objectSchema));

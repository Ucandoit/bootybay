import * as Joi from 'joi';

export const createAuctionsSchema: Joi.AnySchema = Joi.array()
  .items(
    Joi.object({
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
    })
  )
  .min(1);

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export const preference = new Preference(client);
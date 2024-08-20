import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development'});

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
        user: 'tech@robolsolutions.com',
        pass: process.env.PASS_EMAIL
    }
})

export default transporter;
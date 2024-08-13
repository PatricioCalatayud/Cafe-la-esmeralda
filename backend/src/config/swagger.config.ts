import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const configDocumentation = new DocumentBuilder()
    .setTitle('Cafetería - La Esmeralda')
    .setDescription('Documentación oficial de la cafetería La Esmeralda.')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, configDocumentation);
    SwaggerModule.setup('api', app, document);
}
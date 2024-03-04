import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = '5000';
    const app = await NestFactory.create(AppModule);
    const bodyparser = require('body-parser');
    app.use(
        cookieParser(),
        bodyparser.urlencoded({ limit: '50mb', extended: false })
    );
    app.enableCors({
        origin: process.env.FRONT_ORIGIN,
        credentials: true,
    });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const config = new DocumentBuilder()
      .setTitle("Great chat API.")
      .setDescription("Great chat.")
      .setVersion("1.0")
      .addTag("chat")
      .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();
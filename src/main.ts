import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function start() {
    const PORT = '5000';
    const app = await NestFactory.create(AppModule);

    const bodyparser = require('body-parser');

    app.use(
        cookieParser(),
        bodyparser.urlencoded({ limit: '50mb', extended: false })
    );

    app.enableCors({
        origin: 'https://great-collections-front.vercel.app',
        preflightContinue: false,
        credentials: true,
        allowedHeaders: 'Content-Type, Accept',
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();
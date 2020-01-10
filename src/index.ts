import "./apm";
import * as dotenv from "dotenv";
import { logger } from "./logger";
import { Application } from "./app";

dotenv.config();

const knexfile = require("../knexfile");

const application = new Application({
  knexConfig: knexfile,
  httpPort:
    (process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT, 10)) || 3000,
  httpBodyLimit: process.env.HTTP_BODY_LIMIT || "10kb",
  jsonPlaceholderUrl:
    process.env.JSON_PLACEHOLDER_URL || "https://jsonplaceholder.typicode.com",
  rabbitMQProtocol: process.env.RABBIT_PROTOCOL || "amqp",
  rabbitMQHost: process.env.RABBIT_HOST || "localhost",
  rabbitMQPort: parseInt(process.env.RABBIT_PORT || "5672"),
  rabbitMQUsername: process.env.RABBIT_USERNAME || "admin",
  rabbitMQPassword: process.env.RABBIT_PASSWORD || "admin",
  rabbitMQHomeVHost: process.env.RABBITMQ_HOME_VHOST || "/",
  rabbitMQWorkVHost: process.env.RABBITMQ_WORK_VHOST || "/"
});

setImmediate(async () => {
  await application.start();
  logger.info("Application started");
});

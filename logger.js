const { ApiLog } = require("./src/config/db");
const winston = require("winston");
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;


const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${lebel}: ${message}`;
})

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        label({ label:"Winston 연습 어플리케이션"}),
        logFormat,
    )
})


module.exports = logger;
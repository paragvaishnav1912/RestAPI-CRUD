import { mongo } from "mongoose";
import { createLogger, transports, format } from 'winston';

class logger
{
    logger = createLogger( {
        transports: [
            new transports.File( {
                filename: 'info.log',
                level: 'info',
                format: format.combine( format.timestamp(),format.json())
            } ),
        ]
    } );
}

export default new logger();
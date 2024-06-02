/* import * as Sentry from '@sentry/react'; */
/* import { SENTRY_ENABLE_REPORT, STAGE_URL } from '~constants'; */

class Logger {
    private isDevelopment: boolean;

    constructor() {
        // Set this to true if the Node environment is "development", otherwise set it to false.
        // Or if on the Stage origin
        this.isDevelopment =
            process.env.NODE_ENV === 'development'
    }

    debug(msg: string, ...args: any[]) {
        if (this.isDevelopment) {
            console.debug(msg, ...args);
        }
    }

    info(msg: string) {
        if (this.isDevelopment) {
            console.info(msg);
        }
    }

    warn(msg: string) {
        /* if (SENTRY_ENABLE_REPORT === 'true') {
            Sentry.captureMessage(JSON.stringify(msg), 'warning');
        } */
        if (this.isDevelopment) {
            console.warn(msg);
        }
    }

    error(error: Error, ...args: any[]) {
        console.error(error, ...args);
        /* try {
            if (SENTRY_ENABLE_REPORT === 'true') {
                Sentry.captureMessage(JSON.stringify(error?.message), 'error');
            }
        } catch (err) {
            this.debug('error in sentry', err);
        } */
    }
}

export const logger = new Logger();

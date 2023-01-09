import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigFactory } from "code-config";
import { join } from "path";
import { PATHS } from "src/shared/constants/path";

export interface MailerSchema {
    transport: MailerOptions['transport'];
    defaults: MailerOptions['defaults'];
}

const defaultValue = {
    transport: {
        host: 'credentials here',
        secure: false,
        auth: {
            user: 'user@example.com',
            pass: 'VerySecret',
        },
    },
    defaults: {
        from: '"No Reply" <noreply@example.com>',
    },
};

export const mailerConfig = ConfigFactory.getConfig<MailerSchema>(
    join(PATHS.config, 'mailer.config.json'),
    defaultValue,
);

mailerConfig.initPrettify();
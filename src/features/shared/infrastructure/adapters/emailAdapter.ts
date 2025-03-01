import nodemailer from 'nodemailer';
import { APIError } from '../../helpers';
import { ResultStatus } from '../../../../constants';
import { injectable } from 'inversify';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_BLOG_PLATFORM,
        pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
    },
});

@injectable()
export class EmailAdapter {
    sendEmail(email: string, subject: string, message: string) {
        transporter
            .sendMail({
                from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
                to: email,
                subject: subject,
                html: message,
            })
            .catch(err => {
                console.error(err);
                throw new APIError({ status: ResultStatus.Failure, message: 'Email adapter send error' });
            });
    }
}

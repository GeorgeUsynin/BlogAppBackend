import nodemailer from 'nodemailer';
import { ResultStatus } from '../../../constants';
import { Result } from '../types';

type TInfo = Awaited<ReturnType<typeof transporter.sendMail>>;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_BLOG_PLATFORM,
        pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
    },
});

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        transporter
            .sendMail({
                from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
                to: email,
                subject: subject,
                html: message,
            })
            .catch(error => {
                console.error('Email adapter send error', error);
            });
    },
};

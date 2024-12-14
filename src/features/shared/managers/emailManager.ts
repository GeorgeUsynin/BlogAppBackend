import { emailAdapter } from '../adapters';

export const emailManager = {
    sendPasswordConfirmationEmail(email: string, code: string) {
        const subject = 'Password Confirmation';
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://some-front.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;

        return emailAdapter.sendEmail(email, subject, message);
    },
};

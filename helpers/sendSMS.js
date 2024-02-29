import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendSMS = async (phone, message) => {

    try {
        const response = await client.messages.create({
            body: message,
            from: '+19138280038',
            to: phone
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }

}



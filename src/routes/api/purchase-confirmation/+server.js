import { json } from '@sveltejs/kit';
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '$env/static/private';

sgMail.setApiKey(SENDGRID_API_KEY);

const PDF_GUIDE_URL = "https://narrify-public.s3.eu-central-1.amazonaws.com/sample.pdf";

export async function POST({ request }) {
    const requestBody = await request.json();
    const response = await fetch(PDF_GUIDE_URL);
    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    const customerEmail = requestBody.data.object.customer_details.email;
    const customerName = requestBody.data.object.customer_details.name;
    console.log(requestBody.data.object.customer_details);

    const msg = {
        to: customerEmail,
        from: 'sittingpilgrim@gmail.com',
        subject: 'Purchase Confirmation',
        html: `<p>Thank you for your purchase, ${customerName}!</p>`,
        attachments: [
            {
                content: pdfBase64,
                filename: 'sample.pdf',
                type: 'application/pdf',
                disposition: 'attachment'
            }
        ]
    };

    await sgMail.send(msg);

    return json({
        response: "Email sent",
    });
}


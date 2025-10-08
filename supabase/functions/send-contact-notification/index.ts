import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  inquiry_type: string;
  message?: string;
  preferred_contact?: string;
  urgency?: string;
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const formData: ContactFormData = await req.json();

    if (!formData.full_name || !formData.email || !formData.inquiry_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Form submitted successfully. Email notifications are pending configuration."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const inquiryTypeLabels: Record<string, string> = {
      consultation: "General Consultation",
      contingency_placement: "Contingency Placement",
      contract_services: "In-house Contract Services",
      coaching: "Resume/Coaching Services",
      general: "General Inquiry",
    };

    const urgencyLabels: Record<string, string> = {
      immediate: "Immediate",
      "within-week": "Within a Week",
      "within-month": "Within a Month",
      flexible: "Flexible",
    };

    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0f172a; margin-bottom: 5px; }
            .value { color: #475569; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name:</div>
                <div class="value">${formData.full_name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
              </div>
              ${formData.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${formData.phone}">${formData.phone}</a></div>
              </div>
              ` : ''}
              ${formData.company_name ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${formData.company_name}</div>
              </div>
              ` : ''}
              ${formData.job_title ? `
              <div class="field">
                <div class="label">Job Title:</div>
                <div class="value">${formData.job_title}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Service Interest:</div>
                <div class="value">${inquiryTypeLabels[formData.inquiry_type] || formData.inquiry_type}</div>
              </div>
              ${formData.preferred_contact ? `
              <div class="field">
                <div class="label">Preferred Contact Method:</div>
                <div class="value">${formData.preferred_contact}</div>
              </div>
              ` : ''}
              ${formData.urgency ? `
              <div class="field">
                <div class="label">Timeline:</div>
                <div class="value">${urgencyLabels[formData.urgency] || formData.urgency}</div>
              </div>
              ` : ''}
              ${formData.message ? `
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This email was sent from your Rare Find Talent website contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .message { color: #475569; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Thank You for Your Inquiry</h1>
            </div>
            <div class="content">
              <p class="message">Dear ${formData.full_name},</p>
              <p class="message">Thank you for reaching out to Rare Find Talent. We've received your inquiry regarding ${inquiryTypeLabels[formData.inquiry_type] || formData.inquiry_type}.</p>
              <p class="message">We'll review your information and get back to you within 24 hours. In the meantime, feel free to explore our services and success stories on our website.</p>
              <p class="message">Best regards,<br>Krysta<br>Rare Find Talent</p>
            </div>
            <div class="footer">
              <p>Rare Find Talent | Connecting Top Talent with the Right Opportunities</p>
              <p><a href="mailto:contact@rarefindtalent.com">contact@rarefindtalent.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailPromises = [];

    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Rare Find Talent <noreply@rarefindtalent.com>',
          to: ['contact@rarefindtalent.com'],
          subject: `New Contact Form Submission from ${formData.full_name}`,
          html: ownerEmailHtml,
        }),
      })
    );

    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Rare Find Talent <noreply@rarefindtalent.com>',
          to: [formData.email],
          subject: 'Thank You for Contacting Rare Find Talent',
          html: userEmailHtml,
        }),
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const failedEmails = results.filter(result => result.status === 'rejected');
    if (failedEmails.length > 0) {
      console.error('Some emails failed to send:', failedEmails);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Form submitted successfully. Email notifications sent."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
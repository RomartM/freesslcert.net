import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is an SSL certificate?",
    answer:
      "An SSL/TLS certificate encrypts data between your website and visitors, ensuring secure communication. It's what makes your site show the padlock icon and use HTTPS.",
  },
  {
    question: "Is this really free?",
    answer:
      "Yes, completely free. We use Let's Encrypt, a nonprofit Certificate Authority that provides free SSL certificates. There are no hidden costs or premium tiers.",
  },
  {
    question: "How long do certificates last?",
    answer:
      "Let's Encrypt certificates are valid for 90 days. We recommend setting a reminder to renew before expiration. You can generate a new certificate anytime.",
  },
  {
    question: "What's the difference between HTTP and DNS validation?",
    answer:
      "HTTP validation requires you to place a file on your web server. DNS validation requires adding a TXT record to your domain's DNS. DNS validation is required for wildcard certificates.",
  },
  {
    question: "Are wildcard certificates supported?",
    answer:
      "Yes! Select 'Wildcard' as the certificate type and use DNS validation. A wildcard certificate covers your domain and all its subdomains (e.g., *.example.com).",
  },
  {
    question: "Is my private key stored on your servers?",
    answer:
      "Private keys are generated on our server for the certificate issuance process, then served to you over HTTPS. They are automatically purged within 24 hours. For maximum security, download your certificate immediately.",
  },
  {
    question: "What about rate limits?",
    answer:
      "Let's Encrypt has rate limits: 50 certificates per domain per week, and 5 duplicate certificates per week. These are generous for most use cases.",
  },
];

export function FaqSection() {
  return (
    <section className="py-12" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-2xl font-bold text-center text-foreground mb-8"
      >
        Frequently Asked Questions
      </h2>

      <Accordion className="mx-auto max-w-2xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-ssl",
    question: "What is an SSL certificate?",
    answer:
      "An SSL/TLS certificate encrypts data between your website and visitors, ensuring secure communication. It's what makes your site show the padlock icon and use HTTPS.",
  },
  {
    id: "faq-free",
    question: "Is this really free?",
    answer:
      "Yes, completely free. We use Let's Encrypt, a nonprofit Certificate Authority that provides free SSL certificates. There are no hidden costs or premium tiers.",
  },
  {
    id: "faq-duration",
    question: "How long do certificates last?",
    answer:
      "Let's Encrypt certificates are valid for 90 days. We recommend setting a reminder to renew before expiration. You can generate a new certificate anytime.",
  },
  {
    id: "faq-validation",
    question: "What's the difference between HTTP and DNS validation?",
    answer:
      "HTTP validation requires you to place a file on your web server. DNS validation requires adding a TXT record to your domain's DNS. DNS validation is required for wildcard certificates.",
  },
  {
    id: "faq-wildcard",
    question: "Are wildcard certificates supported?",
    answer:
      "Yes! Select 'Wildcard' as the certificate type and use DNS validation. A wildcard certificate covers your domain and all its subdomains (e.g., *.example.com).",
  },
  {
    id: "faq-privacy",
    question: "Is my private key stored on your servers?",
    answer:
      "Private keys are generated on our server for the certificate issuance process, then served to you over HTTPS. They are automatically purged within 24 hours. For maximum security, download your certificate immediately.",
  },
  {
    id: "faq-limits",
    question: "What about rate limits?",
    answer:
      "Let's Encrypt has rate limits: 50 certificates per domain per week, and 5 duplicate certificates per week. These are generous for most use cases.",
  },
];

export function FaqSection() {
  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-xl font-semibold tracking-tight text-neutral-900 text-center mb-6"
      >
        FAQ
      </h2>
      <Accordion className="space-y-2">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-lg border border-neutral-200/60 px-4 data-open:bg-neutral-50/50"
          >
            <AccordionTrigger className="text-sm font-medium text-neutral-900 hover:no-underline py-3">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-neutral-500 leading-relaxed pb-3">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

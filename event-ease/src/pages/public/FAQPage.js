import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Accordion,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // FAQ categories and questions
  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      faqs: [
        {
          id: "what-is-eventease",
          question: "What is EventEase?",
          answer:
            "EventEase is an event booking platform that allows users to discover, explore, and book tickets for various events including concerts, conferences, workshops, sports events, and more. We connect event organizers with attendees to create memorable experiences.",
        },
        {
          id: "create-account",
          question: "How do I create an account?",
          answer:
            "Creating an account is easy! Click on the \"Sign Up\" button in the top-right corner of the homepage. Fill in your details including your name, email address, and password. Once you submit the form, you'll receive a verification email. Click the link in the email to verify your account and you're all set!",
        },
        {
          id: "event-types",
          question: "What types of events can I find on EventEase?",
          answer:
            "EventEase hosts a diverse range of events including concerts, conferences, exhibitions, workshops, sports events, festivals, and community gatherings. You can use the category filter on our events page to find specific types of events that interest you.",
        },
      ],
    },
    {
      id: "bookings",
      title: "Bookings & Tickets",
      faqs: [
        {
          id: "book-tickets",
          question: "How do I book tickets for an event?",
          answer:
            "To book tickets, first browse or search for events. Once you find an event you're interested in, click on it to view details. If tickets are available, you'll see a \"Book Tickets\" button. Click it, select the number of tickets you want, and proceed to checkout. You'll need to be logged in to complete your purchase.",
        },
        {
          id: "payment-methods",
          question: "What payment methods are accepted?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in some regions, Apple Pay and Google Pay. All payments are securely processed with industry-standard encryption to protect your financial information.",
        },
        {
          id: "ticket-refunds",
          question: "Can I get a refund for my tickets?",
          answer:
            'Refund policies are set by event organizers and vary from event to event. You can find the specific refund policy for each event on the event details page. Generally, most events allow refunds up to 7 days before the event date. If you need to request a refund, go to your tickets in your account dashboard and select the "Request Refund" option.',
        },
        {
          id: "ticket-transfer",
          question: "Can I transfer my ticket to someone else?",
          answer:
            'Yes, in most cases you can transfer your ticket to someone else. Go to "My Tickets" in your account dashboard, select the ticket you want to transfer, and click "Transfer Ticket". You\'ll need to enter the recipient\'s email address. They\'ll receive an email with instructions to claim the ticket.',
        },
      ],
    },
    {
      id: "organizers",
      title: "For Event Organizers",
      faqs: [
        {
          id: "create-event",
          question: "How do I create and list an event?",
          answer:
            'To create an event, you need an organizer account. Once logged in, go to your dashboard and click "Create Event". Fill out the event details form including title, description, location, date, time, ticket information, and upload an event image. After review, your event will be listed on our platform.',
        },
        {
          id: "organizer-fees",
          question: "What fees do organizers pay?",
          answer:
            "Organizers pay a 5% service fee on the ticket price plus a small processing fee per transaction. These fees cover platform maintenance, payment processing, customer support, and marketing services. You can view the detailed fee structure in your organizer dashboard.",
        },
        {
          id: "payment-processing",
          question: "When and how do I receive payment for ticket sales?",
          answer:
            "Payments are processed after the event concludes to allow for any refunds or cancellations. Funds are typically transferred to your designated bank account within 5-7 business days after the event date. For high-volume organizers, we offer an option for bi-weekly payouts, which can be requested through your account settings.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Settings",
      faqs: [
        {
          id: "change-password",
          question: "How do I change my password?",
          answer:
            'To change your password, log in to your account and go to "Account Settings". Under the "Security" section, click "Change Password". You\'ll need to enter your current password and then your new password twice to confirm the change.',
        },
        {
          id: "update-profile",
          question: "How do I update my profile information?",
          answer:
            'You can update your profile information by logging in and going to "Account Settings". From there, you can edit your name, email, phone number, profile picture, and other personal information. Don\'t forget to click "Save Changes" when you\'re done.',
        },
        {
          id: "delete-account",
          question: "How do I delete my account?",
          answer:
            'We\'re sorry to see you go! To delete your account, go to "Account Settings" and scroll to the bottom where you\'ll find "Delete Account". Click this button and follow the confirmation steps. Please note that account deletion is permanent and will remove all your data including ticket purchase history.',
        },
      ],
    },
    {
      id: "support",
      title: "Support & Help",
      faqs: [
        {
          id: "contact-support",
          question: "How do I contact customer support?",
          answer:
            "You can contact our customer support team through the Contact page on our website. Alternatively, you can email us directly at support@eventease.com. Our support team is available 7 days a week from 9am to 6pm EST. For urgent matters, please use the live chat feature available on the bottom right of every page when you're logged in.",
        },
        {
          id: "report-issue",
          question: "How do I report an issue with an event or ticket?",
          answer:
            'If you encounter an issue with an event or ticket, go to "My Tickets" in your account dashboard, select the relevant ticket, and click "Report an Issue". Describe the problem in detail, and our support team will reach out to assist you within 24 hours.',
        },
      ],
    },
  ];

  // Filter FAQs based on search term
  const filterFAQs = () => {
    if (!searchTerm.trim()) return faqCategories;

    const filteredCategories = faqCategories
      .map((category) => {
        const filteredFaqs = category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          ...category,
          faqs: filteredFaqs,
        };
      })
      .filter((category) => category.faqs.length > 0);

    return filteredCategories;
  };

  const filteredCategories = filterFAQs();

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={12} className="text-center">
          <h1 className="display-4 mb-4">Frequently Asked Questions</h1>
          <p className="lead">
            Find answers to common questions about EventEase, bookings, and
            more.
          </p>
        </Col>
      </Row>

      <Row className="mb-5 justify-content-center">
        <Col md={8}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search FAQs"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                <span>&#x2715;</span> {/* Unicode X character */}
              </Button>
            )}
            <Button variant="primary">
              <span>&#x1F50D;</span> {/* Unicode magnifying glass */}
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {filteredCategories.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="py-5">
              <i className="fa fa-search fa-3x text-muted mb-3"></i>
              <h3>No FAQs found matching "{searchTerm}"</h3>
              <p className="text-muted">
                Try a different search term or browse all categories.
              </p>
              <Button
                variant="outline-primary"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        filteredCategories.map((category) => (
          <Row className="mb-4" key={category.id}>
            <Col lg={12}>
              <h2 className="mb-3">{category.title}</h2>
              <Accordion>
                {category.faqs.map((faq, index) => (
                  <Accordion.Item eventKey={faq.id} key={faq.id}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        ))
      )}

      <Row className="mt-5 text-center">
        <Col lg={12}>
          <div className="py-4 bg-light rounded">
            <h3>Still have questions?</h3>
            <p className="mb-4">
              Our team is here to help you with any questions you might have.
            </p>
            <a href="/contact" className="btn btn-primary">
              Contact Us
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FAQPage;

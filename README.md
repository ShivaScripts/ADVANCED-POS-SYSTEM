# Advanced POS System (Shivam-POS)

An advanced Point of Sale (POS) system built with Spring Boot, designed to handle sales, inventory management, and billing with integrated payment gateways.

## 🚀 Features
* **Product Management:** Inventory tracking and CRUD operations.
* **Sales & Billing:** Real-time billing interface.
* **Payment Integration:** Razorpay and Stripe support.
* **Email Notifications:** Automated receipts via SMTP.
* **Security:** JWT Authentication and secure password reset.

## 🛠️ Tech Stack
* **Backend:** Java, Spring Boot, Hibernate
* **Database:** MySQL
* **Frontend:** React / Vite

## ⚙️ Configuration
This project uses **Environment Variables** for security.
Do not hardcode secrets in `application.properties`. Set these variables in your OS or IDE:

- `DB_USERNAME` / `DB_PASSWORD`
- `MAIL_USERNAME` / `MAIL_PASSWORD`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `STRIPE_API_KEY`

## 📦 Installation
1. Clone the repo.
2. Configure MySQL database `pos_temp`.
3. Run `mvn spring-boot:run`.

# Balsalameh Website Development Specifications & Technical Scope

## 1. General Setup & Frontend
* **Website Language:** 100% English Interface.
* **Texts:** You will be provided with all English texts ready for copy and pasting.
* **Performance & Speed:** Fast Loading & Light Assets to work with high efficiency on public Wi-Fi networks in airports.

## 2. Checkout Form
* **Only One Service:** The website contains only one product/service (Balsalameh Membership).
* **Required Fields:**
  * Full Name (as on Passport)
  * Email Address
  * Confirm Email Address
* **Prohibited Fields:** Do not include a phone number field (No Phone Number Field).

## 3. Checkboxes & Disclaimers
* Include mandatory checkboxes before completing the payment:
  * I agree to the Terms and Conditions and Fair Usage Policy.
  * I confirm that my data is protected under strict privacy guidelines.

## 4. Payment Gateway & Integration (MEPS Integration & Direct Webhooks)
* **Full Compliance with MEPS Guide:** Strictly adhere to all steps and phases mentioned in the official MEPS Integration Manual / API Docs to successfully link and fully activate the payment gateway within the website.
* **Activate Automated Notifications (Webhooks / IPN):** Set up and activate direct payment response notifications from MEPS as soon as any transaction is successful.
* **No External Licenses:** Rely entirely on the tools and software available and listed within the official MEPS guide without the need to purchase any external paid licenses or plugins.

## 5. Automated Proof of Membership & Email
* Immediately upon successful payment, an automated email is generated and sent to the buyer containing Proof of Membership, which includes:
  * A welcome message and confirmation of joining the Balsalameh membership.
  * Full Name as on Passport.
  * Unique Membership ID.
  * Membership expiry date: Month and year only without mentioning the day (e.g., Expiry: October 2027).
* **No Barcode:** There is no need to place a Barcode or QR Code inside the proof of membership for validation, as validation relies on visual matching of the name and membership number.

## 6. Admin Dashboard & Data Storage
* Automatically save and store only the following data in the database and Admin Panel for each new subscriber:
  1. Full Name
  2. Email Address
  3. Unique Membership ID
  4. Expiry Month & Year

## 7. Website QR Code Generation
* Create and provide us with a high-resolution QR Code that directs straight to the website link.
* When the QR Code is scanned via a mobile phone, it automatically transfers the user to the website page in the browser without the need to manually type the website link.

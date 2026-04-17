CabCompare: Real-Time Multi-Platform Ride Fare Comparison System

CabCompare is a lightweight, responsive web application designed to simplify urban mobility in India. It aggregates and compares real-time fare estimates from major ride-hailing providers—Uber, Ola, and Rapido—across various vehicle categories including Cabs, Auto-rickshaws, and Bike-taxis.

🚀 Features

•
Multi-Modal Comparison: Compare fares for Bikes, Autos, and Cabs in a single view.

•
Real-Time Geocoding: Intelligent location search with auto-completion powered by Geoapify.

•
Dynamic Fare Calculation: Simulated pricing engine that accounts for base fares, distance, time, and peak-hour surge factors.

•
Cheapest Ride Highlighting: Automatically identifies and highlights the most cost-effective option for your route.

•
Direct Booking Links: Seamlessly redirect to the provider's platform to complete your booking.

•
User Authentication: Secure local-storage based signup and login system.

•
Responsive Design: Optimized for both desktop and mobile browsers using Tailwind CSS.

🛠️ Technology Stack

•
Frontend: React.js, Vite, TypeScript

•
Styling: Tailwind CSS

•
APIs:

•
Geoapify Geocoding API (Location Search)

•
Geoapify Routing API (Distance & Time Calculation)



•
State Management: React Hooks & Local Storage

•
Icons: Lucide React

📋 Prerequisites

Before you begin, ensure you have the following installed:

•
Node.js (v16.0.0 or higher)

•
npm or pnpm

🔧 Installation & Setup

1.
Clone the Repository:

Bash


git clone https://github.com/your-username/cab-compare.git
cd cab-compare





2.
Install Dependencies:

Bash


npm install





3.
Environment Variables:
Create a .env file in the root directory and add your Geoapify API key:

Plain Text


VITE_GEOAPIFY_API_KEY=your_api_key_here





4.
Run the Development Server:

Bash


npm run dev



The application will be available at http://localhost:5173.



📖 Usage

1.
Sign Up / Login: Create an account or log in to access the dashboard.

2.
Enter Locations: Type your pickup and drop-off points. Select from the suggested addresses.

3.
Compare: Click "Compare Prices" to see a ranked list of available rides.

4.
Book: Click on the "Book Now" button of your preferred ride to be redirected to the provider's site.

🧮 Fare Calculation Logic

The estimated fare is calculated using the following formula:
Fare = (Base Fare + (Distance * Rate/Km ) + (Time * Rate/Min) + Booking Fee) * Surge Factor

Surge factors are simulated based on the time of day (Peak: 8-10 AM, 5-8 PM).

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



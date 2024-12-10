# Travel Routes

A modern web application for planning and visualizing travel routes on an interactive map. This application helps users create, manage, and visualize their travel itineraries with an intuitive interface.

## Features

- 🗺️ Interactive map visualization
- 🔍 Search functionality for places
- 📍 Place listing and management
- 🛣️ Travel route creation and visualization
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Built with Next.js for optimal performance

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Map Services Integration
- Modern JavaScript (ES6+)
- Custom Hooks for Map Operations
- SVG Icons for Enhanced UI

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TravelRoutes.git
cd TravelRoutes
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
app/
├── components/         # React components
│   ├── Map.js         # Map visualization component
│   ├── PlacesList.js  # Places management
│   ├── SearchBar.js   # Search functionality
│   └── TravelRoutes.js# Route management
├── hooks/             # Custom React hooks
│   └── useMapOperations.js
├── utils/             # Utility functions
│   └── mapServices.js
└── ...
```

## Usage

1. Use the search bar to find places you want to visit
2. Add places to your route list
3. Visualize your travel route on the interactive map
4. Modify and optimize your route as needed

## Development

The application uses Next.js's app router and follows modern React practices. To modify the application:

- Edit `app/page.js` for the main page layout
- Modify components in the `app/components` directory
- Update map operations in `app/hooks/useMapOperations.js`
- Add new utility functions in `app/utils`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

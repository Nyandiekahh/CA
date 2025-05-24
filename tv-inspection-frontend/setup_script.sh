#!/bin/bash

echo "🚀 Setting up TV Inspection Frontend..."

# Create React App (if not already created)
if [ ! -d "tv-inspection-frontend" ]; then
    echo "📦 Creating React App..."
    npx create-react-app tv-inspection-frontend
fi

cd tv-inspection-frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install axios react-router-dom lucide-react react-hook-form @hookform/resolvers yup date-fns

# Install Tailwind CSS
echo "🎨 Installing Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Remove default files
echo "🧹 Cleaning up default files..."
rm -f src/App.css src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/contexts

# Create all component files
echo "📝 Creating component files..."

# UI Components
touch src/components/ui/Button.jsx
touch src/components/ui/Input.jsx
touch src/components/ui/Select.jsx
touch src/components/ui/Textarea.jsx
touch src/components/ui/Card.jsx
touch src/components/ui/LoadingSpinner.jsx

# Layout Components
touch src/components/layout/Header.jsx
touch src/components/layout/Sidebar.jsx
touch src/components/layout/Layout.jsx

# Form Components
touch src/components/forms/InspectionForm.jsx
touch src/components/forms/FormSection.jsx
touch src/components/forms/AdministrativeInfoForm.jsx
touch src/components/forms/TowerInfoForm.jsx
touch src/components/forms/TransmitterInfoForm.jsx
touch src/components/forms/FilterInfoForm.jsx
touch src/components/forms/AntennaSystemForm.jsx
touch src/components/forms/StudioLinkForm.jsx
touch src/components/forms/OtherInfoForm.jsx

# Pages
touch src/pages/Dashboard.jsx
touch src/pages/AddInspection.jsx
touch src/pages/EditInspection.jsx
touch src/pages/InspectionList.jsx
touch src/pages/Login.jsx
touch src/pages/Register.jsx

# Services
touch src/services/api.js
touch src/services/auth.js

# Utils
touch src/utils/constants.js
touch src/utils/formUtils.js
touch src/utils/validation.js

# Hooks
touch src/hooks/useAuth.js
touch src/hooks/useApi.js

# Contexts
touch src/contexts/AuthContext.jsx

# Create environment file
touch .env.local

echo "✅ Project structure created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the provided code into each respective file"
echo "2. Update the .env.local file with your backend URL"
echo "3. Run 'npm start' to start the development server"
echo ""
echo "📁 File structure:"
echo "├── src/"
echo "│   ├── components/"
echo "│   │   ├── forms/       # Form components"
echo "│   │   ├── layout/      # Layout components"
echo "│   │   └── ui/          # UI components"
echo "│   ├── pages/           # Page components"
echo "│   ├── services/        # API services"
echo "│   ├── utils/           # Utility functions"
echo "│   ├── hooks/           # Custom hooks"
echo "│   └── contexts/        # React contexts"
echo "├── .env.local           # Environment variables"
echo "└── tailwind.config.js   # Tailwind configuration"
echo ""
echo "🔧 Don't forget to:"
echo "• Update your Django CORS settings to allow the frontend origin"
echo "• Configure your Django settings for production deployment"
echo "• Test the API endpoints with your frontend"
echo ""
echo "🎉 Setup complete! Ready for development."
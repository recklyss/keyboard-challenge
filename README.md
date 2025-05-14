# Keyboard-Only Challenge

A single-page React app designed to test and demonstrate accessible, keyboard-only navigation and form completion. Built with React, TypeScript, and Vite.

## Project Overview

This project is an accessibility challenge where users must complete a multi-field form using only the keyboard. The app demonstrates best practices for keyboard navigation, focus management, accessible form validation, and color contrast, using the Thoughtworks color palette.

## Accessibility Goals
- **All interactions are possible with keyboard only** (Tab, Shift+Tab, Enter, Space, Arrow keys)
- **Accessible modal dialog** with focus trap and ARIA roles
- **Native HTML form elements** for best accessibility
- **Visible focus indicators** for all interactive elements
- **Color contrast** meets WCAG 2 AA standards
- **ARIA live regions** for error and status messages

## Main Features
- **Single, multi-field form** inside a modal dialog
- **Fields:** Name, Email, Age, Country, State, City (all with validation)
- **Native `<select>` dropdowns** for country, state, city
- **Custom slider widget** for satisfaction (0-100), keyboard accessible
- **Confetti animation** on successful submission
- **Responsive, modern UI** using the Thoughtworks color palette

## Keyboard Navigation
- **Tab / Shift+Tab:** Move between fields and buttons
- **Enter / Space:** Activate buttons, open modal, submit form
- **Arrow keys:** Adjust slider value
- **Esc:** Close modal (returns focus to start button)
- **Form validation:** Errors are announced and focus moves to the first error

## Thoughtworks Color Palette Used
- **Mist gray:** #EDF1F3
- **Onyx black:** #000000
- **Flamingo pink:** #F2617A
- **Wave blue:** #003D4F
- **Turmeric yellow:** #CC850A
- **Jade green:** #6B9E78
- **Sapphire blue:** #47A1AD
- **Amethyst purple:** #634F7D

## Running the Project

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## License
MIT

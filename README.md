# CoreNode Hosting  
## Overview  
CoreNode Hosting is a modern, responsive web application for a game and voice server hosting company. Built with Vite, React, TypeScript, Tailwind CSS and shadcn/ui components, this project provides a polished foundation for marketing and selling hosting services for Minecraft, game servers, voice servers, web hosting and VPS & dedicated servers.  
## Features  
- **Modern landing page:** Clean hero section with call‑to‑action for easy ordering.  
- **Service pages:** Individual pages for Minecraft, Game Servers, Voice Servers, Web Hosting, and VPS & Dedicated with configurable pricing tiers.  
- **Dynamic order form:** A dedicated order page (e.g. `/order`) that lets customers choose server type, tier, RAM, add‑ons and game selector.  
- **Responsive navigation:** Mobile‑friendly navigation with tabs to quickly switch between services and the order page.  
- **TypeScript & ESLint:** Strict typing and linting rules ensure maintainable, high‑quality code.  
- **Tailwind configuration:** Preconfigured Tailwind with shadcn/ui for consistent styling and theming.  
- **Ready for SEO:** Includes basic SEO meta tags structure for improved search visibility (see open PR for details).  
## Getting Started  
To run the project locally using your preferred IDE:  
```sh  
# Step 1: Clone the repository  
git clone <YOUR_GIT_URL>  
cd corenode-nexus-hosting  
# Step 2: Install dependencies  
npm install  
# Step 3: Start the development server with hot reloading  
npm run dev  
```  
You’ll need Node.js and npm installed (we recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node versions).  
## Contributing  
We welcome contributions! Here’s how to get started:  
- Fork the repository and create a new branch from `main`.  
- Make your changes in your branch.  
- Ensure ESLint passes (`npm run lint`) and the site builds (`npm run build`).  
- Commit your changes with a clear message and open a pull request.  
If you’re adding a new feature, please include a short description in the PR explaining what it does and any relevant testing steps.  
## Roadmap & Ideas  
Here are some ideas to take this project to great heights:  
- Implement a fully functional checkout flow that integrates with a payment gateway to accept orders.  
- Add pricing tables and plan comparisons for each service page.  
- Integrate a CMS (e.g. Strapi or Sanity) for managing content (blog posts, FAQs, knowledge base) without code changes.  
- Enhance SEO with dynamic metadata and structured data for each page.  
- Add a contact form and live chat widget to improve customer support.  
- Include internationalization (i18n) support so the site can reach a global audience.  
Feel free to suggest additional improvements or open issues with your ideas!  
---  
*This project is maintained by Omar. For questions or support, please open an issue or reach out via the repository.*

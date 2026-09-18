# Smart Email Generator 

Build a modern, responsive frontend-only SaaS web app called AI Workplace Productivity Assistant for professionals.



Design: Deep blue + light gray, clean professional SaaS dashboard, responsive desktop/mobile layout, sidebar navigation, cards, modern typography, and intuitive controls.



Core AI Features



1. Smart Email Generator



User enters recipient, purpose, context, and key points.



Select tone: Formal, Friendly, or Persuasive.



Generate a unique AI-written professional email based on the user's input.



Results must NOT be generic or hardcoded.



Allow editing, copying, regenerating, and clearing.





2. AI Task Planner



User enters their actual tasks, deadlines, priorities, and available time.



Choose Daily or Weekly plan.



AI analyzes the provided information and generates a personalized schedule and task priorities.



Results must be dynamically AI-generated from the user's inputs, not predefined examples.



Allow users to edit and regenerate the plan.





3. AI URL Summarizer



User pastes a website/article URL.



AI should analyze the provided URL and generate:



Summary



Key Insights



Actionable Recommendations





Results must be based on the actual URL content, not generic placeholder text.



Include loading and error states.





4. AI Workplace Chatbot



Interactive AI chat interface.



Every response must be AI-generated based on the user's message and conversation context.



No hardcoded chatbot responses.



Include suggested workplace prompts as optional starting points.





Dashboard



Create a simple dashboard with:



Welcome section



Quick access to the four AI tools



Recent activity UI only if it can be handled without storing data



No fake productivity statistics or generic AI results.





Important Technical Requirements



Frontend only.



No backend, database, authentication, or permanent data storage.



Do not store user prompts, URLs, emails, schedules, or conversations.



Connect the AI features to an appropriate AI API/client-side integration if supported by Lovable.



Do not use mock, hardcoded, placeholder, or generic AI responses for the main features.



If an AI/API connection is unavailable, clearly show an error/setup message rather than pretending the response was AI-generated.



AI outputs must be editable.



Keep the application lightweight because I have only 5 Lovable credits.



Build only the essential features and avoid unnecessary pages/components.





Responsible AI Disclaimer



Display:



> AI-generated content may contain errors. Review and verify important information before using it for workplace decisions or communications.







Priority: Make the four core tools genuinely AI-powered, personalized to user input, simple to use, and visually polished.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee0e73af-479c-43e6-8131-6adbf2a7338a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

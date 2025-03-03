## Overview

This project provides an AI-powered recipe recommendation system

## Features

-   **Step 1:** AI selects the best recipe from a given list.
-   **Step 2:** AI explains why the recipe was chosen.
-   Uses OpenAI's GPT-4-turbo for decision-making.
-   Follows a sequential processing (chain-based) pattern.

## Installation

### Prerequisites

-   Node.js (>= 16.x) - https://nodejs.org/en
-   An OpenAI API key - https://platform.openai.com/login
-   A SPOONACULAR API KEY - https://spoonacular.com/food-api

### Steps

1.  Clone the repository:

    ```bash
    git clone git@github.com:gondar00/move-tech.git
    cd move-tech
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:

    ```bash
    echo "OPENAI_API_KEY=your-api-key" >> .env
    echo "SPOONACULAR_API_KEY=your-api-key" >> .env
    ```

4.  Run the project:

    ```bash
    npm run dev
    ```

### Resources
- https://www.anthropic.com/research/building-effective-agents

### Futurework
- Lack of observability: Our model calls must be reliable, with the ability to maintain history across timeouts, retries, and multiple calls. Additionally, we need to manage flow control effectively while continuously iterating on aspects like prompt design and the RAG (Retrieval-Augmented Generation) approach. This requires careful orchestration, and a tool like inngest would excel here.
- Proper logging - API logs can be made more verbose 
- Micro services - We aplit the application into three services like frontend, API service and AI service such that each service handles its own responsibilities
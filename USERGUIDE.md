# Welcome Guide

English Video about docker compose: https://youtu.be/BuEJu3t7J-k
Hi, this is a short starter guide to get this project up and running:

# Frontend

Go to the frontend folder and run:

    npm install or pnpm install

to install the dependencies.
Then: 

    npm run dev or pnpm dev
  to start the development server.

## Backend

Go to the backend folder and run:

    python3 -m venv .venv
   then 

       . .venv/bin/activate

  then 

      pip install -r requirements.txt
   and finally

       flask run

  

After installing all dependencies and running both the frontend and the backend you can go to 
http://localhost:9000/

## Swagger UI Docs

You can go to http://localhost:5000/api/swagger-ui for a full documentation in the [backend api](https://imgur.com/a/EzqJ1uJ)

## Environment variables

In the backend folder you need to provide a .flaskenv file with the contents:

    FLASK_APP=app/app
and .env folder with :
# DATABASE_URL=postgresql

GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account/credentials.json"

JWT_SECRET_KEY="your_secret_jwt_string"

DATABASE_URL=your_database_URI


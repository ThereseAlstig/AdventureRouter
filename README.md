[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GF-s5kgK)


### Tech Stack

Backend mapp: server
Backend: Node.js, TypeScript
npm run start
Frontend mapp: client
Frontend: React, TypeScript
npm run dev


### Hosting:

Backend: Render

Frontend: Vercel

### Databas:

Lokal: MySQL med PHPMyAdmin

Produktion: MySQL via Railway



### Förutsättningar för utveckling

Nödvändiga program och tillägg

Node.js (Ladda ner från Node.js)

MySQL med PHPMyAdmin eller annan SQL-klient (t.ex. MySQL Workbench)

Texteditor/IDE: Visual Studio Code med tilläggen scss och TypeScript

Git för versionshantering

Railway CLI (valfritt) för att hantera den distribuerade databasen

### För Admnin Inloggning:

Användarnamn: therese.alstig@gmail.com

Lösenord: password123

Adminsidor finns som ett kugghjul om man är inloggad i footern, där kan man lägga till produktter, samt söäka upp en produkt via namnet och ändr aom det  finns i lager eller inte

### Frontend .env fil 
DATABASE_URL=Din lokala MySQL-databasanslutningssträng
RAILWAY_DATABASE_URL=Din Railway-produktionsdatabasanslutningssträng
SECRET_KEY=En slumpmässigt genererad säkerhetsnyckel
ADMIN_EMAIL=therese.alstig@gmail.com
GOOGLE_CLIENT_ID=Din Google Client ID (skapas i Google Cloud Console)
GOOGLE_CLIENT_SECRET=Din Google Client Secret (skapas i Google Cloud Console)
PORT=Porten där din backend körs (standard: 3000)
BACKEND_URL=URL till din backend (t.ex. http://localhost:3000)
DB_HOST=Värdnamn för databasen (standard: localhost)
DB_PORT=Port för databasen (standard: 3306)
DB_USER=Användarnamn för databasen (standard: root)
DB_PASS=Lösenord för databasen
DB_NAME=Namnet på databasen
GOOGLE_CALLBACK_URL=URL för Google OAuth Callback
GOOGLE_REDIRECT_URL=URL för Google OAuth Redirect
GITHUB_CALLBACK_URL=URL för GitHub OAuth Callback
GITHUB_CLIENT_ID=Din GitHub Client ID (skapas i GitHub Developer Settings)
GITHUB_CLIENT_SECRET=Din GitHub Client Secret (skapas i GitHub Developer Settings)
GITHUB_REDIRECT_URL=URL för GitHub OAuth Redirect
NODE_ENV=Miljö (development eller production)
STRIPE_KEY=Din Stripe API-nyckel (skapas i Stripe Dashboard)
MAILGUN_API_KEY=Din Mailgun API-nyckel (skapas i Mailgun Dashboard)
MAILGUN_DOMAIN=Din Mailgun-domän (skapas i Mailgun Dashboard)

### Backend .env fil

JWT_SECRET=Din slumpmässigt genererade JWT-hemlighet
GOOGLE_CLIENT_ID=Din Google Client ID (skapas i Google Cloud Console)
GOOGLE_CLIENT_SECRET=Din Google Client Secret (skapas i Google Cloud Console)
PORT=Porten där din backend körs (standard: 3000)
BACKEND_URL=URL till din backend (t.ex. http://localhost:3000)
DB_HOST=Värdnamn för databasen (standard: localhost)
DB_PORT=Port för databasen (standard: 3306)
DB_USER=Användarnamn för databasen (standard: root)
DB_PASS=Lösenord för databasen
DB_NAME=Namnet på databasen
GOOGLE_CALLBACK_URL=URL för Google OAuth Callback
GOOGLE_REDIRECT_URL=URL för Google OAuth Redirect
GITHUB_CALLBACK_URL=URL för GitHub OAuth Callback
GITHUB_CLIENT_ID=Din GitHub Client ID (skapas i GitHub Developer Settings)
GITHUB_CLIENT_SECRET=Din GitHub Client Secret (skapas i GitHub Developer Settings)
GITHUB_REDIRECT_URL=URL för GitHub OAuth Redirect
NODE_ENV=Miljö (development eller production)
STRIPE_KEY=Din Stripe API-nyckel (skapas i Stripe Dashboard)
MAILGUN_API_KEY=Din Mailgun API-nyckel (skapas i Mailgun Dashboard)
MAILGUN_DOMAIN=Din Mailgun-domän (skapas i Mailgun Dashboard)



### Återställ databas från SQL-dump

1. Öppna PHPMyAdmin.
2. Välj din databas (eller skapa en ny om den inte finns).
3. Klicka på fliken **Importera**.
4. Ladda upp filen `server/db_data/AdventureRouter.sql`.
5. Klicka på **OK** för att importera databasen.
# Refresh — Vending Machine Frontend

React 18, TypeScript, and Vite interface for a local vending machine demo.
Customers add virtual credit and buy chilled drinks; suppliers manage inventory.
The [backend repository](https://github.com/huseyinilican/vending-machine-backend)
provides the Java API and local MongoDB configuration.

## Clone and run the complete app

The app uses two repositories. The backend repository is private: your GitHub
account needs collaborator access before you can clone it. Authenticate Git
with that account; no legacy database account or credentials are needed.

### Prerequisites

- Git and access to both repositories.
- JDK 17, with `JAVA_HOME` pointing to it. Verify with `java -version`.
- Node.js 24 and npm. Verify with `node --version` and `npm --version`.
- Docker Desktop running with Linux containers and Docker Compose available.
  Verify with `docker info` and `docker compose version`.

These versions were verified on Windows. Maven is supplied by the backend's
wrapper; a global Maven installation is unnecessary. First startup needs
internet access to download dependencies and the MongoDB image.

### 1. Clone into sibling directories

Run these commands in the directory where you keep your projects:

```powershell
git clone https://github.com/huseyinilican/vending-machine-backend.git
git clone https://github.com/huseyinilican/vending-machine-frontend.git
```

### 2. Start MongoDB and the backend

In a terminal from the parent directory:

```powershell
cd vending-machine-backend
docker compose up -d --wait
.\mvnw.cmd spring-boot:run
```

Keep this terminal running. Wait for Spring Boot to report that Tomcat has
started on port 8080. Open
[the products endpoint](http://localhost:8080/api/products): a fresh database
should return four sample drinks. MongoDB listens on `127.0.0.1:27017`, stores
data in a Docker volume, and creates products and machine settings only when
that volume is first initialized.

On macOS/Linux, use `./mvnw spring-boot:run` instead of `.\mvnw.cmd`.
If the wrapper is not executable, run `sh mvnw spring-boot:run`.

### 3. Start the frontend

Open a second terminal from the same parent directory:

```powershell
cd vending-machine-frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Open [the app](http://127.0.0.1:5173/). Use the URL Vite prints if port 5173
is already occupied. Add virtual credit, buy a drink, and check the returned
change. The supplier panel lets you edit prices and add stock. No real
payment is involved.

### Stop and restart

Press Ctrl+C in each application terminal. From `vending-machine-backend`,
run `docker compose down` to stop MongoDB while preserving its data.
To restart, repeat steps 2 and 3; dependency installation is needed only after
the frontend lockfile changes or when `node_modules` is absent.

To intentionally erase all local database data, run
`docker compose down --volumes` from the backend directory, then start it again.
This also reruns the initial seed. Editing the seed script alone does not
change an existing database.

## Frontend configuration

The API defaults to `http://localhost:8080/api`. For a different development
backend, create an untracked `.env.local` in this repository:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

Restart Vite after changing environment variables. Do not place secrets in
`VITE_*` variables: their values are exposed to the browser.
Illustrations are local SVGs; optional Google Fonts fall back to system fonts
if unavailable.

## Build and verification

Run from this repository:

```powershell
npm run lint
npm run build
npm run preview
```

Lint checks TypeScript/React conventions; build type-checks and creates
`dist/`. Preview serves that production build at the URL printed in the
terminal and still needs the backend. There is currently no automated frontend
test suite. Check credit insertion, purchase/change, activity, and supplier
inventory after changes.

## Troubleshooting

- **Backend clone denied:** confirm your account has access to the private
  repository and Git is authenticated as that account.
- **Docker daemon unavailable:** start Docker Desktop and wait for its Linux
  engine, then rerun `docker compose up -d --wait`.
- **Port 27017 or 8080 already in use:** stop the conflicting local service
  before starting this project's database or backend.
- **Java compilation fails:** check `JAVA_HOME` and `.\mvnw.cmd -version`;
  this project requires Java 17. A different Java on PATH can be misleading.
- **Drinks do not load:** verify the products endpoint first and inspect both
  terminals. If changing the API URL, restart Vite.
- **No sample data:** initialization runs only on an empty Docker volume.
  Use the explicit reset command above only if existing local data is disposable.

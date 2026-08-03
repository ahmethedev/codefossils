

<p align="center">
  <img src="frontend/public/codefossilslogo.png" alt="CodeFossils" width="100" />
</p>
<h1 align="center">CodeFossils</h1>
<p align="center">Descubre repositorios abandonados de GitHub con ideas brillantes que valen la pena revivir.</p>

---

Desenterra proyectos olvidados de GitHub: repositorios con grandes ideas que quedaron abandonados. Explora, busca y encuentra la inspiración para tu próximo proyecto personal.

## Stack

- **Backend:** Go + PostgreSQL
- **Frontend:** React + Vite
- **Datos:** GitHub Search API (autenticada)
- **Despliegue:** Docker + Caddy

## Inicio Rápido

### Requisitos previos

- Go 1.21+
- Node.js 18+
- PostgreSQL 16+
- Token de acceso personal de GitHub ([crear uno](https://github.com/settings/tokens) — no se necesitan permisos)

### 1. Base de datos

```bash
# Opción A: Docker
docker compose up -d

# Opción B: PostgreSQL local
createdb codefossils
```

### 2. Entorno

```bash
cp .env.example .env
# Edita .env con tu token de GitHub y la URL de la base de datos
```

### 3. Backend

```bash
cd backend
go run ./cmd/server
```

El servidor realiza la migración automática de la base de datos y obtiene los repositorios iniciales en la primera ejecución.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Producción (Docker)

```bash
cp .env.example .env
# Establece GITHUB_TOKEN y POSTGRES_PASSWORD
docker compose up -d --build
```

El frontend se ejecuta en el puerto 4000 por defecto.

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/repos` | Lista repositorios (admite `category`, `sort`, `search`, `page`, `per_page`) |
| `POST` | `/api/repos/refresh` | Inicia una nueva búsqueda en GitHub |
| `GET` | `/api/stats` | Conteo por categorías |

## Cómo Funciona

1. El backend busca en GitHub repositorios actualizados hace más de 2 años con más de 5 estrellas, utilizando 10 consultas de búsqueda seleccionadas
2. Cada repositorio recibe una **puntuación de idea** (0-100) basada en estrellas, forks, calidad de la descripción y temas
3. Los repositorios se categorizan (Web, Móvil, IA/ML, Herramientas de Desarrollo, Datos, Juegos) mediante coincidencia de palabras clave
4. Un programador en segundo plano actualiza los datos cada 6 horas
5. El frontend muestra todo con filtrado, ordenamiento y búsqueda

## Licencia

MIT

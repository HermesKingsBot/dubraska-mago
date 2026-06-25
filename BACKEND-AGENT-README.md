# OpenCode Backend Agent — Configuración

## Dos Instancias de OpenCode

| Agente | Directorio | Modelo | Propósito |
|--------|-----------|--------|-----------|
| **Frontend** | `~/.opencode/` | `opencode/mimo-v2.5-free` | React, Next.js, Tailwind, GSAP, UI/UX |
| **Backend** | `~/.opencode-backend/` | `opencode/deepseek-v4-flash-free` | Node, Express, PostgreSQL, Prisma, NestJS |

## Uso

### Frontend Agent
```bash
cd /opt/data/projects/dubraska-mago
bash run-frontend.sh "crear página de contacto"
```

### Backend Agent
```bash
cd /opt/data/projects/dubraska-mago
bash run-backend.sh "crear API REST de productos con Prisma"
```

## Modelos Gratuitos Disponibles

| Modelo | Velocidad | Mejor para |
|--------|-----------|------------|
| `opencode/deepseek-v4-flash-free` | ⚡ Rápido | Código, CRUD, quick edits |
| `opencode/mimo-v2.5-free` | 🐢 Medio | Coding tasks, component creation |
| `opencode/nemotron-3-ultra-free` | 🐢 Lento | Complex reasoning, architecture |
| `opencode/big-pickle` | ⚡ Rápido | General |
| `opencode/north-mini-code-free` | ⚡ Rápido | Code-focused |

## Skills del Backend Agent

| Skill | Descripción |
|-------|-------------|
| `express-api` | Express.js — routing, middleware, controllers, validation |
| `prisma-postgres` | Prisma ORM + PostgreSQL — schema, migrations, queries |
| `nestjs-backend` | NestJS — modules, controllers, services, guards, DTOs |
| `node-advanced` | Node.js avanzado — streams, clusters, worker threads |
| `deployment` | Docker, CI/CD, deploy configs |
| `debugging` | Debugging, testing, error handling |
| `web-security` | Security best practices, JWT, rate limiting |
| `nextjs` | Next.js backend features (API routes, server actions) |
| `github` | GitHub workflows, PR management |

## Estructura AGENT.md del Backend

El backend agent tiene su propio `AGENT.md` en `~/.opencode-backend/AGENT.md` que define:
- Su identidad como especialista backend
- El stack tecnológico (Express, PostgreSQL, Prisma, NestJS)
- El schema de base de datos completo
- Las reglas de código (sin semicolons, double quotes, etc.)
- La estructura de archivos del backend

## Cómo funciona

Cada instancia de OpenCode es independiente:
- **Config directory**: separada (`~/.opencode/` vs `~/.opencode-backend/`)
- **Skills**: cada agente tiene sus propias skills instaladas
- **AGENT.md**: cada agente tiene su propia personalidad y reglas
- **Modelo**: cada agente usa un modelo diferente optimizado para su dominio

# GitHub Actions Secrets Configuration

Para que la CI funcione correctamente, debes agregar estos secrets en tu repositorio de GitHub:

## Secrets Requeridos

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL (Neon) | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dubraska_mago?sslmode=require` |

## Cómo agregarlos

1. Ve a https://github.com/HermesKingsBot/dubraska-mago/settings/secrets/actions
2. Click en **New repository secret**
3. Agrega `DATABASE_URL` con el valor de tu conexión a Neon
4. (Opcional) Agrega `E2E_BASE_URL` con `https://dubraska-mago.vercel.app`

## Verificación

Una vez configurados, cada push a `main` o PR ejecutará automáticamente:
- Tests unitarios y de integración (Vitest)
- Tests E2E (Playwright)
- Verificación de build

## Nota

Los tests E2E requieren que la base de datos de producción esté accesible desde GitHub Actions.
Si prefieres no exponer la DB de producción, puedes usar una DB de testing separada o
marcar los tests E2E como skip en CI (modificar `.github/workflows/ci.yml`).

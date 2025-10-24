# 🚀 Cómo Publicar Tu Juego en 5 Pasos

## Para Hosting Gratis (Vercel - Más Fácil)

### Paso 1: Descargar el Juego
En Replit:
- Click derecho en la carpeta del proyecto
- Selecciona "Download" 
- Guarda el archivo ZIP

### Paso 2: Subir a GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta gratis
2. Click en "New repository" (nuevo repositorio)
3. Dale un nombre: `brainrot-race`
4. Click en "Create repository"
5. Sube tu código:
   - Extrae el ZIP en tu computadora
   - Arrastra los archivos a GitHub
   - O usa GitHub Desktop (más fácil)

### Paso 3: Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Sign Up" con tu cuenta de GitHub
3. Click en "Add New Project"
4. Selecciona tu repositorio `brainrot-race`
5. Click en "Deploy"

### Paso 4: ¡Espera 2 minutos!
Vercel construirá tu juego automáticamente.

### Paso 5: ¡Listo!
Tu juego estará disponible en:
`https://brainrot-race.vercel.app`

---

## Para Hosting con Node.js (Railway)

### Paso 1: Prepara GitHub (igual que arriba)

### Paso 2: Ve a Railway
1. [railway.app](https://railway.app)
2. Sign Up con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio

### Paso 3: Configura Variables
En Railway, agrega:
- `NODE_ENV` = `production`
- `SESSION_SECRET` = `cualquier_texto_largo_y_seguro_123456789`

### Paso 4: Deploy
Railway lo hace automático.

### Paso 5: ¡Listo!
Tu juego estará en:
`https://brainrot-race-production.up.railway.app`

---

## Agregar Dominio Propio (Opcional)

### Si usas Vercel:
1. En Vercel → Settings → Domains
2. Agrega tu dominio: `carreraloca.com`
3. Copia los DNS que te da Vercel
4. Ve a donde compraste tu dominio (GoDaddy, Namecheap, etc.)
5. Pega los DNS en la configuración
6. Espera 24 horas

### Comprar Dominio:
- [Namecheap.com](https://namecheap.com) - $8-12/año
- [Porkbun.com](https://porkbun.com) - $7-10/año
- [Google Domains](https://domains.google) - $12/año

---

## ⚡ Opción Más Rápida de Todas

### Publicar desde Replit (Con dominio de Replit):

1. Click en el botón "Publish" en Replit
2. Selecciona tipo de deployment (Autoscale recomendado)
3. ¡Listo! Tu juego estará en:
   `https://tu-proyecto.replit.app`

**Ventajas:**
- ✅ Súper rápido (1 click)
- ✅ Todo automático
- ✅ HTTPS incluido

**Desventajas:**
- ❌ Cuesta dinero ($$$)
- ❌ Necesitas suscripción de Replit

---

## 📋 Checklist

Antes de publicar, verifica:

- [ ] El juego funciona en Replit
- [ ] Los controles táctiles funcionan
- [ ] Las 3 carreras se completan
- [ ] Todo está en español
- [ ] Las imágenes se ven bien

## 🎯 Recomendación

Para publicar **GRATIS** y **FÁCIL**:
→ Usa **Vercel** (paso a paso arriba)

Para tener **base de datos** en el futuro:
→ Usa **Railway** (paso a paso arriba)

---

## 🆘 ¿Problemas?

Consulta los otros archivos:
- **README-DEPLOY.md** - Guía completa para principiantes
- **DEPLOYMENT.md** - Guía técnica avanzada

---

## ✨ ¡Tu juego estará online en menos de 10 minutos!

**El método más rápido:**
1. Sube a GitHub (5 minutos)
2. Conecta con Vercel (2 minutos)
3. ¡Espera que se construya! (2 minutos)
4. **¡LISTO!** 🎉

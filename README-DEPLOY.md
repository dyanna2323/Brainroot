# 🎮 Brainrot Race - Guía Rápida de Despliegue

## ¿Qué es esto?

**Brainrot Race** es un juego de carreras con obstáculos estilo Fall Guys para 2 jugadores en móvil/tablet. 
Todo el juego está en español y es perfecto para niños.

## 🚀 Tres Formas de Publicar

### 1️⃣ MÁS FÁCIL: Vercel o Netlify (Gratis)

**Perfecto para:** Comenzar rápido, gratis, sin complicaciones

1. Crea cuenta en [Vercel.com](https://vercel.com) o [Netlify.com](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configuración automática:
   - Build command: `npm run build`
   - Output directory: `dist`
4. ¡Listo! Tu juego estará en `tu-proyecto.vercel.app`

**Ventajas:** 
- ✅ Gratis para siempre
- ✅ HTTPS automático
- ✅ Súper rápido (CDN global)
- ✅ Dominio personalizado incluido

### 2️⃣ COMPLETO: Railway o Render (Gratis con límites)

**Perfecto para:** Si necesitas base de datos o funciones de servidor

1. Crea cuenta en [Railway.app](https://railway.app) o [Render.com](https://render.com)
2. Importa tu proyecto desde GitHub
3. Railway detecta automáticamente Node.js
4. Configura variables de entorno:
   - `NODE_ENV=production`
   - `SESSION_SECRET=tu_secreto_aqui`
5. Deploy automático

**Ventajas:**
- ✅ Gratis para empezar
- ✅ Incluye PostgreSQL gratis
- ✅ HTTPS automático
- ✅ Builds automáticos con cada cambio

### 3️⃣ AVANZADO: Tu Propio Servidor VPS

**Perfecto para:** Máximo control, sin límites

**Requiere conocimientos técnicos** - Ver `DEPLOYMENT.md` para instrucciones completas

## 📦 Preparar tu Proyecto

### Desde Replit:

**Opción A - Descargar ZIP:**
1. Click derecho en la carpeta del proyecto
2. "Download" → Se descarga todo como ZIP
3. Extrae el ZIP en tu computadora

**Opción B - Usar Git:**
```bash
# Obtén la URL de tu repo en Replit
git clone <URL_DE_TU_REPLIT>
cd brainrot-race
```

### En tu Computadora Local:

```bash
# Instalar dependencias
npm install

# Probar que funciona localmente
npm run dev
# Abre http://localhost:5000

# Construir para producción
npm run build

# Probar versión de producción
npm start
```

## 🌐 Dominio Personalizado

### Con Vercel/Netlify/Railway:
1. En el panel de control, ve a "Domains"
2. Agrega tu dominio (ej: `carreraloca.com`)
3. Copia los DNS que te dan
4. Ve a tu proveedor de dominios (GoDaddy, Namecheap, etc.)
5. Actualiza los DNS
6. Espera 24-48 horas

### Comprar Dominio:
- **Namecheap:** ~$10/año
- **Google Domains:** ~$12/año
- **Porkbun:** ~$8/año (más barato)

## ✅ Checklist Antes de Publicar

Asegúrate de que:

- [ ] El juego funciona en tu computadora localmente
- [ ] Los controles táctiles funcionan en móvil
- [ ] Las 3 carreras se completan sin errores
- [ ] Los 10 personajes se pueden seleccionar
- [ ] Todo el texto está en español
- [ ] Las imágenes y sonidos se cargan correctamente
- [ ] El juego funciona en tablets y móviles

## 💰 Costos

### Opción Gratuita (Recomendada para empezar):
- **Hosting:** $0 (Vercel/Netlify)
- **Dominio:** $0 (usa `tu-juego.vercel.app`)
- **SSL/HTTPS:** $0 (incluido)
- **Total:** **GRATIS** ✨

### Con Dominio Propio:
- **Hosting:** $0 (Vercel/Netlify)
- **Dominio:** $8-12/año
- **SSL/HTTPS:** $0 (incluido)
- **Total:** **~$10/año**

### Profesional:
- **Hosting:** $5-10/mes (VPS)
- **Dominio:** $10/año
- **Total:** **~$60-120/año**

## 🆘 Problemas Comunes

### "npm: command not found"
Necesitas instalar Node.js:
- Descarga desde [nodejs.org](https://nodejs.org)
- Instala versión 18 o superior

### "Build failed"
```bash
# Limpia e instala de nuevo
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Port 5000 already in use"
```bash
# Cambia el puerto en server/index.ts
const PORT = process.env.PORT || 3000;
```

### No funciona en móvil
- Asegúrate de probar en dispositivo real, no simulador
- Verifica que los controles táctiles estén activados
- Usa HTTPS (los servicios gratuitos lo incluyen)

## 📞 Siguiente Paso

1. **Elige tu método de hosting** (Recomiendo Vercel para empezar)
2. **Sigue los pasos de esa sección**
3. **¡Comparte tu juego con el mundo!** 🎉

---

## 📚 Documentación Completa

Para instrucciones técnicas detalladas, configuración de servidor propio, Nginx, PM2, etc., consulta:
- **DEPLOYMENT.md** - Guía técnica completa

## 🎮 ¡Disfruta tu Juego!

Tu juego está 100% listo para publicar. Solo elige dónde y síguelos pasos.

**¿Necesitas ayuda?** Revisa `DEPLOYMENT.md` para más detalles técnicos.

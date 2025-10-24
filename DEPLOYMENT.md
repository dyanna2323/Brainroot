# Guía de Publicación - Brainrot Race

## Para Descargar el Proyecto desde Replit

1. **Descargar todo el código:**
   - En Replit, ve a la pestaña "Files" (Archivos)
   - Haz clic derecho en la carpeta raíz del proyecto
   - Selecciona "Download" para descargar todo el proyecto como ZIP

2. **Usando Git (Alternativa):**
   ```bash
   git clone <URL_DE_TU_REPLIT>
   ```

## Preparar para Producción

### 1. Variables de Entorno

Crea un archivo `.env` en tu servidor con:

```
NODE_ENV=production
SESSION_SECRET=tu_secret_key_aqui_muy_segura
DATABASE_URL=tu_url_de_postgresql_si_usas_base_de_datos
PORT=5000
```

### 2. Construir el Proyecto

En tu servidor o máquina local, ejecuta:

```bash
# Instalar dependencias
npm install

# Construir la aplicación frontend
npm run build

# El resultado estará en la carpeta dist/
```

### 3. Archivos Necesarios para el Servidor

Tu servidor de hosting necesita:
- Todos los archivos del proyecto (código fuente)
- Node.js versión 18 o superior
- PostgreSQL (si decides usar base de datos en el futuro)

## Opciones de Hosting

### Opción A: Hosting Node.js Completo (Recomendado)

**Servicios compatibles:**
- Railway.app (Gratis para empezar)
- Render.com (Gratis con limitaciones)
- Fly.io (Gratis con limitaciones)
- DigitalOcean App Platform
- Heroku (De pago)
- AWS, Google Cloud, Azure

**Pasos generales:**

1. Sube tu código al servicio (generalmente con Git)
2. Configura las variables de entorno
3. El comando de inicio es: `npm start` o `npm run dev`
4. El servicio debe exponer el puerto 5000

### Opción B: Hosting Estático (Solo Frontend)

Si solo quieres el frontend sin backend (sin base de datos ni sesiones):

**Servicios compatibles:**
- Vercel (Gratis, muy fácil)
- Netlify (Gratis, muy fácil)
- Cloudflare Pages (Gratis)
- GitHub Pages (Gratis)

**Pasos:**

1. Ejecuta `npm run build`
2. Sube la carpeta `dist/` al servicio
3. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`

**⚠️ Limitación:** Sin backend, no tendrás sesiones ni base de datos PostgreSQL.

### Opción C: Tu Propio Servidor VPS

Si tienes tu propio servidor (VPS):

```bash
# En tu servidor
cd /var/www/brainrot-race
git clone <tu-repo>
npm install
npm run build

# Usar PM2 para mantener la app corriendo
npm install -g pm2
pm2 start server/index.ts --name brainrot-race
pm2 startup
pm2 save

# Configurar Nginx como proxy reverso
# (Ver sección de Nginx abajo)
```

## Configuración de Nginx (Si usas VPS)

Crea un archivo en `/etc/nginx/sites-available/brainrot-race`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Luego:
```bash
sudo ln -s /etc/nginx/sites-available/brainrot-race /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Dominio Personalizado

Para cualquier opción de hosting:

1. Compra un dominio (Namecheap, GoDaddy, Google Domains, etc.)
2. En la configuración DNS de tu dominio:
   - Tipo A: Apunta a la IP de tu servidor
   - O sigue las instrucciones específicas de tu servicio de hosting
3. Espera 24-48 horas para que se propague

## Certificado SSL (HTTPS)

- **Hosting automático (Vercel, Netlify, Railway):** SSL incluido gratis
- **VPS propio:** Usa Let's Encrypt con Certbot
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
  ```

## Verificación Final

Antes de publicar, verifica:

✅ El juego funciona en modo producción localmente
✅ Todas las variables de entorno están configuradas
✅ Los assets (imágenes, sonidos) se cargan correctamente
✅ El juego funciona en móviles y tablets
✅ Los controles táctiles responden bien
✅ Las 3 carreras funcionan sin errores

## Mantenimiento

- **Actualizaciones:** Sube nuevos cambios y ejecuta `npm run build` de nuevo
- **Logs:** Revisa los logs de tu servidor para detectar errores
- **Backups:** Haz copias de seguridad regular de tu código

## Costos Estimados

- **Gratis:** Vercel, Netlify, Render, Railway (con límites)
- **$5-10/mes:** VPS básico (DigitalOcean, Linode)
- **$7-10/mes:** Dominio personalizado
- **$0:** SSL (Let's Encrypt es gratis)

## Soporte

Si tienes problemas:
1. Revisa los logs de error de tu hosting
2. Verifica que Node.js versión 18+ esté instalado
3. Asegúrate que las dependencias se instalaron correctamente
4. Confirma que el puerto esté abierto y accesible

---

**¡Tu juego está listo para el mundo! 🎮🚀**

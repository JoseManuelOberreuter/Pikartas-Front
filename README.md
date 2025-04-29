# Demoliciones CRRB - Sitio Web

## Descripción
Sitio web profesional para Demoliciones CRRB, una empresa especializada en demoliciones industriales y civiles. El sitio presenta una interfaz moderna y responsiva que muestra los servicios, proyectos y contacto de la empresa.

## Características Principales
- 🎥 Video de fondo en la sección hero
- 🖼️ Carrusel de imágenes de proyectos
- 📹 Galería de videos con vista previa y popup
- 📱 Diseño completamente responsivo
- 📞 Sección de contacto con formulario
- 💬 Botón de WhatsApp flotante

## Tecnologías Utilizadas
- Vue.js 3
- Vite
- CSS3
- HTML5
- EmailJS (para el formulario de contacto)

## Estructura del Proyecto
```
src/
├── assets/
│   ├── images/      # Imágenes del sitio
│   └── videos/      # Videos de proyectos
├── components/
│   ├── layout/      # Componentes de estructura
│   │   ├── Header.vue
│   │   └── Footer.vue
│   └── sections/    # Secciones principales
│       ├── Hero.vue
│       ├── About.vue
│       ├── Carousel.vue
│       ├── VideoGallery.vue
│       └── Contact.vue
└── App.vue          # Componente principal
```

## Componentes Principales

### Hero
- Video de fondo con overlay
- Título y subtítulo animados
- Botón de llamada a la acción

### Carrusel
- Navegación automática y manual
- Indicadores de posición
- Transiciones suaves
- Imágenes responsivas

### Galería de Videos
- Grid de videos con vista previa
- Popup de video con controles
- Efectos hover interactivos
- Diseño responsivo

### Contacto
- Formulario de contacto
- Validación de campos
- Integración con EmailJS
- Mensajes de éxito/error

## Configuración del Proyecto

### Requisitos
- Node.js (v14 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

## Estilos y Diseño
- Paleta de colores:
  - Principal: #ffc107 (amarillo)
  - Fondo: #f0f0f0 (gris claro)
  - Texto: #111 (casi negro)
- Tipografía:
  - Títulos: 2.5rem
  - Subtítulos: 1.8rem
  - Texto normal: 1rem
- Breakpoints:
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px

## Optimizaciones
- Lazy loading de imágenes y videos
- Compresión de assets
- Código modular y reutilizable
- SEO básico implementado
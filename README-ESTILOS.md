# 🎨 Guía de Estilos - ShopNodeCore

## Paleta de Colores

### Colores Principales
Tu aplicación usa un sistema de colores centralizado definido en `src/assets/styles/variables.css`:

```css
--color-primary: #DDEB9D      /* Verde claro - Principal */
--color-secondary: #A0C878    /* Verde medio - Secundario */
--color-tertiary: #27667B     /* Azul verdoso - Terciario */
--color-quaternary: #143D60   /* Azul oscuro - Cuarto */
```

### Cómo Cambiar la Paleta
Para cambiar los colores de toda la aplicación, solo edita estas 4 variables en `src/assets/styles/variables.css`:

```css
:root {
  /* Cambia estos valores y toda la app se actualizará */
  --color-primary: #TU_COLOR_PRINCIPAL;
  --color-secondary: #TU_COLOR_SECUNDARIO;
  --color-tertiary: #TU_COLOR_TERCIARIO;
  --color-quaternary: #TU_COLOR_CUARTO;
}
```

## Sistema de Botones

### Clases Disponibles
```html
<!-- Botones de colores -->
<button class="btn btn-primary">Botón Principal</button>
<button class="btn btn-secondary">Botón Secundario</button>
<button class="btn btn-tertiary">Botón Terciario</button>
<button class="btn btn-outline">Botón Outline</button>

<!-- Tamaños -->
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
<button class="btn btn-primary btn-full">Ancho completo</button>

<!-- Estados -->
<button class="btn btn-success">Éxito</button>
<button class="btn btn-warning">Advertencia</button>
<button class="btn btn-error">Error</button>
```

## Formularios

### Estructura Recomendada
```html
<div class="form-group">
  <label class="form-label">Etiqueta</label>
  <input type="text" class="form-input" placeholder="Placeholder">
</div>
```

## Sistema de Espaciado

### Variables Disponibles
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 20px
--spacing-2xl: 24px
--spacing-3xl: 32px
--spacing-4xl: 40px
--spacing-5xl: 48px
--spacing-6xl: 64px
```

### Clases Utilitarias
```html
<!-- Márgenes -->
<div class="mb-4">Margen inferior</div>
<div class="mt-6">Margen superior</div>

<!-- Colores de texto -->
<p class="text-primary">Texto principal</p>
<p class="text-secondary">Texto secundario</p>
<p class="text-tertiary">Texto terciario</p>

<!-- Colores de fondo -->
<div class="bg-primary">Fondo principal</div>
<div class="bg-secondary">Fondo secundario</div>
```

## Tarjetas (Cards)

### Estructura Básica
```html
<div class="card">
  <div class="card-header">
    <h3>Título de la tarjeta</h3>
  </div>
  <div class="card-body">
    <p>Contenido principal</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Acción</button>
  </div>
</div>
```

## Modales

### Estructura Básica
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2>Título del Modal</h2>
      <button class="close-btn">&times;</button>
    </div>
    <div class="modal-body">
      <p>Contenido del modal</p>
    </div>
  </div>
</div>
```

## Tipografía

### Tamaños de Fuente
```css
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-base: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 30px
--font-size-4xl: 36px
```

### Clases de Texto
```html
<h1 class="text-4xl font-bold text-tertiary">Título Grande</h1>
<p class="text-base text-gray-600">Párrafo normal</p>
<small class="text-sm text-gray-500">Texto pequeño</small>
```

## Sombras

### Variables Disponibles
```css
--shadow-sm: sombra pequeña
--shadow-md: sombra mediana
--shadow-lg: sombra grande
--shadow-xl: sombra extra grande
--shadow-2xl: sombra máxima
```

### Uso en CSS
```css
.mi-elemento {
  box-shadow: var(--shadow-md);
}
```

## Bordes y Radios

### Variables de Radio
```css
--border-radius-sm: 4px
--border-radius-md: 6px
--border-radius-lg: 8px
--border-radius-xl: 12px
--border-radius-2xl: 16px
--border-radius-full: 9999px (círculo)
```

### Uso
```css
.mi-caja {
  border-radius: var(--border-radius-xl);
  border: var(--border-width-thin) solid var(--color-gray-300);
}
```

## Transiciones

### Variables de Velocidad
```css
--transition-fast: 0.15s ease-in-out
--transition-normal: 0.3s ease-in-out
--transition-slow: 0.5s ease-in-out
```

### Uso
```css
.mi-boton {
  transition: all var(--transition-normal);
}
```

## Z-Index (Capas)

### Variables Organizadas
```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

## Responsive Design

### Breakpoints de Referencia
```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Uso en Media Queries
```css
@media (max-width: 768px) {
  .mi-elemento {
    padding: var(--spacing-sm);
  }
}
```

## Ejemplos de Personalización

### Cambiar Tema a Azul
```css
:root {
  --color-primary: #3B82F6;      /* Azul claro */
  --color-secondary: #1D4ED8;    /* Azul medio */
  --color-tertiary: #1E3A8A;     /* Azul oscuro */
  --color-quaternary: #0F172A;   /* Azul muy oscuro */
}
```

### Cambiar Tema a Rojo
```css
:root {
  --color-primary: #FCA5A5;      /* Rojo claro */
  --color-secondary: #EF4444;    /* Rojo medio */
  --color-tertiary: #DC2626;     /* Rojo oscuro */
  --color-quaternary: #7F1D1D;   /* Rojo muy oscuro */
}
```

### Aumentar Espaciado General
```css
:root {
  --spacing-xs: 6px;    /* Era 4px */
  --spacing-sm: 12px;   /* Era 8px */
  --spacing-md: 18px;   /* Era 12px */
  /* ... y así sucesivamente */
}
```

## Mejores Prácticas

### ✅ DO (Hacer)
- Usar siempre las variables CSS en lugar de valores hardcodeados
- Usar las clases utilitarias cuando sea posible
- Mantener consistencia en espaciado y colores
- Probar cambios en dispositivos móviles

### ❌ DON'T (No hacer)
- Escribir colores directamente como `#ff0000`
- Crear nuevas variables sin documentar
- Ignorar las clases existentes
- Romper la jerarquía de z-index

## Estructura de Archivos

```
src/
├── assets/
│   └── styles/
│       └── variables.css     <- ¡TU ARCHIVO PRINCIPAL!
├── components/
│   ├── AuthModal.vue         <- Usa variables CSS
│   ├── Footer.vue           <- Usa variables CSS
│   └── Header.vue           <- Usa variables CSS
└── views/
    ├── ResetPassword.vue    <- Usa variables CSS
    └── EmailVerification.vue <- Usa variables CSS
```

## Herramientas Recomendadas

### Para Elegir Colores
- [Coolors.co](https://coolors.co/) - Generador de paletas
- [Adobe Color](https://color.adobe.com/) - Rueda de colores
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificar accesibilidad

### Para Visualizar Cambios
1. Modifica `src/assets/styles/variables.css`
2. Guarda el archivo
3. ¡Los cambios se aplican automáticamente en toda la app!

---

**💡 Tip:** Este sistema te permite cambiar completamente el look de tu aplicación modificando solo unas pocas variables. ¡Experimenta y diviértete! 
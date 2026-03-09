# The Conquest of Mexico - 3D Interactive Experience ⚔️🏛️

An immersive, browser-based 3D chronological journey illustrating the historical events of the Conquest of Mexico. Built completely with Vanilla JavaScript, this project was developed as an interactive educational tool for the Berta Von Glumer school, demonstrating how modern web technologies can breathe life into history.

## Technical Highlights
- **WebGL Rendering:** Powered by `Three.js` for complex 3D scenes including custom-modeled ships, temples, and colonial architecture.
- **Procedural Textures:** Dynamic generation of brick and noise textures directly through the Canvas API inside JavaScript, minimizing external asset dependency.
- **Cinematic Animations:** Integration with `GSAP` to manage smooth camera transitions, theme-based lighting changes (day, sunset, cloudy, war, night), and UI fading.
- **Audio Context API:** Custom procedural sound generation (wind/noise) created mathematically without external audio files.
- **Bilingual Support:** Full architecture to toggle dynamically between English and Spanish seamlessly.

## Built With
* HTML5 & CSS3
* Vanilla JavaScript (ES6+)
* [Three.js](https://threejs.org/) (v128)
* [GSAP](https://greensock.com/gsap/) (v3.12.2)

## How to Run Locally
1. Clone the repository.
2. Run `npm install` to install local development dependencies.
3. Run `npm start` to serve the project locally and avoid WebGL CORS issues.

---

# La Conquista de México - Experiencia 3D Interactiva ⚔️🏛️

Un viaje cronológico inmersivo en 3D ejecutado en el navegador que ilustra los eventos históricos de la Conquista de México. Construido completamente con Vanilla JavaScript, este proyecto fue desarrollado como una herramienta educativa interactiva para la escuela Berta Von Glumer, demostrando cómo las tecnologías web modernas pueden dar vida a la historia.

## Aspectos Técnicos Destacados
- **Renderizado WebGL:** Impulsado por `Three.js` para crear escenas 3D complejas que incluyen barcos, templos y arquitectura colonial modelados a medida.
- **Texturas Procedurales:** Generación dinámica de texturas de ladrillo y ruido directamente a través de la API Canvas dentro de JavaScript, minimizando la dependencia de recursos externos.
- **Animaciones Cinemáticas:** Integración con `GSAP` para gestionar transiciones suaves de cámara, cambios de iluminación basados en la temática (día, atardecer, nublado, guerra, noche) y atenuación de la interfaz de usuario.
- **API de Audio Context:** Generación de sonido procedural personalizado (viento/ruido) creado matemáticamente sin archivos de audio externos.
- **Soporte Bilingüe:** Arquitectura completa para alternar dinámicamente entre Inglés y Español sin recargar la página.

## Tecnologías Utilizadas
* HTML5 y CSS3
* Vanilla JavaScript (ES6+)
* [Three.js](https://threejs.org/) (v128)
* [GSAP](https://greensock.com/gsap/) (v3.12.2)

## Cómo Ejecutarlo Localmente
1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias de desarrollo local.
3. Ejecuta `npm start` para levantar el proyecto localmente y evitar problemas de CORS con WebGL.
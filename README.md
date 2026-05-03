# Sprint 3 | DevConnect



### Arael Jesús Almeida González
### Vidal De Leon Giménez
### Texenery Bordón Rodríguez
##  



## 1. Consideraciones previas

Antes de empezar a leer, se debe establecer las dimensiones que se consideran móvil o tablet. Estas dimensiones vienen dadas:

- Dispositivos móviles -> 0-768px
- Tablets -> 769-1028px
- Desktop -> 1029-...

En este sprint el proyecto ha sido **migrado de HTML/CSS/JS vanilla a Angular 20** con componentes standalone. Ya no se usa carga de templates mediante `loadTemplate.js` ni fetchs a JSON estáticos. Toda la lógica se gestiona mediante **componentes TypeScript**, **servicios con inyección de dependencias** y **Firebase (Firestore + Auth)** como backend.

**Stack tecnológico:**
- Angular 20.3.6 (componentes standalone, sin NgModules)
- Angular Material 20.2.6 (menús, botones)
- Firebase 11.10.0 (Auth + Firestore)
- RxJS 7.8.2 (gestión reactiva de datos)
- Reactive Forms + Template-Driven Forms
- TypeScript 5.9.2

## 2. Arquitectura del proyecto

El proyecto sigue la arquitectura oficial de Angular con tres capas principales:

### 2.1 Modelos (`src/app/core/models/`)
Definiciones TypeScript de todas las entidades del sistema:
- **User** (`user.model.ts`) → uid, Fullname, Nickname, Telephone, Gmail, Password, Description, isCompany, Topic[], Projects[], Avatar, Banner, Social, CV
- **Project** (`project.model.ts`) → id, title, creator, isCompanyProject, image, ownerEmail, ownerPhone, description, requireTopic[], maintainers[], numberParticipants, limitDate
- **Topic** (`topic.model.ts`) → id, cat (categoría), category, name
- **Social** (`social.model.ts`) → Github, Twitter, Instagram, Linkedin (cada uno un SocialLink)
- **SocialLink** (`social-link.model.ts`) → Name, Link
- **HeaderElements** (`headerElements.model.ts`) → id, nombre, items[]

### 2.2 Servicios (`src/app/core/services/`)
Servicios con `providedIn: 'root'` que gestionan la comunicación con Firebase:
- **AuthService** → Registro, login, logout, deleteAccount, estado de autenticación reactivo con `BehaviorSubject`
- **UserService** → CRUD de usuarios en Firestore (crear con auth + verificación email, actualizar con re-autenticación, eliminar)
- **ProjectService** → CRUD de proyectos (crear, obtener, actualizar, eliminar, obtener maintainers)
- **TopicService** → CRUD de topics/skills en Firestore
- **HeaderElementsService** → Obtiene elementos de navegación del header desde Firestore

### 2.3 Componentes compartidos (`src/app/shared/components/`)
16 componentes reutilizables con `@Input()` y `@Output()`:

| Componente | Función |
|---|---|
| **Header** | Barra de navegación con búsqueda, menús (Angular Material), estado auth, foto usuario, sidebar toggle |
| **Footer** | Footer estático con router links |
| **Banner** | Hero banner de la home con animación typewriter para "DevConnect" |
| **BannerProfile** | Banner de perfil con avatar, imagen de fondo y título del usuario |
| **InformationCard** | Tarjeta clicable con imagen, título, descripción y badges de topics |
| **CardsGrid** | Grid contenedor de hasta 4 InformationCard |
| **MediaList** | Lista de MediaComponent con soporte para modo edición (edit/delete) |
| **MediaComponent** | Tarjeta individual de proyecto/usuario con navegación a perfiles |
| **GetInputText** | Input reutilizable con label, validación y mensajes de error |
| **SearchTopics** | Selector múltiple de topics con búsqueda/filtrado |
| **PaginationComponent** | Paginación numérica con currentPage, totalPages y pageChange |
| **TopicsGrid** | Grid de badges de topics resolviendo IDs desde Firestore |
| **UserSkills** | Sección de skills con label y lista de topic badges |
| **UserDataField** | Muestra un enlace de red social (nombre + URL) |
| **SkillField** | Muestra un único skill |
| **TopicBoxBtn** | Badge clicable que navega a SearchResult con query param |

## 3. Listado de páginas

### 3.1 Página de Home

Es la página de inicio del sitio web, cualquier usuario tiene acceso a esta página.  
Muestra los usuarios y proyectos trending.

En caso de que se muestre en dispositivos móviles, al tener menos espacio para el contenido,  
el header se "parte" en dos, el buscador y la "hamburguesa" que muestra el resto de aspectos  
del header, como la búsqueda filtrada y ajustes de proyectos y perfil en caso de tener sesión iniciada.

En cuanto al contenido, todo se mostrará en formato columna, de esta forma el usuario podrá  
observar los contenidos bien definidos.

En caso de tablets, el contenido se mostrará bastante similar a la versión desktop,  
pero quizás con alguna adaptación. En las tablets, no habrá hamburguesa ya que se verá bien el propio header.

**Implementación Angular:** El componente `Index` obtiene todos los usuarios y proyectos mediante observables (`UserService.getUser()`, `ProjectService.getProject()`). Muestra los 3 primeros usuarios como trending users con `InformationCard` y los 4 primeros proyectos con `MediaList`. Los botones "Discover" navegan a `/SearchResult/users` o `/SearchResult/projects`.

**Componentes compartidos usados:** `Header`, `Banner`, `InformationCard`, `MediaList`, `Footer`

- [Código TS](src/app/pages/index/index.ts)
- [Código HTML](src/app/pages/index/index.html)
- [Código CSS](src/app/pages/index/index.css)



### 3.2 Página de registro de usuario

Es una de las páginas que por supuesto no puede fallar, y que además es un formulario.

En cuanto a los aspectos responsive, para dispositivos móviles se ajusta en contenido al centro usando la misma distribución  
de campos que en versiones de Tablets y Desktop, teniendo éstas dos últimas la misma distribución con apenas variaciones en  
el contenido.

**Implementación Angular:** Formulario reactivo con 8 campos: nickname, password, retry-password, name, surname, email, phone y tipo de cuenta (radio: individual/empresa). Validadores personalizados: `nicknameExists` (verifica unicidad en Firestore), `validPasswords` (comparación cruzada de contraseñas), patrón de contraseña (mayúscula, minúscula, dígito, carácter especial, 8-64 chars). Selección de topics con `SearchTopics`. Preview de avatar al subir imagen. Al enviar, llama a `UserService.addUser()` que crea la cuenta en Firebase Auth + documento en Firestore con envío de email de verificación.

**Componentes compartidos usados:** `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/user-registration/user-registration.ts)
- [Código HTML](src/app/pages/user-registration/user-registration.html)
- [Código CSS](src/app/pages/user-registration/user-registration.css)


### 3.3 Página de Inicio de Sesión

Página dedicada al inicio de sesión. El cliente tendrá la posibilidad de crear una cuenta o de iniciar sesión.

Esta página apenas tiene elementos responsive, al ser un contenido centrado y pequeño, pues no requiere demasiado cambios  
mediante media-query.

**Implementación Angular:** Formulario reactivo con email y password. Password tiene validación de patrón complejo (mayúscula, minúscula, dígito, carácter especial, 8-64 chars). Usa `AuthService.login()` con Firebase Auth. Manejo de códigos de error de Firebase con mensajes en español. Toggle de visibilidad de contraseña.

**Componentes compartidos usados:** `GetInputText`

- [Código TS](src/app/pages/login/login.ts)
- [Código HTML](src/app/pages/login/login.html)
- [Código CSS](src/app/pages/login/login.css)


### 3.4 Página de gestión de perfil

Página dedicada al perfil del usuario cómo a la gestión del mismo. Solo accesible al tener sesión iniciada.

En esta página, al haber mucho contenido que debe ser visualizado, se han usado media-query para ajustar los campos rellenables  
y los tópicos del usuario, centrando el contenido en la medida de lo posible para móvils y tablets. En caso de desktop, todo  
el contenido se encuentra separado y dividido en varias columnas para mayor comodidad.

**Implementación Angular:** Carga datos del usuario por route param `:id`. Formulario reactivo con nickname, password, phone, email, current password. Validador personalizado `nicknameExists`. Selección de topics con `SearchTopics`. Modal de confirmación de contraseña antes de guardar. Usa `UserService.updateUser()` que requiere re-autenticación con la contraseña actual antes de permitir cambios sensibles (email/password). Layout de dos columnas: campos de formulario + descripción/upload. Upload de avatar y banner con preview.

**Componentes compartidos usados:** `Header`, `BannerProfile`, `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/manage-profile/manage-profile.ts)
- [Código HTML](src/app/pages/manage-profile/manage-profile.html)
- [Código CSS](src/app/pages/manage-profile/manage-profile.css)


### 3.5 Página del perfil de usuario

Página dedicada a la visualización del perfil del usuario.

En esta página, al igual que en la página anterior, se han usado media-query para ajustar el contenido según el dispositivo.

**Implementación Angular:** Carga usuario por route param `:id`. Verifica si el usuario actual es el dueño del perfil (`isOwnedProfile`). Resuelve topic IDs a objetos Topic vía `forkJoin`. Filtra proyectos del usuario por creator nickname. Separa topics en "lenguajes" y "especialidades". Muestra enlaces de redes sociales (GitHub, LinkedIn, Instagram, Twitter), descarga de CV y proyectos del usuario.

**Componentes compartidos usados:** `Header`, `Footer`, `BannerProfile`, `UserSkills`, `UserDataField`, `CardsGrid`

- [Código TS](src/app/pages/user-profile/user-profile.ts)
- [Código HTML](src/app/pages/user-profile/user-profile.html)
- [Código CSS](src/app/pages/user-profile/user-profile.css)




### 3.6 Página de creación de proyectos

Página dedicada a la creación de un proyecto, accesible desde un botón en el header.

La media-query usada para dispositivos móvil hace que todo el contenido se vea en formato columna, mientras que en tablet y  
desktop se distribuye un poco más los campos pero que de igual manera, siguen centrados.

**Implementación Angular:** Componente de doble propósito: crea proyectos nuevos Y edita existentes (detectado por route param `:id`). Formulario reactivo con validadores personalizados: `fechaNoAnteriorAHoy` (fecha no anterior a hoy), `itExists(projects)` (unicidad del nombre del proyecto), `validSelectedTopics(topicsIds, topics)` (debe seleccionar al menos un idioma y un lenguaje de programación). Al crear, llama a `ProjectService.addProject()` que añade el proyecto y actualiza el array Projects del usuario. Auto-rellena el formulario cuando se edita.

**Componentes compartidos usados:** `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/create-project/create-project.ts)
- [Código HTML](src/app/pages/create-project/create-project.html)
- [Código CSS](src/app/pages/create-project/create-project.css)

### 3.7 Página de gestión de proyectos

Página dedicada a la gestión de los proyectos del usuario, accesible desde el perfil de usuario.

La página se adapta a las dimensiones de móvil y tablet por las media-query, dejando el contenido en columna a medida que  
se reduce el tamaño.

**Implementación Angular:** Carga usuario por route param `:id`, filtra proyectos por creator nickname. Muestra los proyectos del usuario con `MediaList` en modo `showActions=true` con botones de editar/eliminar. Paginación con `PaginationComponent`.

**Componentes compartidos usados:** `Header`, `Footer`, `MediaList`, `PaginationComponent`

- [Código TS](src/app/pages/manage-project/manage-project.ts)
- [Código HTML](src/app/pages/manage-project/manage-project.html)
- [Código CSS](src/app/pages/manage-project/manage-project.css)

### 3.8 Página del perfil de proyecto

Página dedicada al proyecto seleccionado, mostrando toda la información necesaria.

Gracias a las media-query, el contenido disperso de desktop y tablet se ve reducido y en formato columna para mejor visión  
en móviles.

**Implementación Angular:** Carga proyecto por route param `:id`. Resuelve el creator a UID del usuario. Obtiene maintainers del proyecto. Usa cadena RxJS `pipe(tap, switchMap)`. Muestra imagen hero del proyecto con overlay (título + enlace al creador), descripción, grid de colaboradores (`CardsGrid`), requisitos sidebar (`TopicsGrid`) y botón de inscripción.

**Componentes compartidos usados:** `Header`, `Footer`, `CardsGrid`, `TopicsGrid`

- [Código TS](src/app/pages/project-profile/project-profile.ts)
- [Código HTML](src/app/pages/project-profile/project-profile.html)
- [Código CSS](src/app/pages/project-profile/project-profile.css)


### 3.9 Página de resultado de búsqueda

Página dedicada al resultado de búsqueda, sea usando la barra de búsqueda o los filtros predeterminados.

Los aspectos responsive mediante media-query ayudan a restructurar el contenido, haciendo el contenido más pequeño pero  
sin perder la organización en tablets y usando la estructura en columna de siempre en móviles,

**Implementación Angular:** Página más compleja del proyecto. Escucha `paramMap` y `queryParamMap` vía `combineLatest`. Soporta 3 modos: solo usuarios, solo proyectos, mixto. Filtrado client-side por query de búsqueda. Paginación con pageSize de 4. El modo mixto intercala usuarios y proyectos. Usa `takeUntil` para limpieza de suscripciones. Sidebar con filtros (checkboxes, radios, sort).

**Componentes compartidos usados:** `Header`, `Footer`, `MediaList`, `PaginationComponent`

- [Código TS](src/app/pages/search-result/search-result.ts)
- [Código HTML](src/app/pages/search-result/search-result.html)
- [Código CSS](src/app/pages/search-result/search-result.css)

### 3.10 Página de gestión de incidencias

Representan la creación de tickets por si surge algún problema.

Como en el resto de páginas, con la media-query a móvil reestructura el footer y el header para el dispositivo. Desktop y tablet  
son bastante similares, pero no totalmente igual.

**Implementación Angular:** Formulario reactivo con campos topic y texto (validadores min/max length). Requiere autenticación para enviar. Escribe directamente en la colección `incidents` de Firestore usando `addDoc`. Muestra mensajes de éxito/error.

**Componentes compartidos usados:** `Header`, `Footer`

- [Código TS](src/app/pages/incidents/incidents.ts)
- [Código HTML](src/app/pages/incidents/incidents.html)
- [Código CSS](src/app/pages/incidents/incidents.css)


### 3.11 Página de presentación del sitio web

Página de presentación de la plataforma.

En esta página, al haber sólo texto, el media-query es sencillo y no parece cambiar demasiado, sólo, como en el resto de páginas,  
el cómo se ve el header y footer para móviles.

**Implementación Angular:** Componente mínimo sin lógica. Contenido estático en español explicando la misión de la plataforma (conectar desarrolladores, mostrar talento, proyectos colaborativos, ayudar a empresas a encontrar desarrolladores).

**Componentes compartidos usados:** `Header`, `Banner`, `Footer`

- [Código TS](src/app/pages/about-us/about-us.ts)
- [Código HTML](src/app/pages/about-us/about-us.html)
- [Código CSS](src/app/pages/about-us/about-us.css)


## 4. Estructura de directorios

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript (User, Project, Topic, Social...)
│   │   └── services/        # Servicios CRUD (AuthService, UserService, ProjectService, TopicService, HeaderElementsService)
│   ├── pages/               # 11 componentes de página (uno por ruta)
│   │   ├── about-us/
│   │   ├── create-project/
│   │   ├── incidents/
│   │   ├── index/
│   │   ├── login/
│   │   ├── manage-profile/
│   │   ├── manage-project/
│   │   ├── project-profile/
│   │   ├── search-result/
│   │   ├── user-profile/
│   │   └── user-registration/
│   ├── shared/
│   │   └── components/      # 16 componentes reutilizables
│   ├── app.config.ts        # Configuración de la app (router, Firebase, HttpClient)
│   ├── app.routes.ts        # Definición de rutas
│   └── app.ts               # Componente root con RouterOutlet
├── environments/            # Variables de entorno (Firebase config)
└── styles.css               # Estilos globales
```

## 5. Patrones arquitectónicos clave

### Componentes Standalone
Todos los componentes son standalone (sin NgModules). Cada componente declara su propio array de `imports`.

### Inyección de dependencias
Usa la función moderna `inject()` en lugar de inyección por constructor:
```typescript
private userService = inject(UserService);
```

### Flujo de datos reactivo
- Los servicios retornan `Observable<T[]>` desde Firestore `collectionData()`.
- Las páginas se suscriben en `ngOnInit()` o usan operadores RxJS (`switchMap`, `combineLatest`, `forkJoin`, `tap`, `takeUntil`).
- `BehaviorSubject` en AuthService para estado de autenticación en tiempo real.

### Validadores personalizados
Validadores definidos como funciones exportadas en los componentes que los necesitan:
- `fechaNoAnteriorAHoy` → fecha no anterior a hoy
- `itExists(projects)` → unicidad del nombre del proyecto
- `validSelectedTopics(topicsIds, topics)` → al menos un idioma y un lenguaje
- `nicknameExists` → unicidad del nickname
- `validPasswords` → comparación de contraseñas

### Patrón de re-autenticación
`UserService.updateUser()` requiere la contraseña actual del usuario antes de permitir cambios sensibles (actualización de email/password), usando `reauthenticateWithCredential` de Firebase.

## 6. Diferencias clave respecto al Sprint 2

| Aspecto | Sprint 2 (Vanilla JS) | Sprint 3 (Angular) |
|---|---|---|
| **Estructura** | Archivos HTML con `<script>` inline o .js separados | Clases TypeScript con `@Component`, archivos .ts/.html/.css separados |
| **Manipulación DOM** | `document.querySelector`, `innerHTML`, `addEventListener` | Data binding (`{{ }}`, `[property]`, `(event)`), sin manipulación directa del DOM |
| **Rutas** | Navegación manual entre páginas HTML | `@angular/router` con configuración declarativa, `RouterLink`, `ActivatedRoute` |
| **Formularios** | Extracción manual de valores, validación custom | `ReactiveFormsModule` con `FormGroup`, `FormControl`, validadores built-in y custom |
| **Estado** | Variables globales, localStorage | RxJS `Observable`/`BehaviorSubject`, estado a nivel de servicio |
| **Reutilización** | Copiar HTML, jQuery plugins | Componentes compartidos con `@Input()` y `@Output()` |
| **Datos** | `fetch()` a JSON estáticos | Firebase Firestore con streams `Observable` |
| **Autenticación** | Tokens de sesión manuales | Firebase Auth con `onAuthStateChanged` reactivo |
| **Templates** | HTML plano con interpolación en JS | Sintaxis Angular: `@for`, `@if`, `@else`, pipes |
| **CSS** | CSS global, convención BEM | CSS scoped por componente (view encapsulation) |
| **Tipado** | Dinámico (sin tipos) | TypeScript completo con interfaces para todos los modelos |
| **Build** | Archivos servidos directamente | Angular CLI con bundling, tree-shaking, compilación AOT |

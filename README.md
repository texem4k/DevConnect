# Sprint 3 | DevConnect



### Arael Jesús Almeida González
### Vidal De Leon Giménez
### Texenery Bordón Rodríguez
##  



## 1. Consideraciones previas

En este sprint el proyecto ha sido **migrado de HTML/CSS/JS vanilla a Angular 20** con componentes standalone. Ya no se usa carga de templates mediante `loadTemplate.js` ni fetchs a JSON estáticos. Toda la lógica se gestiona mediante **componentes TypeScript**, **servicios con inyección de dependencias** y **Firebase (Firestore + Auth)** como backend.

## 2. Descripción del proyecto

Se ha decidido diseñar y desarrollar un sitio web dedicado al freelance, estilo Fiverr, Freelancer, etc.
En estos sitios se busca conectar trabajadores autónomos llamados Freelancer con empresas o
incluso otros autónomos para ciertos proyectos o trabajos puntuales de una gran variedad de ámbitos.
De cierta manera es un intermediario.

Este proyecto se centra en el ámbito de la tecnología y la programación, además de incluir
ciertas funcionalidades nuevas cómo que el propio trabajador autónomo puede crear proyectos y
buscar a gente de su mismo sector tecnológico. Teniendo como objetivo potenciar la empleabilidad
del sector de manera telemática, dado que en ciertas regiones no abundan las oportunidades,
facilitando la búsqueda de profesionales y puestos de trabajo disponibles.

## 3. Estructura de directorios

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
│   ├── app.config.ts        # Configuración de la app (router, Firebase)
│   ├── app.routes.ts        # Definición de rutas
│   └── app.ts               # Componente root con RouterOutlet
├── environments/            # Variables de entorno (Firebase config)
└── styles.css               # Estilos globales
```

## 4. Listado de páginas

### 4.1 Página de Home

Es la página de inicio del sitio web, cualquier usuario tiene acceso a esta página. Muestra los usuarios y proyectos trending.

En dispositivos móviles el header se divide en dos: el buscador y la "hamburguesa" que muestra el resto de opciones. En tablets y desktop el header se muestra completo. El contenido se distribuye en formato columna en móvil y en grid en desktop.

**Implementación Angular:** El componente `Index` obtiene todos los usuarios y proyectos mediante observables (`UserService.getUser()`, `ProjectService.getProject()`). Muestra los 3 primeros usuarios como trending users con `InformationCard` y los 4 primeros proyectos con `MediaList`. Los botones "Discover" navegan a `/SearchResult/users` o `/SearchResult/projects`.

**Componentes compartidos usados:** `Header`, `Banner`, `InformationCard`, `MediaList`, `Footer`

- [Código TS](src/app/pages/index/index.ts)
- [Código HTML](src/app/pages/index/index.html)
- [Código CSS](src/app/pages/index/index.css)



### 4.2 Página de registro de usuario

Página de formulario para crear una nueva cuenta. En móvil el contenido se centra con la misma distribución de campos que en tablet y desktop.

**Implementación Angular:** Formulario reactivo con 8 campos: nickname, password, retry-password, name, surname, email, phone y tipo de cuenta (radio: individual/empresa). Validadores personalizados: `nicknameExists` (verifica unicidad en Firestore), `validPasswords` (comparación cruzada de contraseñas), patrón de contraseña (mayúscula, minúscula, dígito, carácter especial, 8-64 chars). Selección de topics con `SearchTopics`. Preview de avatar al subir imagen. Al enviar, llama a `UserService.addUser()` que crea la cuenta en Firebase Auth + documento en Firestore con envío de email de verificación.

**Componentes compartidos usados:** `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/user-registration/user-registration.ts)
- [Código HTML](src/app/pages/user-registration/user-registration.html)
- [Código CSS](src/app/pages/user-registration/user-registration.css)


### 4.3 Página de Inicio de Sesión

Página de inicio de sesión. Contenido centrado y compacto que apenas requiere cambios mediante media-query.

**Implementación Angular:** Formulario reactivo con email y password. Password tiene validación de patrón complejo (mayúscula, minúscula, dígito, carácter especial, 8-64 chars). Usa `AuthService.login()` con Firebase Auth. Manejo de códigos de error de Firebase con mensajes en español. Toggle de visibilidad de contraseña.

**Componentes compartidos usados:** `GetInputText`

- [Código TS](src/app/pages/login/login.ts)
- [Código HTML](src/app/pages/login/login.html)
- [Código CSS](src/app/pages/login/login.css)


### 4.4 Página de gestión de perfil

Página dedicada al perfil del usuario y a su gestión. Solo accesible al tener sesión iniciada. En desktop el contenido se divide en varias columnas, mientras que en móvil y tablet se centra en formato columna.

**Implementación Angular:** Carga datos del usuario por route param `:id`. Formulario reactivo con nickname, password, phone, email, current password. Validador personalizado `nicknameExists`. Selección de topics con `SearchTopics`. Modal de confirmación de contraseña antes de guardar. Usa `UserService.updateUser()` que requiere re-autenticación con la contraseña actual antes de permitir cambios sensibles (email/password). Layout de dos columnas: campos de formulario + descripción/upload. Upload de avatar y banner con preview.

**Componentes compartidos usados:** `Header`, `BannerProfile`, `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/manage-profile/manage-profile.ts)
- [Código HTML](src/app/pages/manage-profile/manage-profile.html)
- [Código CSS](src/app/pages/manage-profile/manage-profile.css)


### 4.5 Página del perfil de usuario

Página dedicada a la visualización del perfil del usuario. Se adapta mediante media-query al dispositivo.

**Implementación Angular:** Carga usuario por route param `:id`. Verifica si el usuario actual es el dueño del perfil (`isOwnedProfile`). Resuelve topic IDs a objetos Topic vía `forkJoin`. Filtra proyectos del usuario por creator nickname. Separa topics en "lenguajes" y "especialidades". Muestra enlaces de redes sociales (GitHub, LinkedIn, Instagram, Twitter), descarga de CV y proyectos del usuario.

**Componentes compartidos usados:** `Header`, `Footer`, `BannerProfile`, `UserSkills`, `UserDataField`, `CardsGrid`

- [Código TS](src/app/pages/user-profile/user-profile.ts)
- [Código HTML](src/app/pages/user-profile/user-profile.html)
- [Código CSS](src/app/pages/user-profile/user-profile.css)




### 4.6 Página de creación de proyectos

Página dedicada a la creación de un proyecto, accesible desde un botón en el header. En móvil todo el contenido se muestra en formato columna.

**Implementación Angular:** Componente de doble propósito: crea proyectos nuevos Y edita existentes (detectado por route param `:id`). Formulario reactivo con validadores personalizados: `fechaNoAnteriorAHoy` (fecha no anterior a hoy), `itExists(projects)` (unicidad del nombre del proyecto), `validSelectedTopics(topicsIds, topics)` (debe seleccionar al menos un idioma y un lenguaje de programación). Al crear, llama a `ProjectService.addProject()` que añade el proyecto y actualiza el array Projects del usuario. Auto-rellena el formulario cuando se edita.

**Componentes compartidos usados:** `Footer`, `GetInputText`, `SearchTopicsComponent`

- [Código TS](src/app/pages/create-project/create-project.ts)
- [Código HTML](src/app/pages/create-project/create-project.html)
- [Código CSS](src/app/pages/create-project/create-project.css)

### 4.7 Página de gestión de proyectos

Página dedicada a la gestión de los proyectos del usuario, accesible desde el perfil de usuario. El contenido se reorganiza en columna a medida que se reduce el tamaño.

**Implementación Angular:** Carga usuario por route param `:id`, filtra proyectos por creator nickname. Muestra los proyectos del usuario con `MediaList` en modo `showActions=true` con botones de editar/eliminar. Paginación con `PaginationComponent`.

**Componentes compartidos usados:** `Header`, `Footer`, `MediaList`, `PaginationComponent`

- [Código TS](src/app/pages/manage-project/manage-project.ts)
- [Código HTML](src/app/pages/manage-project/manage-project.html)
- [Código CSS](src/app/pages/manage-project/manage-project.css)

### 4.8 Página del perfil de proyecto

Página dedicada al proyecto seleccionado, mostrando toda la información necesaria. El contenido disperso de desktop se reduce en formato columna para móviles.

**Implementación Angular:** Carga proyecto por route param `:id`. Resuelve el creator a UID del usuario. Obtiene maintainers del proyecto. Usa cadena RxJS `pipe(tap, switchMap)`. Muestra imagen hero del proyecto con overlay (título + enlace al creador), descripción, grid de colaboradores (`CardsGrid`), requisitos sidebar (`TopicsGrid`) y botón de inscripción.

**Componentes compartidos usados:** `Header`, `Footer`, `CardsGrid`, `TopicsGrid`

- [Código TS](src/app/pages/project-profile/project-profile.ts)
- [Código HTML](src/app/pages/project-profile/project-profile.html)
- [Código CSS](src/app/pages/project-profile/project-profile.css)


### 4.9 Página de resultado de búsqueda

Página dedicada al resultado de búsqueda, sea usando la barra de búsqueda o los filtros predeterminados. En tablets se mantiene la organización y en móvil se usa la estructura en columna.

**Implementación Angular:** Página más compleja del proyecto. Escucha `paramMap` y `queryParamMap` vía `combineLatest`. Soporta 3 modos: solo usuarios, solo proyectos, mixto. Filtrado client-side por query de búsqueda. Paginación con pageSize de 4. El modo mixto intercala usuarios y proyectos. Usa `takeUntil` para limpieza de suscripciones. Sidebar con filtros (checkboxes, radios, sort).

**Componentes compartidos usados:** `Header`, `Footer`, `MediaList`, `PaginationComponent`

- [Código TS](src/app/pages/search-result/search-result.ts)
- [Código HTML](src/app/pages/search-result/search-result.html)
- [Código CSS](src/app/pages/search-result/search-result.css)

### 4.10 Página de gestión de incidencias

Página de creación de tickets por si surge algún problema. El header y footer se reestructuran para móvil.

**Implementación Angular:** Formulario reactivo con campos topic y texto (validadores min/max length). Requiere autenticación para enviar. Escribe directamente en la colección `incidents` de Firestore usando `addDoc`. Muestra mensajes de éxito/error.

**Componentes compartidos usados:** `Header`, `Footer`

- [Código TS](src/app/pages/incidents/incidents.ts)
- [Código HTML](src/app/pages/incidents/incidents.html)
- [Código CSS](src/app/pages/incidents/incidents.css)


### 4.11 Página de presentación del sitio web

Página de presentación de la plataforma. Al haber solo texto, el media-query es sencillo, cambiando principalmente el header y footer para móviles.

**Implementación Angular:** Componente mínimo sin lógica. Contenido estático en español explicando la misión de la plataforma (conectar desarrolladores, mostrar talento, proyectos colaborativos, ayudar a empresas a encontrar desarrolladores).

**Componentes compartidos usados:** `Header`, `Banner`, `Footer`

- [Código TS](src/app/pages/about-us/about-us.ts)
- [Código HTML](src/app/pages/about-us/about-us.html)
- [Código CSS](src/app/pages/about-us/about-us.css)


## 5. Cómo ejecutar el proyecto

**Requisitos previos:** Node.js instalado.

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el servidor de desarrollo (http://localhost:4200)
ng serve

# 3. Compilar para producción
ng build
```

> **Nota:** Es necesario configurar las credenciales de Firebase en `src/environments/environment.ts` para que la aplicación funcione correctamente.

## 6. Arquitectura del proyecto

El proyecto sigue la arquitectura oficial de Angular con tres capas principales:

### 6.1 Modelos (`src/app/core/models/`)
Definiciones TypeScript de todas las entidades del sistema:
- **User** (`user.model.ts`) → uid, Fullname, Nickname, Telephone, Gmail, Password, Description, isCompany, Topic[], Projects[], Avatar, Banner, Social, CV
- **Project** (`project.model.ts`) → id, title, creator, isCompanyProject, image, ownerEmail, ownerPhone, description, requireTopic[], maintainers[], numberParticipants, limitDate
- **Topic** (`topic.model.ts`) → id, cat (categoría), category, name
- **Social** (`social.model.ts`) → Github, Twitter, Instagram, Linkedin (cada uno un SocialLink)
- **SocialLink** (`social-link.model.ts`) → Name, Link
- **HeaderElements** (`headerElements.model.ts`) → id, nombre, items[]

### 6.2 Servicios (`src/app/core/services/`)
Servicios con `providedIn: 'root'` que gestionan la comunicación con Firebase:
- **AuthService** → Registro, login, logout, deleteAccount, estado de autenticación reactivo con `BehaviorSubject`
- **UserService** → CRUD de usuarios en Firestore (crear con auth + verificación email, actualizar con re-autenticación, eliminar)
- **ProjectService** → CRUD de proyectos (crear, obtener, actualizar, eliminar, obtener maintainers)
- **TopicService** → CRUD de topics/skills en Firestore
- **HeaderElementsService** → Obtiene elementos de navegación del header desde Firestore

### 6.3 Componentes compartidos (`src/app/shared/components/`)
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

## 7. Backend: Firebase

A diferencia del Sprint 2, donde los datos se almacenaban en archivos JSON estáticos servidos mediante `fetch()`, en este sprint se utiliza **Firebase** como backend real:

- **Firestore** → Base de datos NoSQL en la nube que reemplaza los JSON de `src/backend/`. Colecciones: `users`, `projects`, `topics`, `header`, `incidents`. Los datos persisten entre sesiones y son accesibles en tiempo real.
- **Firebase Auth** → Sistema de autenticación que reemplaza la validación manual contra JSON de usuarios. Soporta registro con email/contraseña, inicio de sesión, verificación de email y eliminación de cuenta.

## 8. Anotaciones

- **Imágenes no persistentes:** No es posible almacenar imágenes (avatar, banner, portadas de proyectos) de forma persistente ya que Firebase Storage requiere un plan de pago. Las imágenes que se puedan seleccionar durante la personalización de usuario o proyectos tienen un comportamiento limitado.

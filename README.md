# Sprint 1 | Desarrollo Web y Móvil



### Arael Jesús Almeida González
### Vidal De Leon Giménez
### Texenery Bordón Rodríguez
##  
  
## 1. Características base del sitio web

Se ha decidido diseñar y desarrollar un sitio web dedicado al freelance, estilo Fiverr, Freelancer, etc.  
En estos sitios se busca conectar trabajadores autónomos llamados Freelancer con empresas o  
incluso otros autónomos para ciertos proyectos o trabajos puntuales de una gran variedad de ámbitos.  
De cierta manera es un intermediario.  

Este proyecto se centra en el ámbito de la tecnología y la programación, además de incluir  
ciertas funcionalidades nuevas cómo que el propio trabajador autónomo puede crear proyectos y  
buscar a gente de su mismo sector tecnológico. Teniendo como objetivo potenciar la empleabilidad  
del sector de manera telemática, dado que en ciertas regiones no abundan las oportunidades,  
facilitando la búsqueda de profesionales y puestos de trabajo disponibles.  

Cada usuario (sea empresa o trabajador) tiene cierto rating en su perfil con el grado de satisfacción  
puntuado por los empleadores, así como un historial de proyectos en los que ha participado.  

## 2. Definición de requisitos

**1. Requisitos de Negocio**

- **Objetivo principal:** Lanzar un sitio web que permita a clientes contratar profesionales del desarrollo de código y mejorar la empleabilidad en el sector de manera remota.
- **Alcance:** Catálogo de profesionales, profesionales favoritos.
- **Público objetivo:** particulares del sector tecnológico, pequeñas y grandes empresas.

**2. Requisitos Funcionales**

- **RF01 - Registro/Login:** El sistema permitirá a los usuarios registrarse mediante correo electrónico y contraseña. Habiendo usuarios contratistas y usuarios devs que ofrecen servicios.
- **RF02 - Creación de perfil de entidad** : Un usuario promedio o una empresa crea un perfil con su información
- **RF03 - Catálogo:** Los empleadores podrán filtrar los desarrolladores disponibles por lenguajes y valoración.
- **RF04 - Búsqueda:** El sitio incluirá un buscador predictivo en la barra superior.
- **RF05 - Creación de perfiles de un proyecto:** El contratista podrá crear “anuncios” con la información necesaria y los requisitos mínimos para un determinado proyecto.
- **RF06 - Inscripción a proyectos:** Aquellos usuarios que quieran participar en el proyecto podrán inscribirse en los mismos a través de un botón si cumplen los requisitos mínimos.
- **RF07 - Gestión de incidencias:** Aquellos usuarios que tengan algún problema o quieran comunicarse con nosotros, podrán hacerlo a través de una página dedicada indicando la razón de comunicación y una breve descripción de lo que desean.


## 3. Mockups 

### 3.1 Página de [Home](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Home.png)

Es uno de los mockups más importantes en el sitio web. Se ha optado por un  
diseño bastante genérico, pero completo de información donde el usuario puede ir  
a cualquier parte del sitio web.  

Existe un **Header**, el cuál contiene:  
- El botón para ir al Home  
- Cuatro desplegables con filtros rápidos de búsqueda  
- Barra de búsqueda, para dar la posibilidad al usuario de buscar con exactitud  
- Botón para crear proyecto  
- Logo de usuario  
    - Si no está registrado, le manda a la página para su registro  
    - Si está registrado, le manda a su perfil  

Si se avanza justo debajo del banner, se encuentran los tres "Devs" en trending  
junto con un botón que inicia una búsqueda de freelancers.  

Seguidamente, se encuentran los tres proyectos más relevantes del momento  
junto con su respectivo botón para búscar proyectos de forma sencilla.  

Por último, está el **Footer**, con información básica sobre quienes somos,  
página de incidencias, e información sobre RR.SS.   

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/index.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/index.css)



### 3.2 Página de [registro de usuario](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Registrar%20Usuario.png)

Es una página dedicada al registro del usuario en caso de que no tenga  
cuenta. Es un formulario típico en el que debe escribir una serie de  
datos, así cómo el tipo de usuario que es.

Sólo se puede acceder a esta página cuando el usuario no tenga cuenta.  

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/userRegistration.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/userRegistration.css)


### 3.3 Página de [Inicio de Sesión](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Inicio%20Sesión.png)

Página dedicada al inicio de sesión. El cliente tendrá la posibilidad  
de crear una cuenta o de iniciar sesión.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/login.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/login.css)


### 3.4 Página del [perfil de usuario](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Perfil%20de%20usuario.png)/[gestión de perfil](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestionar%20perfil.png)

Página dedicada al perfil del usuario cómo a la gestión del mismo.  
Se han incluido como uno, ya que son distintas páginas pero con la misma organización.  

Tiene un header y footer, además de contener información del usuario y un  
curriculum (opcional).  

En la página del perfil del usuario, se pueden mostrar los proyectos mejor valorados  
en los que ha participado.

- [Código HTML Perfil de Usuario](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/userProfile.html)
- [Código CSS Perfil de Usuario](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/userProfile.css)


- [Código HTML Gestión de Perfil](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/manageProfile.html)
- [Código CSS Gestión de Perfil](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/manageProfile.css)


### 3.5 Página de [creación de proyectos](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Creación%20de%20Proyecto.png)

Página dedicada a la creación de un proyecto, accesible desde un botón en el header.  

En esencia, es un formulario donde pide información fundamental acerca del proyecto.  
Desde el nombre, descripción, requisitos, banner...

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/createProject.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/createProject.css)

### 3.6 Página de [gestión de proyectos](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestión%20Proyectos.png)

Página dedicada a la gestión de los proyectos del usuario, accesible desde el perfil de usuario.  

Además de mostrar los proyectos que aparecían en el perfil, aparecen todos los  
proyectos que tiene el usuario. Así cómo modificar información o eliminar algún proyecto.  

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/manageProject.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/manageProject.css)

### 3.7 Página del [perfil de proyecto](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Perfil%20de%20Proyecto.png)

Página dedicada al proyecto seleccionado, mostrando toda la información necesaria.  

Se accede pulsando en un proyecto.  

Junto al banner, contiene el título, la empresa/persona que ha creado el proyecto  
y una breve descripción acerca del mismo.  

Justo debajo, están los encargados del proyecto.  

A la derecha están todos los requisitos para participar en el proyecto,  
así cómo un botón abajo para poder participar. 

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/projectProfile.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/projectProfile.css)


### 3.8 Página de [resultado de búsqueda](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Resultado%20de%20Busqueda.png)

Página dedicada al resultado de búsqueda, sea usando la  
barra de búsqueda o los filtros predeterminados.  

El usuario debe estar registrado para poder buscar.  

Cuenta con una barra lateral izquierda.  

El cuerpo de la página es el resultado de la búsqueda de proyectos.  

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/searchResult.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/searchResult.css)
  
### 3.9 Página de [gestión de incidencias](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestion%20de%20incidencias.png) y [presentación del sitio web](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Presentacion%20del%20web%20service.png)

Representan la creación de tickets por si surge algún problema y la presentación de la página web.  

Son accesibles desde el footer.

- [Código HTML Gestion de Incidencias](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/HTML/incidents.html)
- [Código CSS Gestion de Incidencias](https://github.com/texem4k/DevConnect/blob/sprint1/src/Paginas/CSS/incidents.css)


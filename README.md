# Sprint 2 | DevConnect



### Arael Jesús Almeida González
### Vidal De Leon Giménez
### Texenery Bordón Rodríguez
##  



## 1. Consideraciones previas

Antes de empezar a leer, se debe establecer las dimensiones que se consideran móvil o tablet. Estas dimensiones vienen dadas:

- Dispositivos móviles -> 0-768px
- Tablets -> 769-1028px
- Desktop -> 1029-...

En cada página se realizan carga de templates/datos mediante el script de la página respectiva, además del script  
**loadTemplate.js**.

## 2. Mockups 

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

## 3. Listado de páginas

### 3.1 Página de [Home](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Home.png)

Es la página de inicio del sitio web, cualquier usuario tiene acceso a esta página.  
Muestra los usuarios y proyectos trending. 

En caso de que se muestre en dispositivos móviles, al tener menos espacio para el contenido,  
el header se "parte" en dos, el buscador y la "hamburguesa" que muestra el resto de aspectos  
del header, como la búsqueda filtrada y ajustes de proyectos y perfil en caso de tener sesión iniciada.  

En cuanto al contenido, todo se mostrará en formato columna, de esta forma el usuario podrá  
observar los contenidos bien definidos.

En caso de tablets, el contenido se mostrará bastante similar a la versión desktop,  
pero quizás con alguna adaptación. En las tablets, no habrá hamburguesa ya que se verá bien el propio header.  

Enfatizando en la carga de datos y templates, el header/footer tienen su propio JSON con contenido que, con sus  
respectivos scripts JS, inyectan información a estos templates. Además, la propia página tiene su script  
donde se le inyecta el contenido de texto y se modifican los templates implicados.  

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/index.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/index.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/index.js)



### 3.2 Página de [registro de usuario](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Registrar%20Usuario.png)

Es una de las páginas que por supuesto no puede fallar, y que además es un formulario.  

En cuanto a los aspectos responsive, para dispositivos móviles se ajusta en contenido al centro usando la misma distribución  
de campos que en versiones de Tablets y Desktop, teniendo éstas dos últimas la misma distribución con apenas variaciones en  
el contenido.

Para la carga de datos, la página contiene su propio script que cambia el contenido de cada campo, diversos fetchs a JSON  
y entre otros. Uno de estos fetch busca en los usuarios registrados, verificando si el nombre de usuario escrito es válido  
o no.  

Por otro lado para la carga de templates, se usan dos template, el footer y el campo de escritura.  

Para validaciones, como la página es un formulario, se han realizado validaciones tanto HTML y de feedback en JS. Por la parte  
de HTML, se han usado los atributos típicos de input, tales como _required_, _type_, _minlength_ y entre otros. El feedback  
son validaciones en JS que en función del tipo de input que haya escrito el usuario, mostrará un mensaje u otro.

En caso de querer hacer pruebas, se puede visualizar el JSON de usuarios, donde cada uno tiene su nombre de usuario asignado.  
Por ejemplo, Tony Stark tiene el nombre de usuario **IronTony**.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/userRegistration.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/userRegistration.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/userRegistration.js)


### 3.3 Página de [Inicio de Sesión](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Inicio%20Sesión.png)

Página dedicada al inicio de sesión. El cliente tendrá la posibilidad de crear una cuenta o de iniciar sesión.  

Esta página apenas tiene elementos responsive, al ser un contenido centrado y pequeño, pues no requiere demasiado cambios  
mediante media-query.

La carga de datos en esta página es algo más simple, siendo un fetch a un JSON con los usuarios registrados y el cambio de  
contenido mediante el script de JavaScript de la página. Los templates cargados han sido los campos a rellenar y los botones.  

En el caso de validaciones, es más simple que el registro de usuario. Verificando que el correo/contraseña exista, que el  
formato del correo sea el correcto y lo mismo con la contraseña.  

Al igual que en la página anterior, para verificar que funciona se puede introducir el par correo/contraseña asignado a  
Tony Stark, **gmailuserTS@gmail.com/Ts-12345678**, para verificar que deja hacer login. En caso de querer probar con otros  
usuarios el login, el JSON de usuarios dispone de varios usuarios con correo/contraseña disponibles para comprobar.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/login.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/login.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/login.js)


### 3.4 Página del [gestión de perfil](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestionar%20perfil.png)

Página dedicada al perfil del usuario cómo a la gestión del mismo. Solo accesible al tener sesión iniciada.

En esta página, al haber mucho contenido que debe ser visualizado, se han usado media-query para ajustar los campos rellenables  
y los tópicos del usuario, centrando el contenido en la medida de lo posible para móvils y tablets. En caso de desktop, todo  
el contenido se encuentra separado y dividido en varias columnas para mayor comodidad.

En la carga de datos, se hace un fetch al JSON de usuarios buscando la información del usuario, mostrando la información  
, como el nickname, correo o los tópicos asociados, aunque todos los campos son modificables. La carga de templates en ésta  
página es extensa, cuenta con header/footer, campos para escribir, botones, selección de tópicos y el banner.  

La gestión del perfil podría considerarse un formulario, debido a la modificación de datos del usuario. En este sentido,  
se verifica que el nombre de usuario y correo no esté en uso, así como no poder guardar los cambios si no hay al menos un lenguaje y  
un idioma.



- [Código](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/manageProfile.html)
- [Código](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/manageProfile.css)
- [Código](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/manageProfile.js)


### 3.5 Página del [perfil de usuario](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Perfil%20de%20usuario.png)

Página dedicada a la visualización del perfil del usuario.

En esta página, al igual que en la página anterior, se han usado media-query para ajustar el contenido según el dispositivo.  

En la carga de datos, se hace un fetch al JSON de usuarios y al de proyectos, para mostrar toda su información.  
La carga de templates es la misma que en el resto de páginas, cargando la gran mayoría de la página anterior.

A diferencia de la gestión del perfil de usuario, no hay cambios de información por lo que, no es un formulario.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/userProfile.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/userProfile.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/userProfile.js)




### 3.6 Página de [creación de proyectos](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Creación%20de%20Proyecto.png)

Página dedicada a la creación de un proyecto, accesible desde un botón en el header.  

La media-query usada para dispositivos móvil hace que todo el contenido se vea en formato columna, mientras que en tablet y  
desktop se distribuye un poco más los campos pero que de igual manera, siguen centrados.  

Para evitar proyectos con el mismo nombre, se carga el JSON de proyectos mediante fetch para verificar si realmente el nombre  
está siendo utilizado o no. Además, se carga el JSON asoaciado a los tópicos, para que el usuario añada los tópicos que crea  
conveniente a su proyecto.  

Los templates cargados han sido los campos input y el footer.  

Al ser un formulario, se hace la validación del nombre como se dijo previamente, el nº de miembros siendo el mínimo 1 y  
la selección de tópicos, debiendo seleccionar al menos un idioma y un lenguaje. Para verificar que funciona, se puede usar  
cómo nombre de proyecto _ArrowTrack - app de seguimiento deportivo_, que es un proyecto ya creado por lo que no deberá  
dejar crearlo. Para verificar tópicos, simplemente vale con jugar un poco, deberá poder crear proyecto siempre y cuando  
se elijan un idioma y un lenguaje, como mínimo.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/createProject.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/createProject.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/createProject.js)

### 3.7 Página de [gestión de proyectos](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestión%20Proyectos.png)

Página dedicada a la gestión de los proyectos del usuario, accesible desde el perfil de usuario.  

La página se adapta a las dimensiones de móvil y tablet por las media-query, dejando el contenido en columna a medida que  
se reduce el tamaño.

Para la carga de datos y como es lógico, se realiza un fetch a los proyectos del usuario, mostrando estos. Para los templates,  
se usan varios tales cómo header/footer y paginationComponent (navegador numérico para avanzar por páginas).


- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/manageProject.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/manageProject.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/manageProject.js)

### 3.8 Página del [perfil de proyecto](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Perfil%20de%20Proyecto.png)

Página dedicada al proyecto seleccionado, mostrando toda la información necesaria.  

Gracias a las media-query, el contenido disperso de desktop y tablet se ve reducido y en formato columna para mejor visión  
en móviles.

La carga de datos es obvia, cargando información desde el JSON de proyectos para el proyecto respectivo, obteniendo todo tipo de  
información. Para los templates, se cargan varios, header/footer, cardGrid(Grupo de tarjetas) y topicGrid(Grupo de tópicos de la barra derecha).

Justo debajo, están los encargados del proyecto.  

A la derecha están todos los requisitos para participar en el proyecto,  
así cómo un botón abajo para poder participar. 

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/projectProfile.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/projectProfile.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/projectProfile.js)


### 3.9 Página de [resultado de búsqueda](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Resultado%20de%20Busqueda.png)

Página dedicada al resultado de búsqueda, sea usando la barra de búsqueda o los filtros predeterminados.  

Los aspectos responsive mediante media-query ayudan a restructurar el contenido, haciendo el contenido más pequeño pero  
sin perder la organización en tablets y usando la estructura en columna de siempre en móviles, 

Se cargan datos del JSON de proyectos, mostrando el nombre y la descripción en pantalla, además de la típica carga de contenido  
con el script de la página respectivo. Por otro lado, la carga de templates son los típicos, header/footer.



- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/searchResult.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/searchResult.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/searchResult.js)
  
### 3.10 Página de [gestión de incidencias](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Gestion%20de%20incidencias.png) y [presentación del sitio web](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Presentacion%20del%20web%20service.png)

Representan la creación de tickets por si surge algún problema.

Como en el resto de páginas, con la media-query a móvil reestructura el footer y el header para el dispositivo. Desktop y tablet  
son bastante similares, pero no totalmente igual.

En esta página especificamente no hay carga de JSON excepto header/footer, que se cargan siempre y cuando la págian use estos templates.  
A diferencia de esto, sólo se cambia el contenido con su JavaScript asociado. Los templates, como ya se mencionó, son header/footer.  

Del sitio web, es el formulario más simple, que simplemente verifica que los campos no estén vacíos y que cumplan ciertas  
restricciones de longitud de mensaje.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/incidents.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/incidents.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/incidents.js)


### 3.11 Página de [presentación del sitio web](https://github.com/texem4k/DevConnect/blob/sprint1/mockups/Presentacion%20del%20web%20service.png)

Representan la creación de tickets por si surge algún problema y la presentación de la página web.

En esta página, al haber sólo texto, el media-query es sencillo y no parece cambiar demasiado, sólo, como en el resto de páginas,  
el cómo se ve el header y footer para móviles.  

De carga de datos, es la única página con JSON propio, posee la carga de JSON del header/footer y de su JSON, además de su   
propio JS para cambiar contenido.
- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/HTML/aboutUs.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/CSS/aboutUS.css)
- [Código JS](https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/aboutUS.js)


## 4. Localización de JSON y JS

Los JSON están alojados en el directorio https://github.com/texem4k/DevConnect/blob/sprint2/src/backend/, este contiene:
- Proyectos -> Descripción, Nombre, Tecnologías, el creador y entre otros
- aboutUS -> Contenido importante de la página _Sobre Nosotros_
- headerTopics -> Filtros del header, que podrán cambiar en función del nº de proyectos de los lenguajes disponibles.
- topics -> Contiene todos los tópicos para usuario y proyecto, lenguajes de programación, tecnologías e idiomas
- users -> Lista de todos los usuarios de prueba, cada uno con su información.
- footer -> Contenido del footer, que es posible que cambie

Todas las páginas tienen su JS asociado, e incluso algunos templates en específico. Los directorios son:
- Páginas -> https://github.com/texem4k/DevConnect/blob/sprint2/src/Paginas/JS/
- Templates -> https://github.com/texem4k/DevConnect/blob/sprint2/src/templates/JS/
- utils -> https://github.com/texem4k/DevConnect/blob/sprint2/src/utils/
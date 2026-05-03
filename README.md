# Sprint 3 | DevConnect



### Arael Jesús Almeida González
### Vidal De Leon Giménez
### Texenery Bordón Rodríguez
##  

## 1. Cambios realizados y consideraciones

Se ha adaptado el proyecto completo al framework Angular, y se ha implementado una base de datos  
de Firestore donde almacenar y obtener información.

En lugar de usar Javascript, se usan Typescripts, creando componentes ordenados y estructurados,  
divididos entre páginas y templates.

Por último, y tal cómo se explica en el PPTX, tenemos 2 tipos de componentes, las páginas y los templates.  
Estos están organizados en los directorios **/src/app/pages** y **src/app/shared/components**.

Para probar el CRUD, deberá estar autenticado, a continuación se muestran las credenciales de algunos usuarios:  
  - Tony Stark: gmailuserTS@gmail.com / Ts-12345678
  - Peter Parker: peterparker@gmail.com / Pp-987654321
  - Natasha Romanoff: natasha.romanoff@gmail.com / Nr-11223344
## 2. Componentes más relevantes

### 2.1 Create-Project

Página con formulario para crear un proyecto u editarlo, dependiendo de donde se acceda. Usa componentes templates  
como search-topics y get-input-text para mostrar un buscador de tópicos y una forma de representar fácilmente   
un campo de entrada de datos. Al crear un proyecto, se crea el proyecto a la base de datos.

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/create-project/create-project.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/create-project/create-project.css)
- [Código TS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/create-project/create-project.ts)


### 2.2 Incidents

Página con formulario pequeño para enviar posibles errores o fallos a los devs. Estos se envian a la base de datos.  

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/incidents/incidents.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/incidents/incidents.css)
- [Código TS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/incidents/incidents.ts)


### 2.3 Login

Es el componente accesible desde el header siempre y cuando no haya sesión iniciada. Representa un  
formulario pequeño típico correo/contraseña, con las validaciones respectivas de formato y no null.  

Se puede probar con los valores anteriormente escritos de correo/contraseña

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/login/login.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/login/login.css)
- [Código TS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/login/login.ts)


### 2.5 Registro de usuarios

Es el componente accesible desde el login. Representa un formulario pidiendo todo tipo de información,  
incluyendo las validaciones respectivas de formato y no null.

Se puede probar con los valores anteriormente escritos de correo/contraseña

- [Código HTML](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/user-registration/user-registration.html)
- [Código CSS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/user-registration/user-registration.css)
- [Código TS](https://github.com/texem4k/DevConnect/blob/sprint3/src/app/pages/user-registration/user-registration.ts)


## 3 Gestión del CRUD

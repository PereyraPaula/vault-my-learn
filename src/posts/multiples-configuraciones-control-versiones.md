---
layout: "layouts/single-post.njk"
title: "Gestionar múltiples configuraciones de servicios de control de versiones (GIT)"
date: 2025-01-07
tags: [git]
description: "Para cualquier sistema operativo y sin conflictos."
---

Este blog se creó a partir de mi necesidad de tener más ordenadas las diferentes configuraciones de los servicios de control de versiones. Yo utilizo Gitlab para mi trabajo, Github para proyectos propios que quiero compartir, y [Gogs](https://gogs.io) (que inició como prueba pero terminó siendo un lugar donde guardo configuraciones y backup de notas privadas junto con un familiar).

A lo que voy, necesito tenerlo separado, porque sino es un lío, y si hay que realizar una modificación, si no se sabe bien qué se está tocando, se puede ocasionar un desastre 😅.

Aquí tienes algunos pasos que puedes seguir, porque estuve investigando y es bastante sencillo.

Importante saber: Git utiliza un archivo de configuración global (`~/.gitconfig`) donde puedes establecer parámetros que afectarán a todos los repositorios. Sin embargo, para manejar diferentes servicios, puedes establecer configuraciones específicas para cada repositorio. Esto incluye las credenciales (usuario y correo electrónico) y el remoto.

## **Un servicio**

### Configuración global

Normalmente, si tienes un solo servicio, lo mejor es tener configuraciones globales, puedes establecer tu nombre y correo electrónico en tu archivo global `.gitconfig`. Por ejemplo:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

Y se usará esa configuración para todos los repositorios que crees. Es más fácil.

## **Más de un servicio**

### Opción 1: Configuración específica para cada repositorio

Puedes, aunque es más manual, para cada repositorio, establecer las configuraciones específicas que necesites.
Navega a la carpeta del repositorio y ejecuta:

```bash
cd /ruta/a/tu/repositorio
git config user.name "Tu Nombre para Gogs"
git config user.email "tu.email@gogs.com"
```

Haz lo mismo para los repositorios de GitHub y GitLab cuando trabajes en ellos.
Lo tienes que hacer una vez, cuando creas el repositorio y vas a subir un cambio a remoto, y luego para los demás tomará la configuración que hayas puesto.

**Importante: Configura los remotos**

Cuando añadas un nuevo remoto, asegúrate de que apunte al servidor correcto. Por ejemplo, para un repositorio de Gogs, puedes añadir el remoto así:

```bash
git remote add origin https://gogs.ejemplo.com/usuario/repositorio.git
```

Para GitHub o GitLab, haz lo mismo:

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

Así cuando hagas `git push origin rama` se subirá al repositorio referenciado en el `git remote` y con las configuración hecha a nivel repositorio.

### Opción 2: Uso de SSH (opcional pero recomendado)

Si usas SSH para autenticarte, puedes crear diferentes claves SSH para cada servicio y configurar el archivo `~/.ssh/config` para gestionar las conexiones de forma más sencilla.

1. **Generar claves SSH** (si no tienes):

```bash
ssh-keygen -t rsa -b 4096 -C "tu.email@ejemplo.com"
```

2. **Agregar las claves al agente SSH**:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa_gogs
ssh-add ~/.ssh/id_rsa_github
ssh-add ~/.ssh/id_rsa_gitlab
```

3. **Configurar el archivo `~/.ssh/config`**:

```plaintext
# Gogs
Host gogs
    HostName gogs.ejemplo.com
    User git
    IdentityFile ~/.ssh/id_rsa_gogs

# GitHub
Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github

# GitLab
Host gitlab
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_rsa_gitlab
```

4. **Usar los remotos con las configuraciones de SSH**:

En lugar de usar las URL HTTPS, puedes usar las configuraciones de SSH:

```bash
git remote add origin gogs:usuario/repositorio.git
git remote add origin github:usuario/repositorio.git
git remote add origin gitlab:usuario/repositorio.git
```

Con estos pasos, deberías poder gestionar tus repositorios en Gogs, GitHub y GitLab desde la misma máquina sin que se interfieran entre sí. Asegúrate de siempre estar en el directorio correcto antes de ejecutar comandos de Git y de haber configurado adecuadamente las credenciales y remotos para cada proyecto.

---

**Bonus**:
Hablando de múltiple, pero en este caso de otras cuentas. Si quieres subir archivos (modificaciones) al repositorio de otra persona, puedes usar Git con credenciales temporales sin afectar tu configuración global.
**Tienes que tener en cuenta que esto es para cosas puntuales.**

Usando la URL con credenciales directamente:

```bash
git remote set-url origin https://username:password@github.com/usuario/repositorio.git
```

Donde:
**username**: el nombre de usuario de la otra persona
**password**: un token de acceso personal de GitHub de la otra persona (no la contraseña directa)

Para crear un token de acceso lo puedes seguir desde [acá ](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) de manera muy simple, y con solo darle al check en "repo" (darle acceso a las acciones sobre los repositorios), ya se pueden subir los cambios.

---

Si hay algún comando que esté incorrecto, o quieres aportar en los comentarios, eres bienvenido :)

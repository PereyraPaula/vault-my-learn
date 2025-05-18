---
layout: "layouts/single-post.njk"
title: NPM Link
date: 2024-06-23
tags: [node, npm]
description: Como trabajar con una aplicación y dependencia al mismo tiempo.
---

Este comando de node lo descubrí porque en el trabajo tenemos un paquete para manejar un módulo de la aplicación que creamos, y este modulo lo cargamos desde un paquete que manejamos aparte.

Hasta hace unos días, la manera en que agregaba nuevas cambios a este paquete, era: hacer estos cambios, subirlos y publicar una nueva versión de la librería, y luego actualizaba el paquete en la aplicación principal, y verificaba que todo funcionara bien.

Otra opción, sobre todo en cambios más chicos o puntuales, era realizar cambios en el el `node_modules` para verificar en la misma aplicación que funcionara todo bien y luego copiaba manualmente los cambios al repositorio de la dependencia una vez que haya terminado. Pero hay un enfoque mucho más claro: `npm link`.

Esta manera es mucho más sencilla porque de manera local, ya puedes ver los cambios que vas realizando en la librería en la aplicación en la que la usas.

### Uso

1) Se crea un enlace simbólico global para una dependencia con enlace npm. Seria un acceso directo que apunta a otro directorio o archivo de su sistema.  
2) Decirle a la aplicación que este enlace simbólico global con `npm link nombre-dependencia`.

```bash
cd path/to/your/module
npm link # Crea un enlace simbólico global 

cd path/to/your/project
npm link <module_name> # Linkea el módulo al proyecto
```

### Escenarios avanzados de enlace npm

Otro escenario, uno más complejo del ejemplo dicho anteriormente, podría ser vincular múltiples módulos locales o administrar dependencias entre estos módulos vinculados.

Para este caso también podemos usar `npm link`

#### Multiples módulos locales
Estás trabajando con dos modulos: module-a y module-b, donde module-b depende de module-a. Así se vincularía:

```bash
cd path/to/module-a
npm link # Registra el module-a globalmente

cd ../module-b
npm link # Registra el module-b globalmente
npm link module-a # Links module-b with module-a
```

Con esta tecnica se puede desarrollar módulos que tienen dependencias entre sí, lo que permite pruebas e iteración en tiempo real.

#### Gestionar dependencias entre modulos vinculados
Un desafío común es garantizar que todos los módulos vinculados usen las últimas versiones entre sí. Para manejar esto, hay que usar regularmente `npm update` en cada directorio de módulos para obtener los últimos cambios de las dependencias. Además, re-correr `npm link` después de las actualizaciones asegura de que se está usando la versión más actual.

## Alternativas al enlace npm
Aunque `npm link` da una solución sólida para el desarrollo y las pruebas de módulos locales, hay otros enfoques para diferentes necesidades y escenarios. No está de más describirlas, porque puede ayudar a elegir la mejor herramienta para los requisitos de sus proyectos. 

- `npm pack` <br>
Permite ver el paquete generado antes de subirlo y que se publique. La salida es un archivo tarball (my-module-1.0.0.tgz) que se puede instalar en cualquier proyecto, lo que le permite probar el módulo como si se hubiera descargado del registro npm. Luego para instalar el paquete sería hacer: `npm install /path/to/my-module-1.0.0.tgz`
- Herramientas de terceros:  <br>
`yarn link` o [Lerna](https://lerna.js.org/) parecen ser populares para desarrolladores que hacen monorepos o que administran múltiples módulos interdependientes.

## Comparación entre npm link, npm pack y herramientas de terceros

Hice esta tabla para que puedas tener una referencia rápida de cual elegir, y cuales serían las ventajas y desventajas.

<data-table data='[{"utilidad": "npm link", "ventaja": "Desarrollo y las pruebas en tiempo real (Cambios inmediatos)", "desventaja": "Resulta complejo si se tienen muchos enlaces simbólicos globales y múltiples dependencias"}, {"utilidad": "npm pack", "ventaja": "Ideal para las pruebas finales (cercano a la implementación real)", "desventaja": "Requiere un poco más de esfuerzo manual para usarlo bien."}, {"utilidad": "Herramientas de terceros", "ventaja": "Adecuados para proyectos complejos", "desventaja": "- Características avanzada </br>- Curva de aprendizaje </br>- Requisitos de configuración"}]' font="Iosevka"></data-table>

<hr style="height: .5px" />

Enlaces útiles:
[Medium](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557) |
[ioflood](https://ioflood.com/blog/npm-link/)
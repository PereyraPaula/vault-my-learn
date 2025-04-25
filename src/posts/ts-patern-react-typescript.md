---
layout: "layouts/single.njk"
title: "ts-pattern - Explicado de manera sencilla"
date: 2025-04-21
tags: [react, javascript, typescript]
description: "Poder trabajar con condicionales de manera más limpia visualmente."
---

**ts-pattern** es una librería de TypeScript para hacer pattern matching, que es una técnica para comparar estructuras de datos de manera elegante y segura. Facilita el manejo de datos complejos, eliminando muchos if y switch anidados.

Con ts-pattern puedes:

<ul style="list-style: none">
  <li>✅ Escribir código más limpio y seguro.</li>
  <li>✅ Evitar errores al olvidarte de manejar un caso específico.</li>
  <li>✅ Tener mejor inferencia de tipos en TypeScript.</li>
</ul>

### Instalación

Para usar ts-pattern, primero instálalo en tu proyecto:

```bash
npm install ts-pattern
```

También puedes usar yarn o pnpm:

```
yarn add ts-pattern
```

```
pnpm add ts-pattern
```

### 🟨 Ejemplo Básico: Reemplazando un switch

Digamos que tenemos un estado en una aplicación:

```jsx
type Estado = "cargando" | "exito" | "error";

const estado: Estado = "exito";
```

```js
switch (estado) {
  case "cargando":
    console.log("Cargando datos...");
    break;
  case "exito":
    console.log("¡Datos cargados con éxito!");
    break;
  case "error":
    console.log("Hubo un error 😢");
    break;
}
```

Con ts-pattern, el código es más limpio y seguro:

```js
import { match } from "ts-pattern";

const mensaje = match(estado)
  .with("cargando", () => "Cargando datos...")
  .with("exito", () => "¡Datos cargados con éxito!")
  .with("error", () => "Hubo un error 😢")
  .exhaustive(); // Asegura que cubrimos todos los casos

console.log(mensaje);
```

¿Qué hace este código?
`match(estado)` compara el valor de estado con diferentes patrones ("cargando", "exito", "error") y ejecuta la función correspondiente.

✅ Ventaja: Si olvidamos manejar un caso, ts-pattern nos avisa en tiempo de compilación.

### 🟨 Ejemplo con Objetos: Manejo de Errores

Imagina que estás manejando respuestas de una API con diferentes formatos:

```jsx
type Respuesta =
  | { tipo: "ok", data: string }
  | { tipo: "error", mensaje: string };

const respuesta: Respuesta = { tipo: "error", mensaje: "No encontrado" };
```

Con if haríamos algo así:

```ts
if (respuesta.tipo === "ok") {
  console.log(`Datos: ${respuesta.data}`);
} else {
  console.log(`Error: ${respuesta.mensaje}`);
}
```

Con ts-pattern, el código es más elegante:

```ts
const resultado = match(respuesta)
  .with({ tipo: "ok" }, (r) => `Datos: ${r.data}`)
  .with({ tipo: "error" }, (r) => `Error: ${r.mensaje}`)
  .exhaustive();

console.log(resultado);
```

¿Qué hace este código?
Compara respuesta con los patrones { tipo: "ok" } y { tipo: "error" }.
Accede a `r.data` o `r.mensaje` automáticamente sin necesidad de hacer un if.

✅ Ventaja: TypeScript infiere el tipo correctamente sin necesidad de hacer as o comprobaciones manuales.

#### Uso con Expresiones Regulares o Rango de Valores

También puedes hacer matching con números, rangos o expresiones regulares. Por ejemplo, clasificamos edades:

```ts
const edad = 25;

const categoria = match(edad)
  .when(
    (e) => e < 18,
    () => "Menor de edad"
  )
  .when(
    (e) => e >= 18 && e < 65,
    () => "Adulto"
  )
  .when(
    (e) => e >= 65,
    () => "Tercera edad"
  )
  .otherwise(() => "Desconocido");

console.log(categoria); // "Adulto"
```

¿Qué hace este código?
Usa `.when()` para definir condiciones personalizadas.
Usa `.otherwise()` como caso por defecto.

✅ Ventaja: Es más declarativo que usar múltiples if.

### 🟨 Tipar `match`

Se puede tipar de forma segura gracias a TypeScript. Normalmente, TypeScript infiere los tipos automáticamente, pero si queremos asegurarnos de que solo acepte ciertos valores, podemos hacerlo manualmente.

Hay dos formas principales de tiparlo:

1. **Tipado automático (sin definir el tipo)**
   Cuando pasamos un valor a match, TypeScript ya infiere el tipo:

```ts
import { match } from "ts-pattern";

const estado = "cargando" as "cargando" | "exito" | "error";

const mensaje = match(estado)
  .with("cargando", () => "Cargando datos...")
  .with("exito", () => "¡Datos cargados con éxito!")
  .with("error", () => "Hubo un error 😢")
  .exhaustive();

console.log(mensaje);
```

¿Qué pasa aquí?
Como estado está tipado como "cargando" | "exito" | "error", TypeScript ya valida que match solo acepte esos valores.
Si olvidamos un caso, TypeScript dará error con .exhaustive().
✅ Ventaja: No necesitamos definir el tipo manualmente.

2. **Tipado explícito (definiendo el tipo)**
   Si queremos ser más estrictos, podemos tipar manualmente match con match<Tipo>():

```ts
type Estado = "cargando" | "exito" | "error";

const estado: Estado = "exito";

const mensaje = match<Estado>(estado) // 👈 Aquí forzamos el tipo
  .with("cargando", () => "Cargando datos...")
  .with("exito", () => "¡Datos cargados con éxito!")
  .with("error", () => "Hubo un error 😢")
  .exhaustive();

console.log(mensaje);
```

✅ Ventaja: Si estado no tiene el tipo correcto, TypeScript mostrará error.

3. **Extra: Tipado en Objetos**
   Cuando usamos objetos, también podemos tipar match para asegurar que todas las propiedades sean correctas.

Ejemplo con un objeto Respuesta:

```ts
type Respuesta =
  | { tipo: "ok"; data: string }
  | { tipo: "error"; mensaje: string };

const respuesta: Respuesta = { tipo: "ok", data: "Hola" };

const resultado = match<Respuesta>(respuesta) // 👈 Tipamos aquí
  .with({ tipo: "ok" }, (r) => `Datos: ${r.data}`)
  .with({ tipo: "error" }, (r) => `Error: ${r.mensaje}`)
  .exhaustive();

console.log(resultado);
```

✅ Ventaja:

- TypeScript detecta automáticamente si olvidamos manejar un tipo de Respuesta.
- `r` dentro de cada .with() ya tiene el tipo correcto (`r.data` o `r.mensaje`).

---

¿Necesito tipar match?

- No siempre. TypeScript ya infiere los tipos en la mayoría de los casos.
- Si queremos asegurarnos, podemos usar `match<Tipo>()`.
  Lo mejor: `.exhaustive()` siempre verifica que no falte ningún caso.

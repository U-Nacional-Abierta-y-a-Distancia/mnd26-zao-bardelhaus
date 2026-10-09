# Carpeta docs: código fuente de *Guardianes del morichal*

## Cómo ver el producto

El producto está **desplegado en un servidor** y se accede desde este enlace:

### 👉 https://narrativa-morichal.bardelhaus.com/

No es necesario descargar ni ejecutar nada para verlo: basta con abrir el enlace en un navegador (computador o celular).

> Esta carpeta **no** funciona como demo de GitHub Pages: la aplicación necesita su servidor (backend) para guardar los registros de hogares y los reportes, y para mostrar los datos de los sensores. Por eso el producto se consulta en el enlace anterior.

## Qué hay en esta carpeta

Se comparten **dos carpetas con el código fuente** del producto:

| Carpeta | Qué es | Tecnología |
|---|---|---|
| `maraton-morichal/` | **Frontend**: la página web que ve el visitante (portada, *Conoce mi casa* con el Genially y las escenas interactivas, *Estado de mi casa* con los datos de los sensores y *Ser guardián del morichal* con el registro de hogares y los reportes). | Angular 21 |
| `morichal-back/` | **Backend**: el servidor (API) que guarda los hogares registrados y los reportes, y entrega las mediciones de los sensores de temperatura y humedad. | Java · Spring Boot |

El frontend se comunica con el backend a través de estos servicios:

| Servicio | Para qué sirve |
|---|---|
| `GET /api/datos-morichal` | Últimas mediciones de los sensores (dentro y fuera del morichal). |
| `GET /api/registros-hogar` | Hogares registrados y totales por compromiso (tablero de la vereda). |
| `POST /api/registrar-hogar` | Registra un hogar guardián con sus compromisos. |
| `POST /api/registrar-reporte` | Registra un reporte de basura, quema o tala, con foto opcional. |

---

No borre el archivo `.nojekyll`.

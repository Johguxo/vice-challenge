# Ideas y apps de ViceApp

**Nombres provisionales:** la plataforma se llama **ViceApp**. Sus apps son **Retos** (`/challenges`, hoy con la marca "Vice Challenges") y **Diario** (`/journal`). Las rutas van en inglés y lo que lee el usuario, en español.

> Este archivo guarda las ideas que vamos a probar. Cada idea es una **app** dentro de la misma web: comparte la cuenta, el diseño (`docs/DESIGN.md`), Supabase y el deploy.
> Para añadir una idea, copia la plantilla del final. Si una idea arranca, pasa de "Idea" a "En construcción" y luego a "Viva".

## Cómo se organiza la web

| Ruta          | Qué es                                                     | Estado |
| ------------- | ---------------------------------------------------------- | ------ |
| `/`           | Portada. Hoy muestra el reto semanal; pasará a ser el hub. | Viva   |
| `/challenges` | Retos: explorar, detalle, reglas y ranking                 | Viva   |
| `/journal`    | **Diario**: las locuras y logros de cada jugador           | Idea   |

Reglas de rutas:

- **Una carpeta por app** en `app/<app>/`. Las URLs van sin prefijo `/app/`: los enlaces se comparten en TikTok y Discord, y cuanto más cortos, mejor.
- Las rutas antiguas no se rompen: si una URL cambia, se añade un `redirect` permanente en `next.config.ts`. Por ejemplo, `/retos` redirige a `/challenges`.
- El código compartido entre apps (cuenta, perfil, escena del hero, tarjetas para compartir) vive en `components/` y `lib/`. Lo que es de una sola app vive junto a su ruta.
- Cuando haya dos apps vivas, la portada pasa a ser el hub: una tarjeta grande por app y el contenido más reciente de cada una.

## Diario (`/journal`)

**Estado:** Idea
**En una frase:** un diario público donde cada jugador va contando lo que le pasa en GTA VI mientras juega: locuras, momentos épicos, fails y retos superados.

### Por qué

- Retos da picos de actividad cuando sale un reto. El Diario da algo que contar **todos los días**, aunque no estés compitiendo.
- Es contenido que la gente ya graba y sube a redes. Aquí queda ordenado en el tiempo y con su historia.
- Se conecta con Challenges: cuando te aprueban una marca, aparece sola en tu diario como un hito.

### Primera versión (lo más simple que se pueda ver)

1. **Entrada de diario:** texto corto, como mucho una captura o un enlace a un clip (YouTube, Twitch, TikTok o Streamable), fecha y etiquetas opcionales (`#persecución`, `#fail`, `#playa`…).
2. **Mi diario** en `/journal/[username]`: una línea de tiempo vertical con las entradas agrupadas por día de partida, tipo bitácora.
3. **Feed** en `/journal`: lo último de toda la comunidad.
4. **Hitos automáticos:** un reto completado y aprobado aparece en el diario con un estilo especial, como un sello o una pegatina.
5. **Compartir:** cada entrada tiene su URL `/journal/e/[id]` y una imagen OG propia.

### Fuera de la primera versión

Comentarios, seguidores, notificaciones, rachas y vídeo subido a nuestro propio almacenamiento.

### Ideas de diseño

- Estética de **cuaderno o álbum de viaje** sobre el atardecer: entradas como polaroids o recortes pegados con cinta, fechas en la fuente marker y pegatinas para los hitos.
- La línea de tiempo se anima con scroll (`reveal`), siguiendo las reglas de movimiento de `DESIGN.md` §6.
- Las mismas reglas de propiedad intelectual: nada de arte oficial, logos ni personajes. Las capturas son del propio jugador.

### Datos (borrador para Supabase)

`journal_entries` (id, user_id, body, media_url, clip_url, tags text[], played_on date, challenge_submission_id nullable, visibility `public|private`, created_at).

- RLS: cualquiera lee las entradas públicas; solo el autor crea, edita y borra las suyas.
- Las entradas reutilizan `reports` para moderar.

### Decisiones pendientes del equipo

- ¿Las entradas son públicas por defecto?
- Nombre definitivo. Por ahora la plataforma es "ViceApp" y esta app es "Diario"; los dos se pueden cambiar.
- Cuándo pasa la marca visible (logo, `<title>`, imágenes OG) de "Vice Challenges" a "ViceApp".

---

## Plantilla para una idea nueva

```md
## <Nombre>

**Estado:** Idea
**En una frase:** …

### Por qué

### Primera versión (lo más simple que se pueda ver)

### Fuera de la primera versión

### Ideas de diseño

### Datos (borrador)

### Decisiones pendientes del equipo
```

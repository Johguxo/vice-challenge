# Apps e ideas de CHIS Explorer

CHIS Explorer es la portada del diario de aventuras de Team Chis. Vice Challenges conserva sus rutas y su identidad en Retos. Las rutas de apps van en inglés y los textos visibles en español.

## Rutas actuales

| Ruta                   | Qué muestra                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `/`                    | Portada de CHIS Explorer, cuaderno abierto y descubrimientos destacados |
| `/journal`             | Muestra navegable de Mi diario                                          |
| `/journal/stories`     | Mural de historias y diarios de ejemplo                                 |
| `/journal/[username]`  | Diario de ejemplo de un jugador                                         |
| `/challenges`          | Portada de Vice Challenges                                              |
| `/challenges/explorar` | Catálogo de retos con filtros                                           |
| `/challenges/[slug]`   | Reglas y ranking de un reto                                             |

Cada app vive bajo `app/<app>/`. Los componentes y servicios compartidos viven en `components/` y `lib/`. Conserva los enlaces publicados con redirecciones al mover rutas.

## Etapas del diario

1. **Diario privado.** Completar Supabase Auth, crear, editar y eliminar entradas, subir capturas a almacenamiento privado y guardar recuerdos. Las nuevas entradas serán privadas por defecto.
2. **Historias de Leonida.** Publicación voluntaria, perfiles opcionales, enlaces compartibles, los controles de comunidad y exportación de páginas en formato vertical.
3. **Mi exploración.** Álbumes, lugares y categorías creados por el jugador, actividades, búsqueda y filtros.
4. **Eventos de Leonida.** Módulo independiente con inscripciones, búsqueda y una bandera de activación.

La portada y la muestra usan ilustraciones originales. El mural y los diarios por jugador usan datos de ejemplo de `lib/journal.ts`.

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

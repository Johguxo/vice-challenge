# Vice Challenges — Documento inicial del proyecto

> *Estado:* propuesta conceptual / MVP por definir
> *Nombre provisional:* Vice Challenges
> *Tipo:* plataforma web independiente de desafíos comunitarios para GTA VI
> *Modelo:* acceso gratuito, con posibilidad de donaciones voluntarias para mantenimiento.
> *Equipo:* iniciativa del Team Chis 🧀 — proyecto de la comunidad, por fans y para fans.

## 1. Resumen ejecutivo

Vice Challenges es una plataforma web donde jugadores de Grand Theft Auto VI pueden crear, descubrir, aceptar y completar desafíos dentro del mundo abierto del juego. Los participantes publican pruebas de sus intentos (capturas, vídeos y explicaciones), compiten por tiempos o logros y aparecen en clasificaciones verificadas.

La propuesta busca que la comunidad genere la mayor parte del contenido y que los resultados sean fáciles de compartir en TikTok, Instagram, Discord y otras redes sociales. El objetivo inicial no es obtener ganancias, sino construir una experiencia divertida, competitiva y con visitas recurrentes.

Importante: se trata de un proyecto de fans, no oficial ni afiliado a Rockstar Games o Take-Two Interactive.

## 2. Problema y oportunidad

Las webs de videojuegos suelen concentrarse en noticias, guías y mapas. Vice Challenges se diferenciaría al ofrecer una actividad participativa: los usuarios no solo consultan información, sino que inventan retos, intentan superarlos y comparan sus resultados.

**Propuesta de valor**

- Para jugadores: retos originales, reconocimiento y competencia amistosa.
- Para creadores de contenido: retos con enlaces que pueden compartir con sus seguidores.
- Para la comunidad: votaciones, comentarios, descubrimientos y clasificaciones.
- Para el equipo desarrollador: un proyecto real de producto, comunidad, frontend, backend y datos.

## 3. Funcionamiento principal

1. Un usuario crea un desafío con título, descripción, reglas, objetivo, dificultad, condiciones de victoria y evidencia requerida.
2. Otros jugadores descubren el desafío y deciden participar.
3. Realizan el desafío en el juego y suben su evidencia.
4. La evidencia se revisa según el nivel de verificación aplicable.
5. Los intentos aprobados entran en una clasificación, si corresponde.
6. Los participantes comparten una tarjeta de resultado y un enlace al desafío.

Ejemplo hipotético: «Consigue cinco estrellas de búsqueda, roba un vehículo y escapa sin morir ni utilizar trucos». Gana la mejor marca validada, con reglas de inicio y final claramente definidas.

## 4. Modalidades de desafíos

| Modalidad | Mecánica | Forma de destacar |
|---|---|---|
| Speed Challenge | Completar una tarea en el menor tiempo | Mejor tiempo validado |
| Impossible Challenge | Superar un reto de gran dificultad | Primeros en completarlo o menor número de intentos |
| Community Challenge | Retos creados por usuarios | Votos, participaciones y comentarios |
| Duelo entre amigos | Competición bajo reglas comunes | Ganador por criterio definido |
| Desafío semanal | Evento destacado por la plataforma | Clasificación y distintivo de temporada |

Las modalidades deben ajustarse a las mecánicas realmente disponibles en GTA VI una vez que se conozcan.

## 5. Funciones del MVP (primera versión)

**Imprescindibles**

- Página principal con desafíos destacados, recientes y populares.
- Registro e inicio de sesión de usuarios.
- Perfil público básico.
- Formulario para crear desafíos y establecer reglas.
- Página individual de cada desafío, con enlace compartible.
- Participación mediante envío de intento y evidencia.
- Estados de revisión: pendiente, aprobado y rechazado.
- Ranking por desafío para intentos verificados.
- Reportes y herramientas mínimas de moderación.

**Para una segunda versión**

- Tarjetas visuales de resultados generadas automáticamente.
- Votaciones y comentarios.
- Retos diarios/semanales y temporadas.
- Seguimiento de creadores y notificaciones.
- Duelo entre amigos.
- Distintivos, niveles y puntos sin valor monetario.
- Soporte para otros videojuegos.

## 6. Verificación y prevención de trampas

La confianza en los rankings es crítica. Una captura aislada no suele demostrar que un jugador siguió todas las reglas. Además, un temporizador de la web no verifica automáticamente lo que ocurre dentro del juego.

| Nivel | Evidencia orientativa | Aplicación |
|---|---|---|
| Comunitario | Captura y explicación | Retos casuales, sin récord competitivo oficial |
| Verificado | Vídeo continuo y revisión | Rankings por tiempo o habilidad |
| Destacado | Reglas estrictas, revisión reforzada y posibilidad de apelación | Récords y competiciones principales |

Definir para cada reto: cuándo empieza y termina, qué acciones están prohibidas, qué formato de vídeo se admite y cómo se resuelven disputas. No asumir acceso a una API oficial de GTA VI ni a telemetría del juego.

## 7. Viralidad y crecimiento orgánico

**Bucle de difusión:** Crear desafío → participar → publicar resultado → compartir enlace → atraer nuevos participantes → generar nuevos desafíos.

**Ideas para TikTok y redes**

- Vídeos cortos mostrando un reto difícil y preguntando «¿Puedes superarlo?».
- Retos de creadores de contenido contra sus seguidores.
- Rankings semanales y recopilaciones de intentos creativos.
- Tarjetas de resultados con tiempo, puesto, nombre del desafío y marca de la plataforma.
- Enlaces directos a desafíos para reducir los pasos de participación.

No inventar estadísticas de participación o porcentajes de éxito en las publicaciones.

## 8. Monetización y sostenibilidad

El acceso principal será gratuito. Podría incorporarse una página de apoyo voluntario mediante Patreon o Ko-fi para cubrir dominio, almacenamiento, alojamiento y mantenimiento.

No se recomienda incluir apuestas con dinero real, fondos comunes aportados por participantes ni premios financiados por apuestas en el MVP. Esas mecánicas pueden activar requisitos legales y regulatorios, incluso cuando existe un componente de habilidad. Como alternativa, utilizar insignias, rankings y puntos virtuales no comprables, no transferibles y no canjeables por dinero.

## 9. Arquitectura técnica

Decisión del equipo: **Next.js + TypeScript, Supabase (Postgres, Auth, Storage), desplegado en Vercel.** Ver `CLAUDE.md`.

Precauciones técnicas: controlar tamaños y tipos de archivos, proteger datos personales, establecer límites de peticiones, validar entradas en el servidor, moderar contenido y gestionar los costes de almacenar vídeos. Al principio se admite un enlace a vídeo alojado externamente, sujeto a revisión, para reducir gastos.

**Entidades de datos sugeridas**

- users/profiles: identidad, nombre público, fecha de alta y rol.
- challenges: creador, reglas, dificultad, modalidad y estado.
- submissions: desafío, participante, evidencia, tiempo declarado y estado de revisión.
- reviews: revisor, decisión, motivo y fecha.
- reports: contenido denunciado, motivo y estado.
- badges: insignias y asignaciones a usuarios (fase posterior).

## 10. Experiencia de usuario

La experiencia debe ser sencilla desde el móvil:

1. Descubrir un reto sin necesidad de registrarse.
2. Leer reglas claras y ver ejemplos de evidencia.
3. Registrarse únicamente cuando sea necesario enviar un intento o crear un reto.
4. Publicar la prueba y consultar el estado de revisión.
5. Ver el ranking y compartir el resultado.

Diseño visual propio, rápido y accesible, inspirado en la energía del mundo abierto sin copiar la identidad oficial del juego. Ver `docs/DESIGN.md`.

## 11. Moderación, seguridad y propiedad intelectual

- Reglas contra acoso, spam, contenido ilegal y trampas.
- Denuncias, apelaciones y capacidad de retirar contenido.
- Políticas claras para capturas y vídeos subidos por usuarios.
- Respeto a los derechos de autor, marcas y políticas de contenido de Rockstar/Take-Two.
- Aviso visible de proyecto no oficial.
- Política de privacidad, términos de uso y tratamiento adecuado de datos personales.
- Revisión de requisitos de edad y de legislación aplicable antes de lanzar competiciones con cualquier premio de valor.

## 12. Plan de desarrollo

1. **Validación** — nombre, propuesta de valor, 5–10 desafíos de ejemplo, criterios de verificación y reglas comunitarias.
2. **Prototipo** — pantallas principales directamente en componentes; probar el flujo explorar → crear → enviar intento → revisar → ranking.
3. **MVP funcional** — auth, base de datos, CRUD de desafíos, envíos, revisión, rankings, moderación mínima.
4. **Prueba cerrada** — grupo pequeño de jugadores; medir creación, participación y retorno.
5. **Lanzamiento público** — vídeos demostrativos, comunidades y creadores, tarjetas compartibles y eventos semanales.

## 13. Indicadores de éxito

Usuarios activos semanales · % de visitantes que intentan un desafío · desafíos creados por usuarios · intentos enviados y aprobados · % que regresa la semana siguiente · visitas desde enlaces compartidos · tiempo medio de revisión y número de disputas.

## 14. Decisiones pendientes

1. ¿Cualquier usuario podrá publicar retos de inmediato o requerirán aprobación?
2. ¿Habrá desafíos libres y competiciones oficiales seleccionadas por votación?
3. ¿Qué evidencias serán obligatorias para los rankings cronometrados?
4. ~~¿Vídeos subidos o enlaces externos?~~ → MVP: enlaces externos + capturas.
5. ¿Qué funciones estarán listas antes del lanzamiento de GTA VI?
6. ¿Cómo se repartirán desarrollo, diseño, moderación y redes sociales?
7. ¿Cuál será el nombre definitivo y el dominio disponible?

## 15. Visión futura

Convertir Vice Challenges en un espacio reconocido por la comunidad para crear y superar desafíos de videojuegos de mundo abierto, empezando por GTA VI y expandiéndose a otros títulos si existe interés real.

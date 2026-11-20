-- Local development examples. Do not include this seed when pushing to production.
insert into auth.users (id, email)
values
  ('10000000-0000-4000-8000-000000000001', 'luna@example.test'),
  ('10000000-0000-4000-8000-000000000002', 'ruta@example.test'),
  ('10000000-0000-4000-8000-000000000003', 'mar@example.test');

insert into public.profiles (id, username, display_name)
values
  ('10000000-0000-4000-8000-000000000001', 'luna_costera', 'Luna Costera'),
  ('10000000-0000-4000-8000-000000000002', 'ruta_neon', 'Ruta Neón'),
  ('10000000-0000-4000-8000-000000000003', 'mar_de_fondo', 'Mar de Fondo');

insert into public.challenges (id, slug, title, description, rules, mode, difficulty, verification_level, status, is_weekly, is_example)
values
  ('20000000-0000-4000-8000-000000000001', 'carrera-al-amanecer', 'Carrera al amanecer', 'Cruza la ciudad desde el muelle hasta el mirador.', array['Empieza con el vehículo detenido frente al muelle.', 'Termina al cruzar la entrada al mirador con el mismo vehículo.'], 'speed', 3, 'featured', 'published', true, true),
  ('20000000-0000-4000-8000-000000000002', 'vuelta-al-canal', 'Vuelta al canal', 'Rodea el canal en bicicleta y vuelve al puente de partida.', array['Comienza con la bicicleta detenida.', 'Detén el tiempo al regresar al puente.'], 'speed', 2, 'verified', 'published', false, true),
  ('20000000-0000-4000-8000-000000000003', 'cero-rasgunos', 'Cero rasguños', 'Cruza el centro en un auto compacto sin tocar obstáculos.', array['Muestra el auto al inicio y al final.', 'Termina en la plaza central.'], 'impossible', 5, 'verified', 'published', false, true),
  ('20000000-0000-4000-8000-000000000004', 'postales-del-litoral', 'Postales del litoral', 'Encuentra tres vistas distintas de la costa.', array['Incluye un punto de referencia en cada captura.'], 'community', 1, 'community', 'published', false, true),
  ('20000000-0000-4000-8000-000000000005', 'la-ultima-curva', 'La última curva', 'Desciende del mirador hasta la costa sin salir del asfalto.', array['Sal del mirador.', 'Termina al cruzar la primera línea del cruce costero.'], 'speed', 4, 'verified', 'published', false, true),
  ('20000000-0000-4000-8000-000000000006', 'ruta-de-los-faros', 'Ruta de los faros', 'Encuentra dos faros en un solo paseo.', array['Muestra cada faro y explica cómo llegar.'], 'community', 2, 'community', 'published', false, true),
  ('20000000-0000-4000-8000-000000000007', 'puente-a-puente', 'Puente a puente', 'Une dos puentes costeros en bicicleta.', array['Empieza al salir del primer puente.', 'Detén el tiempo al cruzar el segundo.'], 'speed', 3, 'verified', 'published', false, true),
  ('20000000-0000-4000-8000-000000000008', 'noche-sin-mapa', 'Noche sin mapa', 'Encuentra la plaza por sus puntos de referencia.', array['Desactiva el minimapa antes de empezar.', 'Muestra la plaza al completar el recorrido.'], 'impossible', 5, 'verified', 'draft', false, true);

insert into public.submissions (challenge_id, user_id, evidence_url, claimed_time_ms, status)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'https://example.test/luna', 161380, 'approved'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'https://example.test/ruta', 165204, 'pending'),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'https://example.test/mar', 172048, 'rejected'),
  ('20000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'https://example.test/borrador', 240012, 'approved');

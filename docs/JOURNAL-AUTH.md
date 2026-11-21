# Activar las cuentas del diario

El diario usa Supabase Auth con correo y contraseña. El registro pide repetir la contraseña y comprueba que ambos valores coincidan en el servidor.

1. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en Vercel y vuelve a desplegar si agregaste las variables.
2. En Supabase, confirma que el proveedor **Email** y el registro de nuevos usuarios estén habilitados.
3. Para el piloto sin mensajes de confirmación, abre **Authentication → Sign In / Providers → Email**, desactiva **Confirm email** y guarda. Es un ajuste de todo el proyecto. Supabase permitirá que la cuenta nueva inicie sesión sin comprobar que controla ese correo.
4. Prueba crear una cuenta nueva y volver a entrar con su contraseña. Las cuentas creadas solo con el flujo anterior de códigos pueden necesitar establecer una contraseña.

El envío de un correo de recuperación o la reactivación de la confirmación requieren configurar la entrega de correo para los usuarios ajenos al equipo. La libreta requiere sesión y se sincroniza por cuenta. Las libretas antiguas del navegador se pueden importar desde el editor sin borrar la copia local.

## Activar el guardado remoto

Aplica las migraciones pendientes con la CLI de Supabase. Verifica el proyecto enlazado y revisa `supabase migration list` y `supabase db push --dry-run` antes de ejecutar `supabase db push`. El despliegue de Vercel no aplica migraciones. La nueva migración crea `journal_notebooks` y el depósito privado `journal-photos`.

# Activar las cuentas del diario

El diario usa Supabase Auth con un código de un solo uso enviado por correo. El registro permite crear una cuenta. El acceso solo solicita códigos para cuentas existentes.

1. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en Vercel para el entorno que vayas a usar y vuelve a desplegar.
2. En Supabase, habilita el proveedor **Email** y el registro de nuevos usuarios.
3. En las plantillas **Confirm signup** y **Magic link**, incluye el código: `<p>Tu código de acceso es <strong>{{ .Token }}</strong>.</p>`. El formulario acepta códigos de 6 a 8 dígitos.
4. Configura un proveedor SMTP propio para enviar a personas ajenas al equipo. Antes de abrir el registro al público, verifica ambos flujos con un correo de prueba.

Estas cuentas usan Supabase Auth. El cuaderno de muestra se puede abrir sin sesión y todavía no guarda entradas.

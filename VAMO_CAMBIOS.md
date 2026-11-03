# Vamo — primera adaptación del repositorio

Esta entrega adapta las pantallas existentes a la identidad del mockup. No es todavía la implementación de las 36 pantallas.

## Incluido
- Marca Vamo, logo de la ruta, iconos de instalación y metadatos.
- Fondo marino, superficies marfil/arena y botones ámbar.
- Bienvenida (`/bienvenida`), registro con DNI obligatorio de 8 dígitos y privado, login, recuperación y restablecimiento de contraseña.
- Inicio con acciones según los roles reales de la cuenta; navegación móvil hacia las funciones existentes.
- Integraciones existentes de búsqueda, publicación, vehículo y solicitudes conservadas.
- Estados de solicitud claros: pendiente de aceptación y confirmada por el conductor.
- Migración que exige `pending` al insertar solicitudes y limita las actualizaciones del cliente a la columna `status`.

## Para ejecutar
1. `npm ci`
2. Copiar `.env.example` a `.env.local` y configurar las claves del proyecto existente.
3. `npm run dev`
4. Revisar y aplicar la migración `supabase/migrations/20261102210000_vamo_pending_requests.sql` en el proyecto de Supabase.
5. En Supabase Auth, autorizar la URL real `/restablecer` como URL de redirección para recuperación de contraseña.

No se incluyen claves, archivos `.env.local`, dependencias ni builds de prueba. La rama local es `codex/vamo-diseno`; no se ha hecho push a GitHub ni despliegue.

## Validación
`npm run build` y `npm test`. Revisión visual en navegador de bienvenida y registro. Las pruebas de APIs usan mocks; no son pruebas integrales de Supabase. No se ejecutó la migración contra una base real. La compilación advierte sobre el tamaño del bundle.

## Alcance pendiente
Tribu/comunidades, chat, notificaciones y otras pantallas que solo existen en el mockup requieren su implementación y modelo de datos. Los mapas mantienen el flujo existente de selección por punto; todavía no equivalen al formulario de origen/destino del mockup. La verificación de identidad existente es una simulación documentada en el repositorio, no una consulta real a RENIEC.


## Seguimiento conductor ↔ pasajero (3 de noviembre)
- La ubicación se comparte durante viajes `ongoing`, con permiso de GPS del navegador. Solo participan el conductor y pasajeros con solicitud `accepted`.
- El GPS vive encima de las páginas: navegar dentro de Vamo no detiene el envío. Cerrar la web, bloquear el teléfono o suspender el navegador puede interrumpirlo; esta entrega no implementa seguimiento nativo en segundo plano.
- Inicio/fin del viaje y aceptación se detectan automáticamente con comprobaciones cada 5 segundos. Las coordenadas se reciben por Supabase Realtime con resincronización cada 5 segundos y al recuperar conexión/foco.
- El conductor ve pasajeros confirmados; cada pasajero ve al conductor y su propio marcador. Los pasajeros no ven a otros pasajeros.
- Se muestran espera de ubicación, denegación del permiso, error de envío, falta de conexión y antigüedad del último punto.
- La migración nueva `20261103210000_live_location_trip_scope.sql` corrige el alcance del viaje al escribir coordenadas de pasajeros y restringe las lecturas a participantes de viajes activos. Los triggers existentes borran coordenadas al terminar/cancelar o revocar una solicitud.

### Activar y probar
1. Actualizar el código en GitHub y desplegar en Vercel con las claves reales.
2. Revisar `npx supabase db push --dry-run` y aplicar las migraciones pendientes con `npx supabase db push`. No volver a aplicar manualmente migraciones ya registradas.
3. Comprobar que `public.live_locations` esté en la publicación `supabase_realtime` (la migración original ya lo agrega).
4. Mantener `VITE_TEST_MODE=false`. Usar HTTPS y habilitar ubicación en ambos teléfonos.
5. Entrar como conductor en un teléfono y pasajero en el otro. El pasajero solicita, el conductor acepta y después pulsa **Iniciar viaje** en **Mis rutas**.
6. Abrir **Viajes** en el pasajero y **Mis rutas** en el conductor. El mapa aparece automáticamente en unos segundos. Cada persona debe permitir el GPS y mantener Vamo abierto.
7. Caminar o desplazarse de forma segura, comprobar los marcadores y cambiar de página dentro de Vamo: al regresar el seguimiento debe continuar.
8. Finalizar el viaje y comprobar que desaparece el mapa y que `live_locations` no conserva filas del viaje. Repetir con solicitud pendiente/rechazada: no debe acceder al seguimiento.

Validación local: 70 pruebas pasan, incluyendo inicio/fin detectados sin recargar, seguimiento al cambiar de página, limpieza de puntos sin evento DELETE y resincronización ante revocación/error. Compilación de producción verificada. No se han aplicado las migraciones ni probado GPS entre teléfonos contra tu Supabase; requieren las credenciales y el despliegue reales.

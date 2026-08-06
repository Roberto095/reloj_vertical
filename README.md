# Reloj vertical

Reloj de escritorio para dejar un celular Android encendido en posición vertical.
Un solo archivo HTML, sin dependencias ni conexión a internet.

**Demo:** https://roberto095.github.io/reloj-vertical/

## Qué hace

- Hora y minutos apilados, ocupando todo el alto de la pantalla
- Mantiene la pantalla encendida con la **Screen Wake Lock API**
- Bloquea la orientación vertical en pantalla completa
- Atenuador propio, por debajo del brillo mínimo del sistema
- Selector de color y de tipografía
- Formato 12 h / 24 h, riel de segundos, fecha y estado de la batería
- Desplaza los dígitos unos píxeles cada minuto para no desgastar la retroiluminación

## Uso

Abrir la demo en el navegador del celular, tocar la pantalla y elegir
**Pantalla completa**. Luego "Añadir a la pantalla de inicio" para que abra
como aplicación.

> El Wake Lock exige HTTPS. Abriendo el archivo con `file://` la pantalla
> se apaga igual.

## Desarrollo

No hay build. Se edita `index.html` y se recarga.

Para probar desde el celular en la red local, hace falta HTTPS o `localhost`.
La vía más simple es reenviar el puerto por USB con depuración activada:

```bash
python -m http.server 8000
adb reverse tcp:8000 tcp:8000
```

Y abrir `http://localhost:8000` en el navegador del celular.

## Personalización

Los tokens de diseño están al inicio del `<style>`, en `:root`.
Cambiar `--ambar` basta: los tonos secundarios se recalculan solos con
`color-mix()`.

## Pendientes

- [ ] Guardar la configuración en `localStorage`
- [ ] Modo noche automático por horario
- [x] Service worker para que funcione sin conexión

## Licencia

MIT

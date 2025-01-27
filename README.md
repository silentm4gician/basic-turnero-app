# Sistema de Gestión de Turnos

Una aplicación web simple y eficiente para la gestión de turnos hospitalarios, construida con Next.js, Prisma y SQLite.

## Características

- ✨ Interfaz simple e intuitiva
- 🏥 Gestión de doctores y especialidades
- 🎫 Asignación automática de números de turno
- 🔄 Reinicio de turnos al final del día
- 📱 Diseño responsive

## Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd basic-turnero-app
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Configura la base de datos:

```bash
npx prisma generate
npx prisma db push
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```
basic-turnero-app/
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   ├── components/       # Componentes React reutilizables
│   ├── lib/             # Utilidades y configuraciones
│   └── store/           # Estado global con Zustand
├── prisma/              # Esquema y configuración de la base de datos
└── public/             # Archivos estáticos
```

## Tecnologías Utilizadas

- [Next.js](https://nextjs.org/) - Framework de React
- [Prisma](https://www.prisma.io/) - ORM para la base de datos
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Zustand](https://github.com/pmndrs/zustand) - Gestión de estado

## Escalabilidad Futura

El proyecto está diseñado para ser fácilmente extensible con:

- Sistema de autenticación
- Gestión de múltiples hospitales
- Calendario de citas
- Historial de pacientes
- Notificaciones
- Estadísticas y reportes

## Licencia

Este proyecto está bajo la Licencia MIT.

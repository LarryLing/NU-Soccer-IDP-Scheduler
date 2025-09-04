# NU Soccer IDP Scheduler

A frontend application for creating a weekly training schedule based on player and field availability

## Built With

### Technologies
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Libraries
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCN](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Tanstack Table](https://img.shields.io/badge/tanstack%20table-1867C0?style=for-the-badge&logo=react%20table&logoColor=white)
![Tanstack Router](https://img.shields.io/badge/Tanstack%20Router-6DB33F?style=for-the-badge&logo=react%20table&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5190cf?style=for-the-badge&logo=zustand&logoColor=white)

## Getting Started

### Dependencies

Please ensure you have [NodeJS](https://nodejs.org/en) and [pnpm](https://pnpm.io/installation) installed.

This repository also requires the [self-hosted Supabase backend](https://github.com/LarryLing/IDP-Scheduler-Self-Hosted-Supabase) to be fully setup before continuing.

### Installing

Clone the repository
```sh
git clone https://github.com/LarryLing/IDP-Scheduler.git
```

Install the dependencies
```sh
pnpm install
```

### Setting Up Environment Variables

Create a `.env` file and insert the following variables (copy the generated `ANON_KEY` from the self-hosted Supabase setup)
```sh
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<YOUR_GENERATED_ANON_KEY>
```

### Running Application

Run the following script to start the application locally
```sh
pnpm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/LarryLing/idp-scheduler/blob/main/LICENSE.md) file for details

## Acknowledgments

### Documentation
* [TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)
* [ShadCN](https://ui.shadcn.com/docs/installation)
* [Tanstack Table](https://tanstack.com/table/latest/docs/introduction)
* [Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
* [React Hook Form](https://react-hook-form.com)
* [Zod](https://zod.dev)
* [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)

### Icons
* [Lucide React Icons](https://lucide.dev)

### Miscellaneous
* [TweakCN](https://tweakcn.com)

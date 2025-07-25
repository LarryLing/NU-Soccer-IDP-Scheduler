# NU Soccer IDP Scheduler

A frontend application for scheduling players into IDP training blocks.

## Built With

### Technologies
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

### Libraries
![ShadCN](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Tanstack Table](https://img.shields.io/badge/tanstack%20table-FF4154?style=for-the-badge&logo=react%20table&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

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

Create a `.env` file and insert the following variables
```sh
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<YOUR_GENERATED_ANON_KEY>
```

### Running Application

Run the following script to start the application locally
```sh
pnpm run dev
```

## Demo

demo video

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/LarryLing/idp-scheduler/blob/main/LICENSE.md) file for details

## Acknowledgments

Documentation
* [Supabase](https://supabase.com/docs)
* [Zod](https://zod.dev)
* [React Hook Form](https://react-hook-form.com)
* [Tanstack Table](https://tanstack.com/table/latest/docs/introduction)

Icons
* [Lucide React Icons](https://lucide.dev)

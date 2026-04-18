import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente a la pantalla de login al entrar a la raíz
  redirect('/login');
}

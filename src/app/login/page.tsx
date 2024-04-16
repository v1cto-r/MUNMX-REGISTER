"use client"

import Cookies from 'js-cookie';
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Login() {

  useEffect(() => {
    if (Cookies.get('login')) {
      window.location.href = '/';
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name') as string;
    console.log(name);
    const password = data.get('password') as string;
    console.log(password);

    fetch('/api/verifyUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    })
      .then(response => {
        if (response.status === 200) {
          window.location.href = '/';
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
    
  return (
    <main className={styles.main}>
      <div className={styles.loginBox}>
        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input type="text" name="name" placeholder="Usuario..." />
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="Contraseña..." />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </main>
  );
}
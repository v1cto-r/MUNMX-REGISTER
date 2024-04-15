'use-client'

import { FormEvent } from "react";
import styles from "./page.module.css";

export default function Login() {

  return (
    <main className={styles.main}>
      <div className={styles.loginBox}>
        <form>
          <label>Usuario</label>
          <input type="text" placeholder="Usuario..." />
          <label>Contraseña</label>
          <input type="password" placeholder="Contraseña..." />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </main>
  );
}
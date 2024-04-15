'use client'

import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <SearchBar />
      <DelegateList />
    </main>
  );
}

function SearchBar() {

  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Buscar delegado" />
    </div>
  )
}

function DelegateList() {
  interface DelegateType {
    _id: string,
    committee: number
    country: number,
    name: string,
    registered: boolean
  }

  const [delegates, setDelegates] = useState<DelegateType[]>([]);

  useEffect(() => {
    fetch("/api/getDelegates")
      .then((res) => res.json())
      .then((data: DelegateType[]) => setDelegates(data));
  }, []);

  useEffect(() => {
    console.log(delegates);
  }, [delegates]);

  return (
    <div className={styles.delegateList}>
      { delegates.map((delegate, index) => (
        <Delegate key={index} name={delegate.name} country={delegate.country} committee={delegate.committee} />
      ))
      }
    </div>
  )
}

function Delegate(props: {name: string, country: number, committee: number}) {
  return (
    <div className={styles.delegateCard}>
      <h2>{props.name}</h2>
      <p>{props.country}</p>
      <p>{props.committee}</p>
    </div>
  )
}

"use client"

import Cookies from 'js-cookie';

import NumberToCommittee from './keys/NumberToCommittee.json';
import NumberToCountry from './keys/NumberToCountry.json';

import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(false);

  useEffect(() => {
    if (!Cookies.get('login')) {
      console.log('No login cookie found');
      window.location.href = '/login';
    }
    
    const params = new URLSearchParams(window.location.search);
    const registered = params.get('registered');
    if (registered === 'true') {
      setMessage('Registro completado');
      setIsSuccess(true);
    } else if (registered === 'false') {
      setMessage('Registro fallido');
      setIsSuccess(false);
    }
  }, []);

  return (
    <main className={styles.main}>
      <DelegateList />
      {message && 
        <div className={styles.message}>
          <Image className={styles.messageImg} src={isSuccess ? `/success.svg`:`error.svg`} alt='status icon' width={48} height={48}/>
          <span>{message}</span>
        </div>}
    </main>
  );
}

function SearchBar({ setSearchTerm }: { setSearchTerm: (searchTerm: string) => void }) {

  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Buscar delegado..." onChange={e => setSearchTerm(e.target.value)}/>
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetch("/api/getDelegates?"+new Date().getTime(), 
    { 
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-store',
        'Time': String(new Date().getTime())
      }

     })
      .then((res) => res.json())
      .then((data: DelegateType[]) => setDelegates(data));
  }, []);

  useEffect(() => {
    console.log(delegates);
  }, [delegates]);

  const NumberToCommitteeWithIndex = NumberToCommittee as {[key: number]: string};
  const NumberToCountryWithIndex = NumberToCountry as {[key: number]: string[]};

  const filteredDelegates = delegates.filter(delegate => 
    delegate.name.toLowerCase().includes(searchTerm .toLowerCase()) ||
    NumberToCommitteeWithIndex[delegate.committee].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <SearchBar setSearchTerm={setSearchTerm}/>
    <div className={styles.delegateList}>
      { filteredDelegates.map((delegate, index) => (
        <Delegate key={index} name={delegate.name} country={delegate.country} committee={delegate.committee} CommitteeKeys={NumberToCommitteeWithIndex} CountryKeys={NumberToCountryWithIndex} />
      ))
      }
    </div>
    </>
  )
}

function Delegate(props: {name: string, country: number, committee: number, CommitteeKeys: {[key: number]: string}, CountryKeys: {[key: number]: string[]}}) {
  const delegateName = capitalizeFirstLetter(props.name);
  const committeeName = props.CommitteeKeys[props.committee];
  const countryName: string[] = props.CountryKeys[props.country]
  ? props.CountryKeys[props.country].map((country) => capitalizeFirstLetter(country))
  : ["Non existent country"];

  const delegateProperties = {
    name: props.name,
    country: props.country,
    committee: props.committee
  }

  const dialogRef = useRef<HTMLDialogElement>(null);

  const registerDelegate = () => {
    fetch('/api/registerDelegate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(delegateProperties)
    })
    .then(response => {
      if (response.ok) {
        window.location.href = window.location.href.split('?')[0] + '?' + "registered=true";
        return true;
      } else {
        window.location.href = window.location.href.split('?')[0] + '?' + "registered=false";
        throw new Error('Fetch failed');
      }
    })
    .catch(error => console.error('Error:', error));
  }

  const openDialog = () => {
    if(dialogRef.current) {
      dialogRef.current.showModal();
      dialogRef.current.focus();
      dialogRef.current.style.display = 'flex';
      dialogRef.current.focus();
    }
  };

  const closeDialog = () => {
    if(dialogRef.current) {
      dialogRef.current.close();
      dialogRef.current.style.display = 'none';
    }
  };

  return (
    <div className={styles.delegateCard}>
      <h2>{delegateName}</h2>
      <p>{countryName.join(' / ')}</p>
      <p>{committeeName}</p>
      <button onClick={openDialog}>Registrar</button>

      <dialog ref={dialogRef} onKeyDown={(e) => (e.key === 'Escape') && closeDialog()}>
        <h2>Confirmar delegado</h2>
        <p>Seguro que quieres registrar a: <b>{delegateName}</b>?</p>
        <div className={styles.buttons}>
          <button onClick={registerDelegate} className={styles.positive}>Yes</button>
          <button onClick={closeDialog}>No</button>
        </div>
      </dialog>
    </div>
  )
}

function capitalizeFirstLetter(string: string) {
  return string.toLowerCase().replace(/(^|\s)\S/g, function(firstLetter) {return firstLetter.toUpperCase();});
}
'use client'

import NumberToCommittee from './keys/NumberToCommittee.json';
import NumberToCountry from './keys/NumberToCountry.json';

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from 'next/image';

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(false);

  useEffect(() => {
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
    { cache: "no-store" })
      .then((res) => res.json())
      .then((data: DelegateType[]) => setDelegates(data));
  }, []);

  useEffect(() => {
    console.log(delegates);
  }, [delegates]);

  const NumberToCommitteeWithIndex = NumberToCommittee as {[key: number]: string};
  const NumberToCountryWithIndex = NumberToCountry as {[key: number]: string[]};

  const filteredDelegates = delegates.filter(delegate => delegate.name.toLowerCase().includes(searchTerm.toLowerCase()));


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

  return (
    <div className={styles.delegateCard}>
      <h2>{delegateName}</h2>
      <p>{countryName.join(' / ')}</p>
      <p>{committeeName}</p>
      <button onClick={registerDelegate}>Registrar</button>
    </div>
  )
}

function capitalizeFirstLetter(string: string) {
  return string.toLowerCase().replace(/(^|\s)\S/g, function(firstLetter) {return firstLetter.toUpperCase();});
}
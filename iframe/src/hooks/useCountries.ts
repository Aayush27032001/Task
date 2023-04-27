import { useState, useEffect } from "react";

interface Countries{
  name: string;
  states: Array<{name:string}>
}

const useCountries = () => {
  const [countries, setCountries] = useState<Countries[]>([]);
  const fetchCountries = async () => {
    const countriesResponse = await fetch("https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json");
    if(countriesResponse.ok){
      const countries: Countries[] = await countriesResponse.json();
      setCountries(countries);
    }
  }
  useEffect(()=>{
    fetchCountries();
  },[])
  return [countries];
}

export default useCountries;
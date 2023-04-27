import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "./Form.module.scss";
import useCountries from "../hooks/useCountries";
interface State {
  name: string;
}
interface ValidationRules {
  field: string;
  validator: any[];
  error: {};
}

const Form = () => {
  const [countries] = useCountries();
  const [countryStates, setCountryState] = useState<State[]>([]);
  const [validationRules, setValidationRules] = useState<ValidationRules[]>([]);
  const formRef = useRef<any>(null);

  const countryChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;

    const states = countries.find((country) => country.name === selectedCountry)?.states || [];

    setCountryState(states);
  };

  const applyValidators = (fieldName: string) => {
    // Find the validation rule object for the given field name
    const fieldValidationRule = validationRules.find(
      (rule) => rule.field === fieldName
    );
  
    // Convert the array of validator objects into a single object
    const validatorObject = fieldValidationRule?.validator.reduce((acc, curr) => {
      const validatorType = Object.keys(curr)[0];
      const validatorValue = curr[validatorType];
      return { ...acc, [validatorType]: validatorValue };
    }, {});
  
    return validatorObject;
  };

  const submitHandler = () => {
    const formFields = formRef.current?.querySelectorAll("input, select") || [];
    for (let i = 0; i < formFields.length; i++) {
      if (!formFields[i].checkValidity()) {
        const fieldValidator = validationRules.find((rule) => rule.field === formFields[i].name);
        window.parent.postMessage("Result: "+JSON.stringify({ error: fieldValidator?.error }), "*");
        return;
      }
    }
    window.parent.postMessage("Result: "+JSON.stringify({ Success: "All fields are valid." }), "*");
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== "https://task-blush.vercel.app") return;
    setValidationRules(event.data as ValidationRules[]);
  };

  useLayoutEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className={styles.form} ref={formRef}>
      <p>Can you please provide personal details?</p>
      <div className={styles.form_field_container}>
        <label htmlFor="name">Name</label>
        <input
          className={styles.form_field}
          name="name"
          {...applyValidators("name")}
        />
      </div>
      <div className={styles.form_field_container}>
        <label htmlFor="email">Email</label>
        <input
          className={styles.form_field}
          name="email"
          {...applyValidators("email")}
        />
      </div>
      <div className={styles.form_field_container}>
        <label htmlFor="contact">Contact Number</label>
        <input
          {...applyValidators("contact")}
          className={styles.form_field}
          name="contact"
        />
      </div>
      <div className={styles.form_field_container}>
        <label htmlFor="country">Country</label>
        <select
          className={styles.form_field}
          name="country"
          onChange={countryChangeHandler}
          {...applyValidators("country")}
          defaultValue={""}
        >
          <option value="">Not Selected</option>
          {countries.map((country) => {
            return (
              <option value={country.name} key={country.name}>
                {country.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className={styles.form_field_container}>
        <label htmlFor="state">State</label>
        <select
          {...applyValidators("state")}
          className={styles.form_field}
          name="state"
          defaultValue={""}
        >
          <option value="">Not Selected</option>
          {countryStates.length === 0 && (
            <option disabled>No States found</option>
          )}
          {countryStates.map((state) => {
            return (
              <option value={state.name} key={state.name}>
                {state.name}
              </option>
            );
          })}
        </select>
      </div>
      <button className={styles.submit_button} onClick={submitHandler}>
        Submit
      </button>
    </div>
  );
};

export default Form;

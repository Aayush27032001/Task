import React, { useState, useEffect, useRef } from "react";
import "./App.css"
interface ValidationRules {
  field: string;
  error: string;
  validator: {};
}

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [validationRules, setValidationRules] = useState<ValidationRules[]>([
      { field: "name", validator: [{ required: true}, {minLength:4}, {maxLength:10 }], error:"Length should be between 4-10 characters." },
      { field: "email", validator: [{ type: "email" }], error:"Should be a valid email address" },
      { field: "contact", validator: [{ pattern: "[1-9]{1}[0-9]{9}" }], error:"Mobile number should be of 10 digits." },
      { field: "country", validator: [{ required: true }], error:"Country is mandatory" },
      { field: "state", validator: [{ required: true }], error:"State is mandatory" },
    ]);
  const [formResponse, setFormResponse] = useState<string>("");
 
  const postValidationRules = () => {
    if (iframeRef.current) {
      iframeRef?.current.contentWindow?.postMessage(validationRules, "*");
    }
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== 'http://localhost:3000') return;
    setFormResponse(event.data as string)
  }
  useEffect(() => {

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <iframe
        ref={iframeRef}
        title="formIframe"
        src="http://localhost:3000/"
        height="500px"
        onLoad={postValidationRules}
      />
      <p>{formResponse}</p>
    </div>
  );
}

export default App;

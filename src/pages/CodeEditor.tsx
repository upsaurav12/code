import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

const languages = [
    { language: 'javascript', key: 0, default_value: '// JavaScript Code' },
    { language: 'html', key: 1, default_value: '<!-- HTML Code -->' },
    { language: 'css', key: 2, default_value: '/* CSS Code */' },
];

export const CodeEditor: React.FC = () => {
    // State for code of each language
    const [javascript, setJavascript] = useState<string>('//Javascript Code');
    const [htmlcode, setHtml] = useState<string>('<!-- HTML Code -->');
    const [toggle , setToggle] = useState<boolean>(false);
    const [csscode, setCss] = useState<string>('/* CSS Code */');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [jsoutput, setJsOutput] = useState<string>('')
    const [doc, setDocument] = useState<string>('');

    // Effect to update the iframe document whenever code changes

    const handleExecution = () => {
        // Save the original console.log function
        const originalLog = console.log;
        
        // Override console.log to capture messages and add them to the output
        console.log = (...messages) => {
            setJsOutput((prev) => prev + messages.join(" ") + "\n"); // Append each log to jsOutput
            originalLog(...messages); // Call the original console.log so logs appear in the console as well
        };
        
        // Clear previous output for a fresh run
        setJsOutput('');
        
        try {
            // Evaluate the JavaScript code
            const result = eval(javascript); 
            
            // If there's a result, display it in jsOutput
            if (result !== undefined) {
                setJsOutput((prev) => prev + `Result: ${result}\n`);
            }
        } catch (error) {
            // Catch and display any errors
            console.error('Error:', error);
            setJsOutput((prev) => prev + "Error: " + error + "\n");
        } finally {
            // Restore original console.log function
            console.log = originalLog;
        }
    };
    

    const handleClick = (lang: string) => {
        // Save current code based on selected language
        setSelectedLanguage(lang);
        if (lang === 'javascript') {
            setCode(javascript)
            setToggle(!toggle);
            console.log(toggle)
        }
        else if (lang === 'html') {
            setCode(htmlcode)
        }
        else if (lang === 'css') {
            setCode(csscode)
        };
        
    };

    useEffect(() => {
        setDocument(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <style>${csscode}</style>
                    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
                    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
                </head>
                <body>
                    ${htmlcode}
                    <script>
                        try {
                            ${javascript}
                        } catch (error) {
                            document.body.innerHTML += '<pre style="color:red;">Error: ' + error + '</pre>';
                        }
                    </script>
                </body>
            </html>
        `);
    }, [javascript, htmlcode, csscode]);

    const handleCode = (language: string , newcode : string | undefined) => {
        const validCode = newcode || ""; 
        setCode(validCode)
        if (language === 'javascript') {
            setJavascript(validCode)
            //setCode(newcode)
        }
        else  if (language === 'html'){ 
            setHtml(validCode)
            //setCode(newcode)
        }
        else if (language === 'css') {
            setCss(validCode)
            //setCode(newcode)
        }       
    }
    return (
        <main className="rounded-[1rem] w-[98%] m-auto h-[98vh] mt-2">
            <div className="buttons flex w-4/12 justify-around">
                <button className="relative t-0 r-0 border w-[100px] h-[45px] rounded-[0.6rem] hover:bg-sky-500 hover:text-white transition delay-200 ease-out hover:ease-in" style={{cursor: toggle ? 'not-allowed' : 'pointer'}} onClick={handleExecution}>Run</button>
                <ul className="flex justify-around w-9/12">
                    {languages.map((val, idx) => (
                        <li className="border px-[20px] rounded flex items-center" onClick={() => handleClick(val.language)} key={idx}>
                            <button>{val.language.toUpperCase()}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="editor-execution border-2 rounded-[0.4rem] mt-2 flex h-[94%] w-full">
                <div className="code-editor border-r border-black w-full">
                    <div className="editor-container mt-4">
                        <Editor
                            height="90vh"
                            language={selectedLanguage}
                            value={code}
                            onChange={(newcode) => handleCode(selectedLanguage , newcode)}
                        />
                    </div>
                </div>
                <div className="execution-container w-full">
                    <div className="container h-[400px] w-full h-screen">
                        <iframe
                            srcDoc={toggle ? doc : jsoutput}
                            title="preview"
                            sandbox="allow-scripts"
                            frameBorder="0"
                            width="100%"
                            height="100%"
                            className=""
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

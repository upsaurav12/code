import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

const languages = [
    {language: 'javascript' , key: 0, default_value: '//Here is your javascript code' }, {language: 'C' , key: 1 , default_value: '//Here is your C code'} , {language: 'c++' , key: 2 , default_value: '//Here is your C++ code'} , {language: 'python' , key: 3 , default_value: '//Here is your python'},
]

export const CodeEditor: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [selectedLanguage , setSelectedLanguage] = useState(languages[0]);

    //const languages = ['Javascript' , 'C' , 'C++' , 'Python'];
    const handleCode = () => {
        const originalLog = console.log;

        console.log = (...messages) => {
            // Append formatted messages to output
            setOutput((prev) => prev + messages.join(" ") + "\n");
            originalLog(...messages); // Call the original console.log
        };

        // Clear previous output
        setOutput('');

        try {
            eval(code); // Execute user code
        } catch (error) {
            console.error('Error:', error);
            setOutput((prev) => prev + "Error: " + error + "\n");
        } finally {
            console.log = originalLog; // Restore original console.log
        }
    };

    const handleClick = (key: number) => {
        const selectedLang = languages.find((lang) => lang.key === key);
        if (selectedLang) {
            setSelectedLanguage(selectedLang); // Set the selected language
            setCode(selectedLang.default_value); // Update code with the default value of the selected language
        }
    };

    return (
        <main className="rounded-[1rem] w-[98%] m-auto h-[98vh] mt-2">
            <div className="buttons flex w-4/12 justify-around">
            <button className="relative t-0 r-0 border w-[100px] h-[30px]" onClick={handleCode}>Run</button>
                <ul className="flex justify-around w-9/12">
                    {languages.map((val , idx) => (
                        <li className="border px-[20px] rounded" onClick={() => handleClick(idx)} key={idx}> <button>{val.language}</button></li>
                    ))}
                </ul>
            </div>
            <div className="editor-execution flex h-[95%] w-full">
                <div className="code-editor border-r-2 border-black w-full">
                    <div className="buttons"></div>
                    <div className="editor-container mt-4 ">
                        <Editor
                                height="60vh"
                                defaultLanguage={selectedLanguage.language}
                                defaultValue={code}
                                value={code}
                                onChange={(value) => setCode(value || "")}
                            />
                    </div>
                </div>
                <div className="execution-container w-full">
                    <div className="container h-[400px] w-full h-screen border">
                        <div className="output ml-2 text-medium">
                            {output && (
                                <div className=""><pre>{output}</pre></div>
                            
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </main>
    );
};
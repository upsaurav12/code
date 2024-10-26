import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

export const CodeEditor: React.FC = () => {
    const [code, setCode] = useState<string>(
        '// Write your JavaScript code here\nconsole.log({ key: "value", anotherKey: 123 });'
    );
    const [output, setOutput] = useState<string>('');

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

    return (
        <div className="flex w-full border flex-col items-center p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Your First Code Editor ,Hi</h1>
            <div className="flex w-full max-w-3xl">
                <div className="editor-container border border-gray-300 rounded-md  h-[60vh] relative">
                    <button
                        onClick={handleCode}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200 absolute top-4 right-4 z-10"
                    >
                        Run
                    </button>
                    <Editor
                        height="60vh"
                        defaultLanguage="javascript"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                    />
                </div>
                <div className="output-container bg-white border rounded-md shadow-md w-full h-[60vh] ml-4 p-4 overflow-auto">
                    {output && (
                        <div>
                            <h2 className="font-bold text-lg">Output:</h2>
                            <pre className="whitespace-pre-wrap break-all text-gray-700">{output}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
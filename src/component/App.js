import { useState } from "react";
import Tesseract from 'tesseract.js';

const App = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [ocrText, setOcrText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImage = (event) => {
        const file = event.target.files[0];
        setOcrText('');

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                performOCR(reader.result); // Call OCR function after loading the image
            };
            reader.readAsDataURL(file);
        }
    };

    const performOCR = (image) => {
        setIsProcessing(true); // Indicate processing
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: (m) => console.log(m), // Optional: Logs OCR progress
            }
        ).then(({ data: { text } }) => {
            setOcrText(text); // Set the extracted text
            setIsProcessing(false); // Stop processing indicator
        }).catch((err) => {
            console.error('Error performing OCR:', err);
            setIsProcessing(false); // Stop processing indicator if there's an error
        });
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs m-10"
                onChange={handleImage}
            />

            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="mt-4 w-full max-w-2xl border"
                />
            )}

            {isProcessing && <p>Processing image for OCR...</p>}

            {ocrText && (
                <div className="mt-11 w-full max-w-2xl border border-dashed p-9">
                    <h3>Extracted Text:</h3>
                    <p className="whitespace-pre-line text-slate-100">{ocrText}</p>
                </div>
            )}
        </div>
    );
}

export default App;
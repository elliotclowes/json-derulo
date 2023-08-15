import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';

function ShortenData() {
    const { documentId } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [dataAsString, setDataAsString] = useState("");

    const db = getFirestore(app);

    useEffect(() => {
        const summariesCollection = collection(db, 'summaries');
        const docRef = doc(summariesCollection, documentId);

        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const blocksArray = data.blockOrder.map(blockId => data.blocks[blockId].text);
                setBlocks(blocksArray);
            } else {
                console.log("No such document!");
            }
        });

        return () => unsubscribe();
    }, [documentId, db]);

    const makeDataJson = () => {
        let compiledData = dataAsString
        
        for (let i = 0; i < blocks.length; i++){
            for (let j =0 ; j<blocks[i].length; j++){
                if (blocks[i][j].children.length>1){
                    for (let k=0; k<blocks[i][j].children.length; k ++){
                        compiledData += (blocks[i][j].children[k].text)
                    }
                }
                else if (blocks[i][j].children[0].text) {
                    compiledData += (blocks[i][j].children[0].text)
                    
                }
            }
        }
        setDataAsString(compiledData)
    };
    useEffect(() => {
        console.log("Updated dataAsString:", dataAsString)
    }, [dataAsString])



    const handleShortenSummary = async() => {
        if (confirm('Confirming will permanently alter your summary. Do you want to continue? ')) {
            await makeDataJson()
            await console.log(dataAsString)
            const sendableData = {
                "prompt": `Please summarize the following transcript:`,
                "content": dataAsString
            };
            console.log(sendableData)
            await fetch('http://localhost:3000/audio/chatgpt', {
                method: 'POST',
                body: JSON.stringify(sendableData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => console.log('Successfully received shortened text:', data))
            .catch(error => console.error('Error uploading file:', error));
        }
    };

    return (
        <button onClick={handleShortenSummary}>Shorten Summary</button>
    );
}

export default ShortenData;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { app } from '/firebase-config.js';


function ShortenData() {
    const { documentId } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [dataAsString, setDataAsString] = useState("");
    const [summary, setSummary] = useState('');
    const [sendableData, setSendableData] = useState({
        "prompt": `Please summarize into 2 sentences the following transcript:`,
        "content": dataAsString
    })
    const [buttonTag, setButtonTag] = useState("Less Detail")

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

    const makeDataJson = async () => {
        let compiledData = await dataAsString
        
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
        setSendableData({
            "prompt": `Please summarize into 2 sentences the following transcript:`,
            "content": compiledData
        })
        return dataAsString,sendableData
    };
    useEffect( () => {
        console.log("Updated dataAsString:", dataAsString)
        console.log("Sendable Object: ", sendableData)
    }, [dataAsString])

const updateFirebase = async () => {
    setButtonTag('Less Detail')
    const data = await handleShortenSummary()
    console.log(data, "   summary")
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize into 2 sentences the following transcript:`,
        "content": ''
    })
    //Talking to the db
    const summariesCollection = collection(db, 'summaries');
    const summariesRef = doc(summariesCollection, documentId);
    const blockPath = `blocks.block1.text.0.children.0.text`
    const updateObject = {
        [blockPath]: [data],
      }
    await updateDoc(summariesRef, updateObject).catch(error => {
    console.error('Error updating block:', error);
    });
    

    console.log("hello!!!!!")
}

//when the user doesn't want a shorter summary just update state variables to reset all
const noButton = () => {
    setButtonTag('Less Detail')
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize into 2 sentences the following transcript:`,
        "content": ''
    })
    console.log('no!!!!')
}
    
const handleShortenSummary = async () => {
    if(buttonTag == 'Less Detail'){setButtonTag(`Confirm?`)} 
    if(buttonTag == 'Confirm?') {
    setButtonTag('Less Detail');
    setDataAsString("");
    setSummary('');
    setSendableData({
        "prompt": `Please summarize into 2 sentences the following transcript:`,
        "content": dataAsString
        })
    }
    try {
        await makeDataJson();
        const response = await fetch('http://localhost:3000/audio/chatgpt', {
            method: 'POST',
            body: JSON.stringify(sendableData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(await dataAsString);
        console.log(await sendableData);
        if (response.ok) {
            const data = await response.text();
            setSummary(data); // Update the summary state with the response
            console.log(data, 'fish');
            return data
        } else {
            console.error('Error uploading file.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    
    
};

    return (
        <>
        <button disabled={buttonTag == 'Confirm?'? true: false} onClick={handleShortenSummary}>{buttonTag}</button>
        {buttonTag == 'Confirm?'? <><button onClick={updateFirebase}>Yes</button> 
        <button onClick={noButton}>No</button>
        <p style={{fontSize: '10px',color: 'red'}}>Warning! Clicking 'Yes' will overwrite your current changes and produce a new summary</p>
        
        </>: null}
        </>
    );
}

export default ShortenData;





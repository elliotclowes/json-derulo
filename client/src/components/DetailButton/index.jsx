import React, { useEffect, useState } from "react";


function ShortenData({onDetailButtonClick, document}) {
    // const { documentId } = useParams();
    const [blocks, setBlocks] = useState([]);
    const [dataAsString, setDataAsString] = useState("");
    const [summary, setSummary] = useState('');
    const [sendableData, setSendableData] = useState({
        "prompt": `Please summarize the following text:`,
        "content": dataAsString
    })
    const [buttonTag, setButtonTag] = useState("Less Detail")


    const makeDataJson = async (document) => {
        let compiledData = await dataAsString
        
        for (let i = 0; i < document.length; i++){
            if (document[i].children.length>1){
                for (let j =0 ; j<document[i].length; j++){
                    compiledData += (document[i].children[j].text)
            }}
            else if (document[i].children[0].text) {
                compiledData += (document[i].children[0].text)
                
            }
            
        }
        setDataAsString(compiledData)
        setSendableData({
            "prompt": `Please summarize the following text:`,
            "content": compiledData
        })
        return dataAsString,sendableData
    };
    useEffect( () => {
        console.log("Updated dataAsString:", dataAsString)
        console.log("Sendable Object: ", sendableData)
    }, [dataAsString])

const sendBackData = async () => {
    setButtonTag('Less Detail')
    const data = await handleShortenSummary()
    console.log(data, "   summary")
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": ''
    })
    

    console.log("hello!!!!!")
    onDetailButtonClick(data)
}

//when the user doesn't want a shorter summary just update state variables to reset all
const noButton = () => {
    setButtonTag('Less Detail')
    setDataAsString('')
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": ''
    })
    console.log('no!!!!')
}
    
const handleShortenSummary = async () => {
    console.log("this is the document:", document)
    if(buttonTag == 'Less Detail'){setButtonTag(`Confirm?`)} 
    if(buttonTag == 'Confirm?') {
    setButtonTag('Less Detail');
    setDataAsString('');
    setSummary('');
    setSendableData({
        "prompt": `Please summarize the following text:`,
        "content": dataAsString
        })
    }
    try {
        await makeDataJson(document)
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
        {buttonTag == 'Confirm?'? <><button onClick={sendBackData}>Yes</button> 
        <button onClick={noButton}>No</button>
        <p style={{fontSize: '10px',color: 'red'}}>Warning! Clicking 'Yes' will overwrite your current changes and produce a new summary</p>
        
        </>: null}
        </>
    );
}

export default ShortenData;




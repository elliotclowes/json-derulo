import React, { useState } from "react";
import { useRecording } from "../../contexts";

import vmsg from 'vmsg'

const recorder = new vmsg.Recorder({
    wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm'
})

export default function AudioRecord() {

    const dummyState = {
        isLoading : false,
        isRecording : false,
        recordings : []
    }

    const [recording, setRecording] = useState(dummyState)

    const record = async () =>{
        setRecording({isLoading:true})
        console.log(recording.recordings)
        if(recording.isRecording){
            const blob = await recorder.stopRecording()
            //console.log(blob)
            setRecording({
                isLoading: false,
                isRecording: false,
                recordings: recording.recordings ? [recording.recordings].concat([URL.createObjectURL(blob)]): [URL.createObjectURL(blob)]
            })
        }
        else{
            try{
                await recorder.initAudio()
                await recorder.initWorker()
                recorder.startRecording()
                setRecording({isLoading: false, isRecording: true})
            } catch(e){
                console.log(e)
                setRecording({isLoading:false})
            }
        }
    }

    // const {isLoading, isRecording, recordings} = recording

    return(
        <>
            <button onClick={record} disabled={recording.isLoading}>{recording.isRecording ? "Stop" : "Record"}</button>
            <ul style={{listStyle: 'none', padding: 0}}>
                {recording.recordings?.map((url)=>(
                    <li key={url}>
                        <audio src={url} controls></audio>
                    </li>
                ))}

            </ul>
        </>
    )
}

import { useSlate } from "slate-react"
import Button  from "../Button/index"
import React, { useEffect, useState } from 'react';
import { toggleBlock, toggleMark, isMarkActive, addMarkData, isBlockActive,activeMark} from '../../../utils/SlateUtilityFunctions'
import defaultToolbarGroups from './ToolbarGroups'
import 'bootstrap/dist/css/bootstrap.css';


import { Editor, Element } from 'slate'


const useTable = (editor)=>{
    const [isTable,setIsTable] = useState(false);
    useEffect(()=>{
        if(editor.selection){
            const [tableNode] = Editor.nodes(editor,{
                match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table'
            })
            
            setIsTable(!!tableNode);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editor.selection])

    return isTable;
}

export default function Toolbar() {
    
    const editor = useSlate();
    const isTable = useTable(editor);
    const [toolbarGroups,setToolbarGroups] = useState(defaultToolbarGroups);
    useEffect(()=>{
        let filteredGroups = [...defaultToolbarGroups]
        if(isTable){
            filteredGroups = toolbarGroups.map(grp =>(
                grp.filter(element => (
                    !['table'].includes(element.type)
                ))
            ))
            filteredGroups = filteredGroups.filter(elem => elem.length)
        }
        setToolbarGroups(filteredGroups);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isTable])
    const BlockButton = ({format}) =>{
        return (
            <Button active={isBlockActive(editor,format)} format={format} onMouseDown={
                e=>{
                    e.preventDefault();
                    toggleBlock(editor,format)
                }
            }>
                <h4>{format}</h4>
            </Button>
        )
    }
    const MarkButton = ({format, letter})=>{
        return(

            <Button active={isMarkActive(editor,format)} format={format} onMouseDown={
                e=>{
                    e.preventDefault();
                    toggleMark(editor,format)
                }
            }>
                {letter}
            </Button>
        )
    }
    const Dropdown = ({format,options}) => {
        return (
            <select value={activeMark(editor,format)} onChange = {e => changeMarkData(e,format)}>
                {
                    options.map((item,index) => 
                        <option key={index} value={item.value}>{item.text}</option>
                    )
                }
            </select>
        )
    }
    const changeMarkData = (event,format)=>{
        event.preventDefault();
        const value =event.target.value
        addMarkData(editor,{format,value})
    }



    return(
        <div className='toolbar d-flex justify-content-center' >
            {
                toolbarGroups.map((group,index) => 
                    <span key={index} className='toolbar-grp'>
                        {
                            group.map((element) => 
                                {
                                    switch (element.type) {
                                        case 'block' :
                                            return <BlockButton key={element.id} {...element}/>
                                        case 'mark':
                                            return <MarkButton key={element.id} {...element}/>
                                        case 'dropdown':
                                            return <Dropdown key={element.id} {...element} />
                    
                                        default:
                                            return <button>Invalid Button</button>
                                    }
                                }
                            )
                        }
                    </span>    
                )
            }
        </div>
    )

}

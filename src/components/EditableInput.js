import React, {useState, useRef, useEffect} from 'react'

const EditableInput = ({initialValue, onSave,  ...others}) =>{
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue)
    const [inputWidth, setInputWidth] = useState(null)

    const spanRef = useRef();

    useEffect(()=>{
        if(spanRef.current){
            const width = spanRef.current.offsetWidth;
            setInputWidth(width);
        }
    }, [isEditing]);


    const handleBlur = () =>{
        setIsEditing(false)
        onSave(value)
    }

    return (
        <td onClick={()=>setIsEditing(true)}>
            {isEditing ? (
                <input
                    className="cell-input"
                    value={value}
                    autoFocus
                    onChange={(e)=>setValue(e.target.value)}
                    onBlur = {handleBlur}
                    onKeyDown = {(e)=>{
                        if (e.key === 'Enter') handleBlur();
                    }}
                    {...others}
                    style={{ width: inputWidth ? `${inputWidth}px` : 'auto',}}
                />
                ):(
                   <span ref={spanRef}>{ value}</span>
                )}
        </td>
    )
}

export default EditableInput;
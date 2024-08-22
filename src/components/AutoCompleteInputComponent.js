import React, {useState} from 'react'
import Input from './InputComponet'
import { courses } from '../courses'

const AutoCompleteInputComponent = ({icon,  setValue, error}) =>{
    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    

    const handleInputChange = (e) =>{
        const value = e.target.value
        setInputValue(value)
        

        if (value.length > 0){
            // console.log(courses);
            const filteredCourses = courses.filter(course => 
                course.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredCourses)
        }else{
            setSuggestions([])
        }
    }

    const handleSuggestionClick = (item)=>{
        setInputValue(item.name)
       
        const code = item.day || item.eve
        setValue(code)
        setSuggestions([])
    }
    return (
        <div id="course-input">
            <Input 
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                icon={icon}
                placeholder="Type Search your course"
                error={error && error}
            
            />
            {suggestions.length > 0 && (
                <ul id="suggestion-list">
                    {suggestions.map((suggestion, index) =>(
                        <li 
                            key={index}
                            onClick={()=>handleSuggestionClick(suggestion)}
                            aria-autocomplete="list"
                            aria-controls="autocomplete-list"
                        >
                            {suggestion.name}

                        </li>
                    ))}

                </ul>
            ) }
        </div>
    )
}

export default AutoCompleteInputComponent
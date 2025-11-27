/*
Config driven forms
Requirements ================================
- config
- diff types of inputs - email, text, ...
- validations
- reusable
- state management / submission

Scope ================================
Dynamic rendering using config
Basic validation
Configurable UI / reusable
Submission handler

HLD ================================
Components
- CDF
    - config, onSubmit callback
    - renders fields
    - maintains state
    - validation / submits

- config structure
{
    type: 'text', name: 'username', label: 'Username', placeholder: 'Enter username',
    validation: {required: true}
    
    type: 'select', ....

    type: 'text', .....
}


LLD ================================

state {
    formData
        name/id - value
        if it's multi - use array

    errors
        name/id - 'Required'
}

onChange formUpdate
validate()
handleSubmit(e) - prev def, validate, onSubmit

Dyn rendering
    - map over config.. render input accordingly

*/

import { useState, useId } from 'react';
import './style.css'

const config = [
    {name: 'username', label: 'Username', type: 'text', placeholder: 'enter username', validations: {required: true}},
    // {name: 'email', label: 'Email', type: 'email', placeholder: 'enter email', validations: { required: true }},
    { name: 'gender', label: 'Gender', type: 'select', placeholder: 'select gender', options: ['Male', 'Female'], validations: { required: true }},
]


const Form = ({config, onSubmit}) => {
    const formId = useId();

    // state
    // separate objects for formData, errors
    const [stateVal, setStateVal] = useState(() => {
        const formData = {};
        const errors = {};
        for (let c of config) {
            formData[c.name] = "";
            errors[c.name] = "";
        }
        return {formData, errors};
    });

    const {formData, errors} = stateVal;

    // onChange
    const handleChange = (evt) => {
        // validator - evt.name, run on evt.val
        const val = evt.target.value;
        const key = evt.target.name;
        setStateVal({
            formData: {
                ...formData,
                [key]: val,
            },
            errors,
        })
    }

    // validator
    const validate = (key, val) => {
        let isValid = true;
        const {validations} = config.find(item => item.name === key)
        if (validations.required) {
            // ensure to clear old error message
            // when value is added
            setStateVal(({formData, errors}) => {
                return {
                    formData,
                    errors: {
                        ...errors,
                        [key]: !val ? 'Required': ''
                    }
                }
            });
            if (!val) {
                isValid = false;
            }
        }
        return isValid;
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        let isValid = true;
        for (let k in formData) {
            const val = validate(k, formData[k]);
            if (!val) {
                isValid = val;
            }
        }
        isValid && onSubmit(stateVal.formData);
        console.log("stateVal", stateVal);
    }

    return <form onSubmit={handleSubmit}>
        {config.map(item => {
            const {type, name, placeholder, label, options} = item;
            return <div key={name}>
                <div className='formElm'>
                    <label htmlFor={`${formId}-${name}`}>{label}</label>
                    {type === 'text' && <input id={`${formId}-${name}`} name={name} value={formData[name]} type={type} placeholder={placeholder} onChange={handleChange} />}
                    {type === 'select' && <select id={`${formId}-${name}`} name={name} value={formData[name]} type={type} placeholder={placeholder} onChange={handleChange}>
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map(entry => <option value={entry} key={entry}>
                            {entry}
                        </option>)}
                    </select>}
                </div>
                <div className="erroMessage">{errors[name]}</div>
                
            </div>
        })}
        <button type="submit">Submit</button>
    </form>


}

export const RenderCDF = () => {
    const handleSubmit = (formData) => {
        console.log(formData)
    }
    return <Form config={config} onSubmit={handleSubmit}/>
}





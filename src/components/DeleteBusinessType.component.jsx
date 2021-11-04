import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import './DeleteBusinessType.style.css'

const typesAPIURL = `https://617fa530055276001774fb89.mockapi.io/businessTypes`

export default function DeleteBusinessType() {
    const [listOfTypes, setListOfTypes] = useState(null)
    const [selectedType, setSelectedType] = useState(null)
    const history = useHistory();
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));


    useEffect(() => {
        const getAllTypes = async () => {
            const response = await axios.get(typesAPIURL);
            if(response.status === 200) {
                setListOfTypes(response.data)
            }
            else {
                console.log('Error, ',response);
            }
        }
        getAllTypes();
    }, [])

    const handleOnChange = (e) => {
        setSelectedType(e.target.value)
    }
    const handleDelete = async (e) => {
        const deleteAPIURl = `https://617fa530055276001774fb89.mockapi.io/businessTypes/${selectedType}`
        const response = await axios.delete(deleteAPIURl)
        if(response.status === 200) {
            alert(`Deleted type with id=${selectedType} successfully`)
            history.push('/AdminPanel/')
        }
        else {
            console.log('Error, ',response);
        }
    }
    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        listOfTypes ? 
            (<div id='deleteBusinessTypeDiv' className="floater">
                Choose a type: <select id='types-select' onChange={handleOnChange}>
                <option key={-1} value={-1} disabled selected>Select a type</option>
                {listOfTypes.map(item => {
                    return <option key={item.id} value={item.id}>{item.typeName}</option>
                })}
            </select>
            {selectedType ? <div><input type='button' value='Delete' onClick={handleDelete}/></div> : ''}
            </div>) : (<div class="loader">Loading...</div>)

    )
}

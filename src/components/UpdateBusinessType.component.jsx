import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import axios from 'axios'

const typesAPIURL = `https://617fa530055276001774fb89.mockapi.io/businessTypes`;

export default function UpdateBusinessType() {
    const [loggedInUser] = useState(JSON.parse(localStorage.getItem("userLoggedIn")));
    const [listOfTypes, setList] = useState(null)
    const [selectedType, setSelected] = useState(null)
    const [newTypeObj, setNewTypeObj] = useState({
        id: '',
        typeName: ''
    })
    const history = useHistory();

    useEffect(() => {
        const getAllTypesFromDB = async () => {
            const response = await axios.get(typesAPIURL)
            if (response.status === 200) {
                setList(response.data)
            }
            else {
                console.log('Error, ', response);
            }
        }
        getAllTypesFromDB();
    }, [])

    useEffect(() => {
        if (selectedType) {
            const getSpecificTypeFromDB = async () => {
                const response = await axios.get(`${typesAPIURL}/${selectedType}`)
                if (response.status === 200) {
                    setNewTypeObj({
                        id: response.data.id,
                        typeName: response.data.typeName,
                    })
                }
                else {
                    console.log('Error, ', response);
                }
            }
            getSpecificTypeFromDB();
        }
    }, [selectedType])

    const handleSelect = (e) => {
        setSelected(e.target.value);
    }

    const handleOnChange = (e) => { //inputs handler
        e.target.style.border = "";
        setNewTypeObj((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const updateType = async (e) => {
        e.preventDefault(); //prevent default form submitting
        let isGoodToGo = true;

        Object.entries(newTypeObj).forEach((item, index) => {
            //go over all the keys in the state object, check if any of them is empty
            if (item[1].length === 0) {
                e.target[index].style.border = "1px solid red";
                isGoodToGo = false; //if empty, set isGoodToGo to false, to prevent the api call from having empty values
            }
        });
        if (isGoodToGo) {
            //if all values are set, everything is good to go.
            const response = await axios.put(`${typesAPIURL}/${selectedType}`, newTypeObj);
            if (response.status === 200) {
                alert(`Updated type with id=${selectedType} successfully`)
                history.push("/AdminPanel/");
            }
            else {
                console.log("Error, ", response);
                alert('Error check console')
            }
        }
    }

    if (!loggedInUser || loggedInUser.authority !== 1337) {
        history.push("/");
    }
    return (
        listOfTypes ?
            (<div id='updateBusinessTypeContainer' className="floater">
                <div>
                    Select type to delete: <select id='types-select' onChange={handleSelect}>
                        <option key={-1} value={-1} selected disabled>Select a type</option>
                        {listOfTypes.map(type => {
                            return <option key={type.id} value={type.id}>{type.typeName}</option>
                        })}
                    </select>
                    {selectedType ?
                        <div id='updateDiv'>
                            <form id='updateForm' onSubmit={updateType}>
                                <div>Type ID: <input type='text' value={newTypeObj.id} disabled /></div>
                                <div>Type Name: <input type='text' name='typeName' value={newTypeObj.typeName} onChange={handleOnChange} /></div>
                                <input type='submit' value='Update' />
                            </form>
                        </div>
                        : ''}
                </div>
            </div>) : <div class="loader">Loading...</div>
    )
}

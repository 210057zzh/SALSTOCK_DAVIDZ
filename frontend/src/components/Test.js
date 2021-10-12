import Navbar from './Navbar';
import '../css/SearchBar.css'
import '../css/Home.css';
import { useContext, useState, useEffect } from 'react';
import { authContext } from './contexts/authContext';
import Error from './UserAuth/Error'
import axios from 'axios';
import Result from './SearchResult'
function Test(props) {
    const { authState, setAuthState } = useContext(authContext);
    const [search, setSearch] = useState('');
    const [err, setErr] = useState();

    function setDisplay(e) {
        setAuthState(prevState => {
            return {
                ...prevState,
                display: e
            }
        });
    }

    useEffect(() => {
        if (authState.display) {
            axios.post(REST_API_CALL, {
                params: {
                    userID: 1,
                    ticker: "apple",
                    quantity: 100,
                    total: 200
                }
            }).then(resp => {
                if (typeof resp.data == 'string') {
                    setErr(resp.data);
                }
                else {
                    setDisplay(resp.data);
                }
            })
        }
    }, [authState.loggedIn])

    const REST_API_CALL = 'http://localhost:8080/api/getStock'
    function handleChange(e) {
        setSearch(e.target.value);
    }
    function submitSearch(e) {
        if (search == '') {
            setErr("Please enter the ticker")
        }
        else {
            setErr(null);
            axios.get(REST_API_CALL, {
                params: {
                    userID: 1,
                }
            }).then(resp => {
                console.log(resp);
            })
        }
    }

    return (
        <div className='home'>
            <Navbar />
            {authState.display ? <Result /> :
                <div className={'home-search'}>
                    <div style={{ display: 'inline-flex', paddingTop: '10%' }}>
                        <div className='sprout'>STOCK SEARCH</div>
                    </div>
                    <div className='search-bar'>
                        <input type='text' className='field' placeholder='search...' onChange={handleChange} id="temporary"></input>
                        <input type='button' className='searchButton' value='search' onClick={submitSearch}></input>
                        <br></br>
                        {err ? <Error errorMsg={err}></Error> : null}
                    </div>
                </div>
            }
        </div>
    )
}

export default Test;
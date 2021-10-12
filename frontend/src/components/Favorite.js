import Navbar from './Navbar';
import '../css/Home.css';
import { useState } from 'react';
import FavoriteSnippet from './FavoriteSnippet'
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { authContext } from './contexts/authContext';
import { Alert, AlertTitle } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

function Favorite() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { authState, setAuthState } = useContext(authContext);
    const REST_API_CALL = 'http://localhost:8080/api/getFavorite'
    const [data, setData] = useState([]);
    const [divArray, setDiv] = useState([]);

    useEffect(() => {
        if (!authState.loggedIn) {
            window.location.replace('./')
        }
        axios.get(REST_API_CALL, {
            params: {
                userID: authState.user.userId
            }
        }).then(resp => {
            if (resp.data.length==0) {
                setDiv([<Alert severity="info" style={{ width: '50%', margin: '0 auto' }}>
                    Currently you have no stocks in your favorites — <strong>use the search function!</strong>
                </Alert>]);
            }
            else {
                setDiv(resp.data.map(business =>
                    <FavoriteSnippet business={business} setOpen={setOpen} setMessage={setMessage} />
                ));
            }
            if (authState.uploadReady === true) {
                setAuthState(prevState => {
                    return {
                        ...prevState,
                        uploadReady: false
                    }
                });
                setMessage('deleted from favorite');
                setOpen(true);
            }
        });
    }, [authState.loggedIn, authState.uploadReady, authState])

    return (
        <div className='discover'>
            <Navbar />
            <div style={{ margin: '0 auto', width: '50%', overflow: 'hidden' }}>
                <h1 style={{textAlign: 'left'}}>My Favorites</h1>
                <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {message}
                    </Alert>
                </Collapse>
            </div>
            <div className='home-search'>
                <div style={{ paddingTop: "2vh", width: '50%' }}></div>
                {
                    divArray
                }
            </div>
        </div>

    )
}

export default Favorite;
import '../css/DiscoverSnippet.css';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import '../css/Home.css';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useContext, useState, useEffect } from 'react';
import { authContext } from './contexts/authContext';
import axios from 'axios';
import { NavLink, withRouter } from 'react-router-dom';


function FavoriteSnippet(props) {
    const REST_API_CALL_POP = 'http://localhost:8080/api/popFavorite';
    const { authState, setAuthState } = useContext(authContext);

    function action() {
        setAuthState(prevState => {
            return {
                ...prevState,
                display: props.business
            }
        });
    }
    function change() {
        return precise(props.business.last - props.business.prevClose);
    }
    function changePercent() {
        return precise((props.business.last - props.business.prevClose) * 100 / props.business.prevClose)
    }
    function precise(x) {
        return Number.parseFloat(x).toPrecision(3);
    }

    function unFavorite() {
        console.log('pop favorite');
        axios.post(REST_API_CALL_POP, {
            params: {
                userID: authState.user.userId,
                Ticker: props.business.ticker
            }
        }).then(resp => {
            setAuthState(prevState => {
                return {
                    ...prevState,
                    uploadReady: true
                }
            });

        });
    }

    return (
        <div className='discoverLink' >
            <div className='discoverSnippet'>
                <IconButton
                    className='other'
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={unFavorite}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
                <NavLink style={{ display: 'flex', justifyContent: 'space-between' }} exact to='/' onClick={action}>
                    <div style={{ float: 'left', marginLeft: '0.5em' }}>
                        <p className='title'>{props.business.ticker}</p>
                        <div style={{ display: 'flex' }}>
                            {props.business.name}
                        </div>
                    </div>
                    <div style={{ float: 'right', marginRight: '0.5em' }}>
                        <div className={(props.business.last - props.business.prevClose) > 0 ? 'loggedin-price-green' : 'loggedin-price-red'}>
                            <h3>
                                {props.business.last}
                            </h3>
                            <h4>
                                {(props.business.last - props.business.prevClose) > 0 ? <ArrowDropUpIcon style={{ fontSize: '48px', marginBottom: 0 }} /> : <ArrowDropDownIcon style={{ fontSize: '48px', marginBottom: 0 }} />} {change()}({changePercent()})%
                        </h4>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )

}
export default withRouter(FavoriteSnippet);
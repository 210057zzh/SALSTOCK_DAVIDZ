import '../css/DiscoverSnippet1.css';
import '../css/Home.css';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useContext, useState, useEffect } from 'react';
import { authContext } from './contexts/authContext';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';



function PortSnip(props) {
    const REST_API_CALL_POP = 'http://localhost:8080/api/popFavorite';
    const { authState, setAuthState } = useContext(authContext);
    const [value, setValue] = useState('buy');
    const REST_API_CALL_BUY = 'http://localhost:8080/api/buysell';
    const [buy, setBuy] = useState(0);
    const [err, setErr] = useState(null);

    function submit() {
        props.setOpen(false);
        if (!Number.isInteger(buy * 1) || buy < 1) {
            setErr("Enter a positive integer please")
            props.setOpen(false);
            return false;
        }
        else if (buy * props.business.last > authState.user.balance) {
            setErr("you don't have enough cash")
            props.setOpen(false);
            return false;
        }
        setErr(null);
        if (value === 'buy') {
            axios.post(REST_API_CALL_BUY, {
                params: {
                    userID: authState.user.userId,
                    ticker: props.business.ticker,
                    quantity: buy * 1,
                    total: buy * props.business.last
                }
            }).then(() => {
                setAuthState(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            balance: authState.user.balance - buy * props.business.last
                        }
                    }
                });
                props.setMessage('successfully purchased ' + buy + " shares of " + props.business.ticker + " for $" + Number(buy * props.business.last).toFixed(2));
                props.setOpen(true);
            });
        }
        else {
            if (buy > props.business.quantity) {
                setErr("you are selling more than you have")
                return false;
            }
            axios.post(REST_API_CALL_BUY, {
                params: {
                    userID: authState.user.userId,
                    ticker: props.business.ticker,
                    quantity: buy * -1,
                    total: buy * -1 * props.business.last
                }
            }).then(() => {
                setAuthState(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            balance: authState.user.balance + buy * props.business.last
                        }
                    }
                });
                props.setMessage('successfully saled ' + buy + " shares of " + props.business.ticker + " for $" + Number(buy * props.business.last).toFixed(2));
                props.setOpen(true);
            });
        }
    }

    function handleChange(e) {
        setValue(e.target.value);
    }

    function action() {
        setAuthState(prevState => {
            return {
                ...prevState,
                display: props.business
            }
        });
    }


    function change() {
        return precise((props.business.total / props.business.quantity) - props.business.last);
    }

    function precise(x) {
        return Number(x).toFixed(2);
    }

    return (
        <div className='discoverLink' >
            <div className="title">
                {props.business.ticker} <span className="name">{props.business.name}</span>
            </div>
            <div className='discoverSnippet'>
                <div className='left'>
                    <div className='left-left'>
                        <h4>Quantity: </h4>
                        <h4>Avg. Cost / Share</h4>
                        <h4>Total Cost:</h4>
                    </div>
                    <div className='left-right'>
                        <h4>{props.business.quantity}</h4>
                        <h4>{precise(props.business.total / props.business.quantity)}</h4>
                        <h4>{props.business.total}</h4>
                    </div>
                </div>
                <div className='right'>
                    <div className='right-left'>
                        <h4>Change:</h4>
                        <h4>Current Price:</h4>
                        <h4>Market Value:</h4>
                    </div>
                    <div className='right-right'>
                        <div className={change() > 0 ? 'price-green' : 'price-red'}>
                            <h4>
                                {change() > 0 ? <ArrowDropUpIcon style={{ fontSize: '20px', marginTop: 0 }} /> : <ArrowDropDownIcon style={{ fontSize: '20px', marginTop: 0 }} />} {change()}
                            </h4>
                        </div>
                        <h4>{props.business.last}</h4>
                        <h4>{precise(props.business.last * props.business.quantity)}</h4>
                    </div>
                </div>
            </div>
            <div className='form'>
                <TextField
                    size='medium'
                    placeholder='quantity...'
                    margin='dense'
                    name="quantity"
                    label="quantity"
                    variant='outlined'
                    value={buy}
                    onChange={(e) => setBuy(e.target.value)}
                    error={err}
                    helperText={err ? err : ''}
                />
                <div style={{ margin: '0 auto', width: '20%' }} >
                    <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                        <FormControlLabel value="buy" control={<Radio />} label="buy" />
                        <FormControlLabel value="sell" control={<Radio />} label="sell" />
                    </RadioGroup>
                </div>
                <Button style={{ width: '20%', marginTop: '1%', fontWeight: 'bold' }} className='login-btn' size="small" onClick={submit} variant="contained" >submit!</Button>
            </div>
        </div>
    )

}
export default PortSnip;
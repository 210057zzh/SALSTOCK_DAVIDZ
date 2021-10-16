import '../css/Home.css';
import { useContext, useState, useEffect } from 'react';
import { authContext } from './contexts/authContext';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '50%'
    },
}));

function Result() {
    const classes = useStyles();
    const REST_API_CALL_POP = 'http://localhost:8080/api/popFavorite'
    const REST_API_CALL_ADD = 'http://localhost:8080/api/addFavorite'
    const { authState, setAuthState } = useContext(authContext);
    const [value, setValue] = useState(authState.display.favorite ? 1 : 0)
    var uploading = false;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [buy, setBuy] = useState(0);
    const [err, setErr] = useState();
    const REST_API_CALL_BUY = 'http://localhost:8080/api/buysell'

    function change() {
        return precise(authState.display.last - authState.display.prevClose);
    }

    function changePercent() {
        return precise((authState.display.last - authState.display.prevClose) * 100 / authState.display.prevClose)
    }

    function precise(x) {
        return Number.parseFloat(x).toPrecision(3);
    }

    function purchase() {
        if (!Number.isInteger(buy * 1) || buy < 1) {
            setErr("Enter a positive integer please")
            setOpen(false);
        }
        else if (buy * authState.display.last > authState.user.balance) {
            setErr("you don't have enough cash")
            setOpen(false);
        }
        else if (marketStatus()) {
            setErr("Market closed")
            setOpen(false);
        }
        else {
            setErr(null);
            axios.post(REST_API_CALL_BUY, {
                params: {
                    userID: authState.user.userId,
                    ticker: authState.display.ticker,
                    quantity: buy * 1,
                    total: buy * authState.display.last
                }
            }).then(() => {
                setAuthState(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            balance: authState.user.balance - buy * authState.display.last
                        }
                    }
                });
                setMessage('successfully purchased ' + buy + " shares of " + authState.display.ticker + " for $" + Number(buy * authState.display.last).toFixed(2));
                setOpen(true);
            })
        }
    }



    function apple() {
        if (!marketStatus()) {
            return (<Alert variant="filled" severity="success" >
                Market Open!
            </Alert>);
        }
        else {
            return (<Alert variant="filled" severity="warning" color='error'>
                Market Closed on {authState.display.timestamp.slice(0, 10) + ' ' + authState.display.timestamp.slice(11, 19)}
            </Alert>)
        }
    }

    function orange() {
        if (!marketStatus()) {
            return (<div className={authState.loggedIn ? 'loggedin-lower-right' : 'guest-lower-right'}>
                <p>Mid Price: {authState.display.mid ? authState.display.mid : '-'}</p>
                <p>Ask Price: {authState.display.askPrice ? authState.display.askPrice : '-'}</p>
                <p>Ask Size: {authState.display.askSize ? authState.display.askSize : '-'}</p>
                <p>Bid Price: {authState.display.bidPrice ? authState.display.bidPrice : '-'}</p>
                <p>Bid Size: {authState.display.bidSize ? authState.display.bidSize : '-'}</p>
            </div>)
        }
        else {
            return null;
        }
    }

    function marketStatus() {
        const start = 6 * 60 + 30;
        const end = 13 * 60;
        const date = new Date();
        const now = date.getHours() * 60 + date.getMinutes();
        return (start <= now && now <= end)
    }

    useEffect(() => {
        setValue(authState.display.favorite ? 1 : 0);
    }, [authState.display])

    function updateFavorite(event, newValue) {
        if (uploading === false) {
            uploading = true;
            setValue(newValue);
            if (!newValue) {
                console.log('pop favorite');
                axios.post(REST_API_CALL_POP, {
                    params: {
                        userID: authState.user.userId,
                        Ticker: authState.display.ticker
                    }
                }).then(resp => {
                    uploading = false;
                    setMessage('deleted from favorite');
                    setOpen(true);
                });
            }
            else {
                console.log('add favorite');
                axios.post(REST_API_CALL_ADD, {
                    params: {
                        userID: authState.user.userId,
                        Ticker: authState.display.ticker
                    }
                }).then(resp => {
                    setMessage('added to favorite');
                    setOpen(true);
                });
            }
        }
    }

    return (
        <div className="result" style={{ height: '100vh' }}  >
            <br></br>
            <div style={{ margin: '0 auto', width: '50%' }}>
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
            <div style={{ width: '50%', margin: "0 auto", display: 'inline-block', overflow: 'clip' }}>
                <div className={authState.loggedIn ? 'loggedin-symbol' : 'guest-symbol'}>
                    <h3  >{authState.display.ticker}
                        {!authState.loggedIn ? null :
                            <Rating
                                size="large"
                                disabled={uploading}
                                size="large"
                                name="hover-feedback"
                                value={value}
                                precision={1}
                                max={1}
                                onChange={updateFavorite}
                            />}
                    </h3>
                    <h4>{authState.display.name}</h4>
                    <p>{authState.display.exchangeCode}</p>
                    {!authState.loggedIn ? null :
                        <div style={{ float: 'left' }}>
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
                            <br></br>
                            <Button style={{ float: 'left', fontWeight: 'bold' }} size="small" type="submit" variant="contained" onClick={purchase} >Buy</Button>
                        </div>
                    }
                </div>
                {!authState.loggedIn ? null :
                    <div className={(authState.display.last - authState.display.prevClose) > 0 ? 'loggedin-price-green' : 'loggedin-price-red'}>
                        <h3>
                            {authState.display.last}
                        </h3>
                        <h4>
                            {(authState.display.last - authState.display.prevClose) > 0 ? <ArrowDropUpIcon style={{ fontSize: '48px', marginBottom: 0 }} /> : <ArrowDropDownIcon style={{ fontSize: '48px', marginBottom: 0 }} />} {change()}({changePercent()})%
                        </h4>
                        <p style={{ color: 'black', fontSize: 20 }}>
                            {(new Date()).toLocaleString("en-us", { timezone: 'America/Los Angeles' })}
                        </p>
                    </div>
                }
            </div>
            <br></br>
            <br></br>
            <div style={{ margin: '0 auto', width: '30%' }}>
                {
                    !authState.loggedIn ? null : apple()
                }
            </div>
            <div style={{ marginTop: 1, width: '50%', margin: "0 auto", overflow: 'clip' }}>
                <h4>Summary</h4>
                <hr ></hr>
                <div className={authState.loggedIn ? 'loggedin-lower' : 'guest-lower'}>
                    <div className={authState.loggedIn ? 'loggedin-lower-left' : 'guest-lower-left'} >
                        <p>High Price: {authState.display.high}</p>
                        <p>Low Price: {authState.display.low}</p>
                        <p>Open Price: {authState.display.open}</p>
                        <p>Close Price: {authState.display.close}</p>
                        <p>Volume: {authState.display.volume}</p>
                    </div>
                    {!authState.loggedIn ? null :
                        orange()
                    }
                </div>

                <div className='CompanyDescription'>
                    <h3>Company's Description</h3>
                    <p style={{ textAlign: "left" }}>Start Date: {authState.display.startDate}</p>
                    <p style={{ textAlign: "left" }}>{authState.display.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Result;
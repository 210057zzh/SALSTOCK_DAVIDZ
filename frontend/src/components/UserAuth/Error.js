function Error(props) {
    return(
        <div className='error'>
            <div >{props.errorMsg}</div>
        </div>
    );
}

export default Error;
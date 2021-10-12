import validator from 'validator';

export const validateSignUpForm = payload => {
    const errors = {};
    let message = "";
    let isFormValid = true;

    if (
        !payload ||
        typeof payload.email !== "string" ||
        !validator.isEmail(payload.email)
    ) {
        isFormValid = false;
        errors.email = "Please provide a correct email address.";
    }

    if (
        !payload ||
        typeof payload.password !== "string" ||
        payload.password.trim().length < 8
    ) {
        isFormValid = false;
        errors.password = "Password must have at least 8 characters.";
    }

    if (!payload || payload.pwconfirm !== payload.password) {
        isFormValid = false;
        errors.pwconfirm = "Password confirmation doesn't match.";
    }

    if (
        !payload ||
        typeof payload.pwconfirm !== "string" ||
        payload.pwconfirm.trim().length === 0
    ) {
        isFormValid = false;
        errors.pwconfirm = "Please provide your Password confirmation.";
    }

    if (!isFormValid) {
        message = "Check the form for errors.";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
};

export const validateLoginForm = payload => {
    const errors = {};
    let message = "";
    let isFormValid = true;

    if (
        !payload ||
        typeof payload.password !== "string" ||
        payload.password.trim().length === 0
    ) {
        isFormValid = false;
        errors.password = "Please provide your password.";
    }

    if (
        !payload ||
        typeof payload.email !== "string" ||
        payload.email.trim().length === 0
    ) {
        isFormValid = false;
        errors.email = "Please provide your email.";
    }

    if (!isFormValid) {
        message = "Check the form for errors.";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
};

export const validateBusinessEdit = payload => {
    const errors = {};
    let message = "";
    let isFormValid = true;
    if (
        !payload ||
        typeof payload.name !== "string" ||
        payload.name.trim().length === 0
    ) {
        isFormValid = false;
        errors.name = "Please provide your business name.";
    }
    let tempstart = null;
    let tempend = null;
    if (payload.startingTime) { tempstart = payload.startingTime.slice(0, 2) + payload.startingTime.slice(3, payload.startingTime.length) }
    else { tempstart = payload.startHour.slice(0, 2) + payload.startHour.slice(3, payload.startHour.length) }
    if (payload.endingTime) { tempend = payload.endingTime.slice(0, 2) + payload.endingTime.slice(3, payload.endingTime.length) }
    else { tempend = payload.endHour.slice(0, 2) + payload.endHour.slice(3, payload.endHour.length) }

    if (
        !payload ||
        (tempend - tempstart) <= 0
    ) {
        isFormValid = false;
        errors.time = "start time and end time is invalid";
    }

    if (payload.category) {
        if (
            !payload ||
            typeof payload.category !== "string" ||
            payload.category.trim().length === 0
        ) {
            isFormValid = false;
            errors.category = "Please provide your business category.";
        }
    }

    if (
        !payload ||
        typeof payload.description !== "string" ||
        payload.description.trim().length === 0
    ) {
        isFormValid = false;
        errors.description = "Please provide your business description.";
    }

    if (
        !payload ||
        typeof payload.otherInfo !== "string" ||
        payload.otherInfo.trim().length === 0
    ) {
        isFormValid = false;
        errors.otherInfo = "Please provide your business otherInfo.";
    }

    if (payload.phone) {
        if (
            !payload ||
            typeof payload.phone !== "string" ||
            payload.phone.trim().length !== 14
        ) {
            isFormValid = false;
            errors.phone = "Not a valid phone number.";
        }
    }

    if (
        !payload ||
        typeof payload.email !== "string" ||
        !validator.isEmail(payload.email)
    ) {
        isFormValid = false;
        errors.email = "Please provide a correct email address.";
    }

    if (
        !payload ||
        typeof payload.address !== "string" || payload.address.trim().length === 0
    ) {
        isFormValid = false;
        errors.address = "Please provide a address.";
    }

    if (
        !payload ||
        typeof payload.website !== "string" || !validator.isURL(payload.website)
    ) {
        isFormValid = false;
        errors.website = "Please provide a valid URL.";
    }

    if (!isFormValid) {
        message = "Check the form for errors.";
    }

    return {
        success: isFormValid,
        message,
        errors
    };


}

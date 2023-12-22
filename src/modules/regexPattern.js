const regexPattern = {
    userIDRegex : /^\w[\w\d!@#$%^&*()_+{}|:"<>?/-]{1,19}$/,
    userPwRegex : /^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-]).{1,20}$/,
    userNameRegex : /^[가-힣]{2,5}$/,
    userPhonenumberRegex : /^[0-9]{10,12}$/,
    userBirthRegex : /^[\d]{4}-[\d]{2}-[\d]{2}$/
}

module.exports = regexPattern;
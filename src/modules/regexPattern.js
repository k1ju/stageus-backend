const regexPattern = {
    userIDRegex : /^\w[\w\d!@#$%^&*()_+{}|:"<>?/-]{1,19}$/,
    userPwRegex : /^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-]).{1,20}$/,
    userNameRegex : /^[가-힣]{2,5}$/,
    userPhonenumberRegex : /^[0-9]{10,12}$/,
    userBirthRegex : /^[\d]{4}-[\d]{2}-[\d]{2}$/,

    nullCheck: (tmp) => {
        if(typeof tmp == "number" || typeof tmp == "boolean") return;
        // 숫자형, 불리언 일때 처리 
        if(!tmp?.trim()) throw new Error("입력받은 값중에 빈값이 있습니다")
    }
}

module.exports = regexPattern;
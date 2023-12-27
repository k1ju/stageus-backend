const pattern = {

    userIDCheck: (tmp) => {
        const userIDRegex = /^\w[\w\d!@#$%^&*()_+{}|:"<>?/-]{1,19}$/
        if(!userIDRegex.test(tmp)) throw new Error("아이디 형식 불일치")
    },

    userPwCheck: (tmp) => {
        const userPwRegex = /^(?=.*\w)(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?/-]).{1,20}$/
        if(!userPwRegex.test(tmp)) throw new Error("비밀번호 형식 불일치")
    },

    userNameCheck: (tmp) => {
        const userNameRegex = /^[가-힣]{2,5}$/
        if(!userNameRegex.test(tmp)) throw new Error("이름 형식 불일치")
    },

    userPhonenumberCheck: (tmp) => {
        const userPhonenumberRegex = /^[0-9]{10,12}$/
        if(!userPhonenumberRegex.test(tmp)) throw new Error("전화번호 형식 불일치")
    },

    userBirthCheck: (tmp) => {
        const userBirthRegex = /^[\d]{4}-[\d]{2}-[\d]{2}$/
        if(!userBirthRegex.test(tmp)) throw new Error("생일 형식 불일치")
    },

    nullCheck: (tmp) => {
        if(typeof tmp == "number" || typeof tmp == "boolean") return;
        // 숫자형, 불리언 일때 처리 
        if(!tmp?.trim()) throw new Error("입력받은 값중에 빈값이 있습니다")
    }
}

module.exports = pattern;
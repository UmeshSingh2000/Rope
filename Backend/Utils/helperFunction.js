const checkEmail=()=>{
    const email = document.getElementById("email").value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

module.exports={
    checkEmail
}